
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export  async function PUT(req) {
    try {
        let {friendRequestId,status} = await req.json()
        
        
        await prisma.friendRequest.update({
            where : {
                id : friendRequestId
            },
            data : {
                status  
            }
        })

        return NextResponse.json({message : `Request ${status}`,status : status},{success : 200})
 
    } catch (error) {
        console.log(error.message);
        
        return NextResponse.json({message : "Internal Server Error"},{success : 500})
    }
}