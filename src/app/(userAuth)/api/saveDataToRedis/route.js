import { randomUUID } from "crypto"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma";
import { EmailVerification } from "@/components/EmailTemplate";
import { client } from "@/lib/redis";
import { Resend } from "resend";
console.log(process.env.RESEND_API_KEY);

const resend = new Resend("re_cFByMuYk_CQGbQa8ebg9TcrZg5e7iQaxb");

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
        console.log("running request");
        
               const {  data : emailData , error } = await resend.emails.send({
            from: 'Connectify <onboarding@resend.dev>', // Use resend.dev for testing
            to: [data.email],
            subject: 'Connectify Verification Email',
            html: EmailVerification(data.name, data.email, otp),
        });
        if (error){
            console.log(error);
            
        }
        console.log('Email sent successfully:', emailData);
        return NextResponse.json({ message: "Verify your email", token: token }, { status: 200 })

    } catch (error) {

        return NextResponse.json({ message: "Internal server error",error : error.message }, { status: 500 })

    }

}