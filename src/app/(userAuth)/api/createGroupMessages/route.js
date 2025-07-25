import cloudinary from "@/lib/cloudinary"
import { getSession } from "@/lib/getserverSession";
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export  async function POST(req) {
    try {
        let session = getSession()
        if (!session){
            return NextResponse.json({message : "Unauthorized"},{status : 401})
        }
        let {senderId , content,image,groupId} = await req.json()
        let imageUrl;
        if (image){
            imageUrl = await cloudinary.uploader.upload(image)

        }
        
        let groupMessages = await prisma.groupMessages.create({
            data : {
                content,
                group : {
                    connect : {
                        id : groupId
                    }
                },
                sender : {
                    connect : {
                        id : senderId
                    }
                },
                image : imageUrl?.secure_url || "",  
            }
        })
        
        if (!groupMessages){
            return NextResponse.json({message : "Message send failed"},{status : 404})
        }
        return NextResponse.json({message : "Messages Sent"},{status : 201})
        
    } catch (error) {
        console.log(error.message);
        
        return NextResponse.json({message : "Server Error - Something went wrong"},{status : 500})
    }
}