import { EmailVerification } from "@/components/EmailTemplate"
const nodemailer = require("nodemailer") 
import { randomUUID } from "crypto"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma";
import { client } from "@/lib/redis";

export async function POST(req) {
    try {
        let data = await req.json()
        
        if (!data) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 })
        }

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

        let userData = { 
            ...data, 
            password: hashedPassword, 
            otp: otp, 
            otpExpiresAt: (Date.now() + 50 * 1000).toString() 
        }

        await client.hSet(`User_Session-${token}`, userData)

        // Create transporter with better error handling
        let transporter = nodemailer.createTransporter({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER || "wadoodmemon0@gmail.com", // Use environment variables
                pass: process.env.EMAIL_PASS || "wzzj iaoh nzts gfra",
            },
            // Add these for better reliability
            tls: {
                rejectUnauthorized: false
            }
        });

        // Verify transporter connection
        await transporter.verify();
        console.log("SMTP connection verified successfully");

        // Send email with better error handling
        const emailResult = await transporter.sendMail({
            from: `"Connectify" <${process.env.EMAIL_USER || "wadoodmemon0@gmail.com"}>`, // Better from format
            to: data.email,
            subject: "Connectify Verification Email",
            html: EmailVerification(data.name, data.email, otp)
        });

        console.log("Email sent successfully:", emailResult.messageId);

        return NextResponse.json({ 
            message: "Verify your email", 
            token: token 
        }, { status: 200 })

    } catch (error) {
        console.error("Email sending error:", error);
        
        // More specific error handling
        if (error.code === 'EAUTH') {
            return NextResponse.json({ 
                message: "Email authentication failed. Check credentials." 
            }, { status: 500 })
        }
        
        if (error.code === 'ECONNECTION') {
            return NextResponse.json({ 
                message: "Failed to connect to email server." 
            }, { status: 500 })
        }

        return NextResponse.json({ 
            message: "Internal server error", 
            error: error.message 
        }, { status: 500 })
    }
}