import { getSession } from "@/lib/getserverSession";
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export  async function GET(req) {
    try {
        let session = await getSession()
        if (!session){
            return NextResponse.json({message : "Unzuthorized - login first"},{status : 401})
        }
        let {searchParams} = new URL(req.url)
        let groupId = searchParams.get("groupId")
        let messages = await prisma.groupMessages.findMany({
            where : {
                groupId : groupId
            },
            include : {
                status : true
            },
            orderBy : {
                createdAt : "asc"
            }
        })
        if (!messages){
            return NextResponse.json({message : "No messages found"},{status : 404})
        }
        return NextResponse.json({messages},{status : 200})
    } catch (error) {
        console.log(error.message);
        
        return NextResponse.json({message : "Server error try again"},{status : 500})
        
    }
    
}