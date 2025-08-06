import { getSession } from "@/lib/getserverSession";
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req) {
    try {
        let session = await getSession()
            let userId = session?.user?.id
    
       let name = req.nextUrl.searchParams.get("name")
    
        let users = await prisma.account.findMany({
            where : {
                name : {contains : name,
                    mode : "insensitive"
                },
                NOT : {
                    id : userId
                }
                
            },select : {
                name : true,
                id : true , 
                bio : true,
                avatar : true,
                lastseen : true,
                requestReceived : {
                    where : {
                        senderId : userId
                    },
                    select : {
                        id : true ,
                        status : true
                    }
                },
                requestSent : {
                    where : {
                        receiverId : userId
                    },
                    select : {
                        id : true,
                        status : true
                    }
                }
            }
        })
        
        if (users.length > 0){

            return NextResponse.json({message : "User found",users},{status : 200})
        }

            return NextResponse.json({message : "User not found"},{status : 404})

        
 
    } catch (error) {
        console.log(error.message);
        
    return NextResponse.json({message : "Server error try again"},{status : 500})
        
    }
}