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
        let sec_url;
        
        if (image){
             sec_url = await cloudinary.uploader.upload(image)
        }
        
        let newGroup = await prisma.$transaction(async (tx)=>{

            let group = await tx.Groups.create({
                data : {
                    name,
                    description,
                    image : sec_url?.secure_url || "",
                }
            })
             await tx.groupUser.createMany({
                data : userIds.map(id=>({
                    groupId : group.id,
                    userId : id,
                }))
             })
            return group
        })
        
        
    if (!newGroup){
        return NextResponse.json({message : "Group creation failed..."},{status : 404})
        
    }
    return NextResponse.json({message : "Group Created",groupId : newGroup?.id},{status : 201})
} catch (error) {
    console.log(error.message);
    
    return NextResponse.json({message : "Network Error try again"},{status : 500})
    
}
}