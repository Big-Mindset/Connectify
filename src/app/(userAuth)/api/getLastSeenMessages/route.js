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
                  senderId : true,
                  sender : {
                    select : {
                        lastseen : true
                        
                    }
                  },
                  receiver : {
                    select : {
                        lastseen  :true
                    }
                  }
                
                },
    
            })

           
            let AllMessage = await Promise.all(
                allusers.map(async (user)=>{
                    let lastseen = user.senderId === userId ? user.sender.lastseen : user.receiver.lastseen

                    let messages =  await prisma.message.findMany({
                        where : {

                            OR : [
                                {senderId : user.senderId , receiverId : user.receiverId},
                                {receiverId : user.senderId , senderId : user.receiverId},
                            ],
                            updatedAt : {
                                gte : lastseen
                            }
                        },
                        include : {
                            Reactors : true
                        }
                        
                    })
                    return {id : user.id , messages}
                })
            )
            let Reactions = await Promise.all(
                allusers.map(async (user)=>{

                let lastseen = user.senderId === userId ? user.sender.lastseen : user.receiver.lastseen

                
                let reactions =  await prisma.reaction.findMany({
                        where : {
                            updatedAt : {
                                gt : lastseen
                            },
                            OR : [
                                {reactorId : user.senderId},
                                {reactorId : user.receiverId},
                            ]
                            
                        }
                    })
                    return {chatId : user.id , Chat_Reactions : reactions}
                })
                )
               
                    let filteredMessages = AllMessage.filter((msg)=>msg.messages.length > 0)
                 let filteredReacions = Reactions.filter((reaction)=>reaction.Chat_Reactions.length > 0)

            if (AllMessage.length === 0 ){
                return NextResponse.json({Message : "No Messages Found"},{status : 200})
            }
            return NextResponse.json({Message : "Messages Found" , Messages : filteredMessages,Reactions : filteredReacions},{status : 200})
        } catch (error) {
            console.log(error.message);
            
            return NextResponse.json({Message : "Internal Server Error",error : error.message},{status : 500})
        }
}