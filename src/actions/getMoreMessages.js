"use server"

import prisma from "@/lib/prisma"

export const getMoreMessages = async (id)=>{
    try {
        
        let message = await prisma.message.findMany({
            cursor : {
                id 
            },
            skip : 1,
            take : 30,
            orderBy : {
                createdAt : "desc"
            }
        })
        return {ok : true , message}
    } catch (error) {
        return {ok : false , error : error.message}
    }
    
}