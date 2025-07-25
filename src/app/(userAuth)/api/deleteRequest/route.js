import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(req) {
    try {
        
        let id = req.nextUrl.searchParams.get("id")
        let res = await prisma.friendRequest.delete({
            where : {
                id 
            }
        })
        
        if (res){
            return NextResponse.json({message : "Request Canceled"},{status : 200})
        }
        
    } catch (error) {
        console.log(error.message);
        
        return NextResponse.json({message : "Internal Server Error"},{status : 500})
 
    }
}