import cloudinary from "@/lib/cloudinary"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(req) {
        try {
            console.log("updating profile");
            let data = await req.json()
            console.log(data);
            
                        if (data.avatar){
                let {secure_url} = await cloudinary.uploader.upload(data.avatar)
                data.avatar = secure_url 
            }
            let {id , ...rest} = data
            
            await prisma.account.update({
                where : {
                    id : id,
                },
                data :  rest
            })
            return NextResponse.json({Message : "Updated"},{status : 200})
        } catch (error) {
            
            return NextResponse.json({Message : "Internal Server Error",error },{status : 500})
            
        }
}