"use server"

import prisma from '@/lib/prisma'

export const updateMessage = async (id) => {
    try {
        
        let message = await prisma.message.update({
            where : {
                id 
        },
        data : {
            DeleteForMe : true
        }
    })
    if (message?.DeleteForMe){
        return {ok : true}
    }
} catch (error) {
    return {ok : false , error : error.message}
    
}
}
