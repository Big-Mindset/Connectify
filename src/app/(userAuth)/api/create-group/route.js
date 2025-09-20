import cloudinary from "@/lib/cloudinary"
import { getSession } from "@/lib/getserverSession";
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req) {
    try {
        
        let {name , description ,image,userIds } = await req.json()
        
        let session = await getSession()
        if (!session){
            return NextResponse.json({message : "Unauthorize - login first"},{status : 401})
        }
        if (!name || !userIds?.length) {
            return NextResponse.json(
                { message: "Name and at least one user are required" },
                { status: 400 }
            )
        }
        let sec_url;
        
        if (image){
             sec_url = await cloudinary.uploader.upload(image)
        }
        let userId = session.user.id
        let objects = userIds.map((id)=>{
            if (id === userId){
                return {
                    userId : id ,
                    role : "admin"
                }
            }
            return {userId : id}
        })
        let group = await prisma.groups.create({
                data : {
                    name,
                    description,
                    image : sec_url?.secure_url || "",

                    users : {
                        create : objects
                    }
                },
                select  : {
                    id : true
                }
                
            })
        
           
        
        
    if (!group){
        return NextResponse.json({message : "Group creation failed..."},{status : 404})
        
    }
    return NextResponse.json({message : "Group Created",groupId : group?.id},{status : 201})
} catch (error) {
    console.log(error.message);
    
    return NextResponse.json({message : "Network Error try again"},{status : 500})
    
}
}