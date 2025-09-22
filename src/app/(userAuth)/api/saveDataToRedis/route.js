
import {  transporter } from "@/lib/nodemailer";
import { randomUUID } from "crypto"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma";
import { EmailVerification } from "@/components/EmailTemplate";
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
            select : {
                accounts : {
                    select : {
                        provider : true
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
        
        let res = await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: data.email,
            subject: "Connectify Verification Email",
            html: EmailVerification(data.name  , data.email , otp),
          });
          
          
        
        return NextResponse.json({ message: "Verify your email", token: token }, { status: 200 })

    } catch (error) {

        return NextResponse.json({ message: "Internal server error",error : error.message }, { status: 500 })

    }

}