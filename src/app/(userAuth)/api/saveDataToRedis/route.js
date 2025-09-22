import { transporter } from "@/lib/nodemailer";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { EmailVerification } from "@/components/EmailTemplate";
import { client } from "@/lib/redis";

export async function POST(req) {
  try {
    console.log("👉 API /api/saveDataToRedis HIT");

    let data = await req.json();
    console.log("📩 Parsed request body:", data);

    if (!data) {
      console.log("❌ Missing data in request body");
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    console.log("🔍 Checking if user exists:", data.email);
    let isCreated = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
      select: {
        accounts: {
          select: {
            provider: true,
          },
        },
      },
    });
    console.log("✅ Prisma result (user check):", isCreated);

    if (isCreated) {
      console.log("⚠️ User already exists in DB");
      if (
        isCreated?.accounts?.some((acc) => acc.provider === "credentials")
      ) {
        console.log("❌ User already has credentials account");
        return NextResponse.json(
          { message: "Account already existed with this email" },
          { status: 400 }
        );
      }
    }

    console.log("🔑 Generating bcrypt salt...");
    let salt = await bcrypt.genSalt(10);

    console.log("🔒 Hashing password...");
    let hashedPassword = await bcrypt.hash(data.password, salt);

    let token = randomUUID();
    let otp = Date.now().toString().slice(7).toUpperCase();
    console.log("🆔 Generated token:", token, "OTP:", otp);

    let userData = {
      ...data,
      password: hashedPassword,
      otp: otp,
      otpExpiresAt: (Date.now() + 50 * 1000).toString(),
    };
    console.log("📦 Final userData object:", userData);

    console.log("💾 Saving session data in Redis...");
    await client.hSet(`User_Session-${token}`, userData);
    console.log("✅ Redis save successful");

    console.log("📨 Sending verification email...");
    let res = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: data.email,
      subject: "Connectify Verification Email",
      html: EmailVerification(data.name, data.email, otp),
    });
    console.log("✅ Email sent successfully:", res.messageId);

    console.log("🎉 All steps completed successfully");
    return NextResponse.json(
      { message: "Verify your email", token: token },
      { status: 200 }
    );
  } catch (error) {
    console.error("💥 Error in /api/saveDataToRedis:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
