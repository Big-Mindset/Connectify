
import { EmailVerification } from "@/components/EmailTemplate";
import { transporter } from "@/lib/nodemailer";
import { client } from "@/lib/redis";
import { NextResponse } from "next/server"
                                                                                                               
export async function PUT(req) {
    try {
        let {token,email,name} = await req.json()
        console.log(email , name);
        
        if (!token){
            return NextResponse.json({Message : "Something went wrong try again"})
        }
        let otp = Date.now().toString().slice(7).toUpperCase()
        let expiry =( Date.now() + 50 *1000)
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: "Test Email",
            html: EmailVerification( name, email , otp),
          });
          
        await client.hSet(`User_Session-${token}`,{
            otp : otp,
            otpExpiresAt : expiry.toString()
        })
        return NextResponse.json({Message : "Rsend Successfully"},{status : 201})
    }catch (err){
        console.log(err.message);
        
        return NextResponse.json({Message : "Internal Server Error"},{status : 500})
    }
    }