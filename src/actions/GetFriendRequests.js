"use server"

import { getSession } from "@/lib/getserverSession"
import prisma from "@/lib/prisma"

export const GetFriendRequests =async () => {
    let session = await getSession()
    let id = session.user.id
    try {
        if (!id){
            return {status : 400 , message : "userId is not defined"}
        }
        let requests = await prisma.friendRequest.findMany({
            where  : {
                OR : [
                    {senderId : id},
                    {receiverId : id}
                ],
                status : "Pending"
            },
            orderBy : {
                createdAt : "asc"
            },
            take : 10,
            select  : {
                createdAt : true,
                id : true,
                status : true,
                senderId : true,
                sender : {
                    select : {
                        avatar : true,
                        bio : true,
                        name : true,

                    }
                },
                receiver : {
                    select : {
                        avatar : true,
                        bio : true,
                        name : true,

                    }
                }
            }
        })    
        
       let Requests =  requests.map((request)=>{
       
            if (request.senderId === id){
                
                
                return {id : request.id , createdAt : request.createdAt,status : request.status,senderId : request.senderId,data :request.receiver }
            }else{
              

                return {id : request.id , createdAt : request.createdAt,status : request.status,senderId : request.senderId,data :request.sender }

            }
        })

        return {status : 200 , Requests}

    } catch (error) {
        return {status : 500 , message : "Internal server Error"}
        
    }

}
