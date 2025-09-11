"use server"

import prisma from '@/lib/prisma'

export const  CreateReaction = async (payload) => {
    try {
        
        let res = await prisma.reaction.create({
            data : {
           ...payload 
                
        }
    })
    if (res.id){
        return {ok : true , id : res.id}
    }
} catch (error) {  
    console.log(error.message);
    
     return {ok : false , error : "Internal Server Error"}

}
}
