import cloudinary from "@/lib/cloudinary";
import { getSession } from "@/lib/getserverSession";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(res){
    try {
         let session = await getSession()
            if (!session){
                return NextResponse.json({message : "Unauthorized - login and try again"},{status : 401})
            }
        let {data} = await res.json()
  
        let secure_url ;
        if (data.image){
            let url = await cloudinary.uploader.upload(data.image)
             secure_url = cloudinary.url(url.public_id,{
                transformation : [
                    {
                        quality : "auto",
                        gravity : "auto",
                        fill : "auto",
                        fetch_format: "auto"

                    },{
                        width : 100,
                        height : 120
                    },
                ]
            })
        }
        
        let message = await prisma.message.create({
            data : {
                content : data.content,
                image : secure_url || "",
                receiverId : data.receiver,
                senderId : session.user.costomId,
            }
        })
 
        
        if (message){
            return NextResponse.json({created : true},{status : 201})
        }else{
            return NextResponse.json({message : "error sending message try again"},{status : 201})

        }

    } catch (error) {
        console.log(error.message);
        
        return NextResponse.json({message : "Network problem try again"},{status : 500})
        
    }
}

// 200 OK
// 201 Created
// 204 No Content
// 400 Bad Request
// 401 Unauthorized
// 403 Forbidden
// 404 Not Found
// 405 Method Not Allowed
// 409 Conflict
// 422 Unprocessable Entity
// 429 Too Many Requests
// 500 Internal Server Error
// 502 Bad Gateway
// 503 Service Unavailable
// 504 Gateway Timeout
