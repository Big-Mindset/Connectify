import { getSession } from "@/lib/getserverSession";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
      let session = await getSession()
        if (!session){
            return NextResponse.json({message : "Unauthorized - login and try again"},{status : 401})
        }
        let userId = session.user.id
        try {
            let allusers = await prisma.friendRequest.findMany({
                where : {
                    status : "Accepted",
                    OR : [
                        {senderId  : userId},
                        {receiverId : userId}
                    ]
                },
               
                select : {
                    id : true,
                  receiverId : true,
                  senderId : true
                
                },
    
            })
            let AllMessage = await Promise.all(

                allusers.map( async (user)=>{
                    let messages = await prisma.message.findMany({
                        where : {

                            OR : [
                                {senderId : user.senderId , receiverId : user.receiverId},
                                {receiverId : user.senderId , senderId : user.receiverId},
                            ],
                        },
                        take : 100,
                        orderBy : {
                            createdAt : "desc"
                        }
                    })
                    return {id : user.id , messages}
                })
            )
            if (AllMessage.length === 0 ){
            return NextResponse.json({Message : "No Messages Found"},{status : 200})

            }
            return NextResponse.json({Message : "Messages Found" , Messages : AllMessage},{status : 200})
        } catch (error) {
            console.log(error.message);
            
            return NextResponse.json({Message : "Internal Server Error",error : error.message},{status : 500})
        }
}