import prisma, { message } from "@/lib/prisma";
import { getSession } from "@/lib/getserverSession";
import { NextResponse } from "next/server";

export async function GET(req){
    let session = await getSession()
    if (!session){
        return NextResponse.json({message : "Unauthorized - login and try again"},{status : 401})
    }

    let {searchParams} = new URL(req.url)
    let senderId = searchParams.get("senderId")
    let receiverId = searchParams.get("receiverId")
    let cursor = searchParams.get("lastMessage")
    try {
        let Messages;
if (cursor){

    Messages = await prisma.message.findMany({
        where : {
            OR : [
                    {senderId : senderId , receiverId : receiverId},
                    {receiverId : senderId ,senderId : receiverId  }
                ]
            },
            cursor : {
                id : cursor
            },
            skip  : 1,
            take : 30,
            orderBy : {
                createdAt : "desc"
            },
            
        })
        
    }else{
        console.log("fetching...");
        
        Messages = await prisma.message.findMany({
            where : {
                OR : [
                        {senderId : senderId , receiverId : receiverId},
                        {receiverId : senderId ,senderId : receiverId  }
                    ]
                },
                orderBy : {
                    createdAt : "desc"
                },
                take : 50,
                
            })
    }
    console.log(Messages[0]);
    
        return NextResponse.json({message : "Messsages available",Messages},{status : 200})

    } catch (error) {
     
        console.log(error.message);
        
        return NextResponse.json({message : "Check your network connection"},{status : 500})
        
    }
}