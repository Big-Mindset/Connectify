"use server"

import prisma from '@/lib/prisma'

export const  UpdateReaction = async (data) => {
    try {
        
        let res = await prisma.reaction.update({
            where : {
                id : data.id
            },
            data : {
                emoji : data.url
            }
    })
    if (res.id){
        return {ok : true}
    }
} catch (error) {  
    console.log(error.message);
    
     return {ok : false , error : "Internal Server Error"}

}
}
