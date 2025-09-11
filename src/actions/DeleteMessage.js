"use server"

import prisma from '@/lib/prisma'

export const DeleteMessage = async (id) => {
    try {
        
        let delMessage = await prisma.message.update({
            where : {
                id 
    },
    data : {
        DeleteForEveryone : true,
        content : ""
    }
  })
  if (delMessage?.id){
    return {ok : true}
}
} catch (error) {
    return {ok : false , error : error.message}
    
}
}
