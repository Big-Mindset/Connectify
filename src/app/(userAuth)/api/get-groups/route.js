import { getSession } from "@/lib/getserverSession";
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req) {
    try {
        
        let session = await getSession()
        if (!session){
            return NextResponse.json({message : "Unauthorized"},{status : 401})
        }
        let meId = session?.user?.id
        
        let groups = await prisma.groups.findMany({
            where : {
               users : {
                some : {
                    userId : meId,
                },

               }
            },
           include : {
            users : {
                select : {
                    userId : true,
                    role : true,
                    joinedAt : true,
                    groupUsers : {
                        select : {
                            name : true ,
                            image : true,
                        }
                    },

                    
                    
                }
            },
            groupsMessages : {
                where : {
                    createdAt : {
                        lte : new Date()
                    },
                },
                orderBy : {
                    createdAt : "desc"
                },
                take : 1
            },
            _count : {
                select : {
                    groupsMessages : {
                        where : {
                            status :{
                                some : {
                                    id : {
                                        not : meId
                                    },

                                }
                            },
                            senderId :{
                                not : meId
                            }
                        }
                    }
                }
            }
           }
        })
        return NextResponse.json({groups,message : "Groups found"},{status : 200})
    } catch (error) {
        console.log(error.message);
        
        return NextResponse.json({message : "Server Error - try again"},{status : 500})
        
    }
    
} 