import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export  async function POST(req) {
    try {
    let {senderId , receiverId } = await req.json()
 
    let res = await prisma.friendRequest.create({
        
        data : {
            sender : {
                connect : {
                    id : senderId
                }
            },
            receiver : {
                connect : {
                    id : receiverId
                }
            },

        }
    })
    return NextResponse.json({message :  "Request sent successfully",data : {status : res.status,id : res.id,createdAt : res.createdAt}},{success : 204})
    } catch (error) {
        console.log(error.message);
        
     return NextResponse.json({message : "Internal server Error"},{status : 500})   
    }
}