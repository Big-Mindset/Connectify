import { randomUUID } from "crypto"
import nodemailer from "nodemailer"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma";
import { EmailVerification } from "@/components/EmailTemplate";
import { client } from "@/lib/redis";
import { Resend } from "resend";

const resend = new Resend("re_cFByMuYk_CQGbQa8ebg9TcrZg5e7iQaxb");

export async function POST(req) {
    try {

        let data = await req.json()


        if (!data) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 })
        }
        console.log("running the mail");

        let isCreated = await prisma.user.findUnique({
            where: {
                email: data.email
            },
            select: {
                accounts: {
                    select: {
                        provider: true
                    }
                }
            }
        })
        if (isCreated) {

            if (isCreated?.accounts?.some((acc) => acc.provider === "credentials")) {
                return NextResponse.json({ message: "Account already existed with this email" }, { status: 400 })

            }
        }
        let salt = await bcrypt.genSalt(10)

        let hashedPassword = await bcrypt.hash(data.password, salt)
        let token = randomUUID()
        let otp = Date.now().toString().slice(7).toUpperCase()

        let userData = { ...data, password: hashedPassword, otp: otp, otpExpiresAt: (Date.now() + 50 * 1000).toString() }


        await client.hSet(`User_Session-${token}`, userData)

        console.log("sending the mail");
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "wadoodmemon0@@gmail.com",
                pass: "wzzj iaoh nzts gfra", // generated in Google account
            },
        });

        await transporter.sendMail({
            from: "Connectify <wadoodmemon0@gmail.com>",
            to: data.email,
            subject: "Connectify Verification Email",
            html: EmailVerification(data.name, data.email, otp),
        });


        return NextResponse.json({ message: "Verify your email", token: token }, { status: 200 })

    } catch (error) {

        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 })

    }

}