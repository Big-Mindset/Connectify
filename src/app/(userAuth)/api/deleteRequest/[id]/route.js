import { getSession } from "@/lib/getserverSession";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req,{params}){
try {
        let session = await getSession()
        if (!session) {
            return NextResponse.json({Message : "Unauthorized - try login again"}, { status: 401 })

        }
        let id = params.id
        console.log(id);
        
       await prisma.friendRequest.delete({
            where :{
                id : id
            }
        })
        
        return NextResponse.json({Message : "Request deleted"}, { status: 200 })
 
} catch (error) {
    return NextResponse.json({Message : "Internal Server Error"}, { status: 500 })
    
}
}