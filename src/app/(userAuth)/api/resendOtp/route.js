
import { EmailVerification } from "@/components/EmailTemplate";
import { client } from "@/lib/redis";
import { NextResponse } from "next/server"
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
                                                                                                               
export async function PUT(req) {
    try {
        let {token,email,name} = await req.json()
        
        if (!token){
            return NextResponse.json({Message : "Something went wrong try again"})
        }
        let otp = Date.now().toString().slice(7).toUpperCase()
        let expiry =( Date.now() + 50 *1000)
          
       const {  data : emailData , error } = await resend.emails.send({
            from: 'Connectify <onboarding@resend.dev>', // Use resend.dev for testing
            to: [data.email],
            subject: 'Connectify Verification Email',
            html: EmailVerification(name, email, otp),
        });
        if (error){
            console.log(error);
        }
        console.log(emailData);
        
        await client.hSet(`User_Session-${token}`,{
            otp : otp,
            otpExpiresAt : expiry.toString()
        })
        return NextResponse.json({Message : "Rsend Successfully"},{status : 201})
    }catch (err){
        
        return NextResponse.json({Message : "Internal Server Error"},{status : 500})
    }
    }