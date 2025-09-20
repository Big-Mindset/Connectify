
import { getSession } from "@/lib/getserverSession";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
          const session = await getSession()

        if (!session){
            return NextResponse.json({message : "Unauthorized - login first"},{status : 401})

        }
        let userId = session?.user?.id
        
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
                
                sender : {
                    
                    select : {
                        id : true,
                     avatar : true,
                     name : true,
                     bio : true,
                    lastseen : true,
                    sender : {
                        
                        where : {
                            receiverId : userId,
                            status : {
                                not : "read"
                            },
                            
                        },
                        select :{
                            id : true
                        }
                    }
                }
            },
                receiver : {
                    select : {
                        id : true,
                     avatar : true,
                     name : true,
                     bio : true,
                     lastseen : true,
                     
                    sender : {
                        
                        where : {
                            receiverId : userId,
                            status : {
                                not : "read"
                            },
                            
                        },
                        select :{
                            id : true
                        }
                    }
                    }
                }
            },

        })
        
        let friends = allusers.map((user)=>{
            let isme = user.sender.id === userId
            let friend = isme ? user.receiver : user.sender
            console.log(user);
            
            return {id : user.id,friend : {...friend,UnReadedMessageCount : friend?.sender.length || 0,sender: null}}
        })

   
        let Users = await Promise.all(

            friends.map(async(user)=>{
                let lastmessage =  await prisma.message.findFirst({
            where : {
                OR : [
                    {senderId : userId , receiverId : user.friend.id,DeleteForMe : false},
                    {receiverId : userId , senderId : user.friend.id}
                ],
               
            },
            orderBy : {
                createdAt : "desc"
            },
            select : {
                id : true,
                content : true,
                image : true,
                status : true,
                senderId : true,
                createdAt : true,
                DeleteForEveryone : true,
            }
        })
        return  {...user,lastmessage}
        
    }))
        
    if (!allusers){
        return NextResponse.json({message : "Users not found"},{status : 200})
        }
        return NextResponse.json({users :Users},{status : 200})
    } catch (error) {
        console.log(error.message);
        
        return NextResponse.json({message : "Netowrk Error try again"},{status : 500})
    }
}