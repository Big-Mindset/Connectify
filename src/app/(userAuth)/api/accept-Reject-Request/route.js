
import { getSession } from "@/lib/getserverSession"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export  async function PUT(req) {
    try {
        let session = await getSession()
        if (!session){
            return NextResponse.json({message : "Unauthorized - login first"},{status : 401})

        }
        let {friendRequestId,status} = await req.json()
        console.log("the friend requests are ------->");
        console.log(status);
        
        console.log(friendRequestId,status);
        
        
        let friendRequest = await prisma.friendRequest.update({
            where : {
                id : friendRequestId
            },
            data : {
                status
            }
        })
        console.log("done");
            console.log(friendRequest);
            
        return NextResponse.json({message : `Request ${status}`,status : status,data : friendRequest},{success : 200})
 
    } catch (error) {
        
        return NextResponse.json({message : "Internal Server Error"},{success : 500})
    }
}