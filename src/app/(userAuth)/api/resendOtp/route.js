
import { EmailVerification } from "@/components/EmailTemplate";
import { client } from "@/lib/redis";
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
export async function PUT(req) {
    try {
        console.log("resending...");
        
        let { token, email, name } = await req.json()

        if (!token) {
            return NextResponse.json({ Message: "Something went wrong try again" })
        }
        let otp = Date.now().toString().slice(7).toUpperCase()
        let expiry = (Date.now() + 50 * 1000)

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "wadoodmemon0@@gmail.com",
                pass: "wzzj iaoh nzts gfra", 
            },
        });

        await transporter.sendMail({
            from: "Connectify <wadoodmemon0@gmail.com>",
            to: email,
            subject: "Connectify Verification Email",
            html: EmailVerification(name, email, otp),
        });

        await client.hSet(`User_Session-${token}`, {
            otp: otp,
            otpExpiresAt: expiry.toString()
        })
        return NextResponse.json({ Message: "Rsend Successfully" }, { status: 201 })
    } catch (err) {

        return NextResponse.json({ Message: "Internal Server Error" }, { status: 500 })
    }
}