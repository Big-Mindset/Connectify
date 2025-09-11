"use server"

import prisma from '@/lib/prisma'

export const  DeleteReaction = async (id) => {
    console.log(id);
    
    try {
        
        let res = await prisma.reaction.delete({
            where : {
                id
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
