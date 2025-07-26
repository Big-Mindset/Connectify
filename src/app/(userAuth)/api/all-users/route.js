
import { getSession } from "@/lib/getserverSession";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
          const session = await getSession()

        if (!session){
            return NextResponse.json({message : "Unauthorized - login first"},{status : 401})

        }
        let userId = session?.user?.id
        
        let allusers = await prisma.friendRequest.findMany({
            where : {
                status : "Accepted",
                OR : [
                    {senderId  : userId},
                    {receiverId : userId}
                ]
            },
           
            select : {
                id : true,
                sender : {
                    select : {
                        id : true,
                     avatar : true,
                     name : true,
                     bio : true
                    }
                },
                receiver : {
                    select : {
                        id : true,
                     avatar : true,
                     name : true,
                     bio : true
                    }
                }
            },

        })
        
        if (!allusers){
            return NextResponse.json({message : "Users not found"},{status : 200})
        }
        return NextResponse.json({users : [...allusers]},{status : 200})
    } catch (error) {
        return NextResponse.json({message : "Netowrk Error try again"},{status : 500})
    }
}