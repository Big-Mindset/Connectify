import prisma from "@/lib/prisma"
import { NextResponse } from "next/server";
import { client } from "@/lib/redis";

export async function POST(req) {
    try {
        let { token, verifyOtp,getData } = await req.json()
        if (!token) {
            return NextResponse.json({ message: "Something went wrong try again" }, { status: 400 })
        }
        let userData = await client.hGetAll(`User_Session-${token}`)
        
        let { email , name , password , otp , otpExpiresAt} = userData
        if (getData){
            
            return NextResponse.json({ message: "Account created",userData : {
                email ,
                name
            } }, { status: 201 })
        }   
     
        if (Date.now() > parseInt(otpExpiresAt) ){
            client.hDel(`User_Session-${token}`,"otp")
            return NextResponse.json({ message: "Resend otp and try again" }, { status: 404 })

        }
        

        let isExisted = await prisma.user.findUnique({
                where: { email: email },
                select: {
                    id: true,
                    accounts: { select: { provider: true } }
                }
            })
            
        if (otp !== verifyOtp) {
            return NextResponse.json({ message: "Invalid otp try again" }, { status: 400 })

        }
        
        if (isExisted) {
            await prisma.account.create({

                data: {
                    email: email,
                    name: name,
                    password: password,
                    provider: "credentials",
                    avatar: "",
                    userId: isExisted.id,
                    isCompleted : false,
                    bio : ""



                }
            })

        } else {


            await prisma.user.create({
                data: {
                    email: email,
                    accounts: {
                        create: {
                            email: email,
                            name: name,
                            password: password,
                            provider: "credentials",
                            avatar: "",
                            isCompleted : false,
                            bio : ""


                        }
                    }
                },


            })
        }


        const response =  NextResponse.json({ message: "Account created" }, { status: 201 })
        client.del(`User_Session-${token}`)
        return response
    } catch (error) {

        return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 })
    }
}







// model User {
//   id        String    @id @default(auto()) @map("_id") @db.ObjectId
//   accounts  Account[]
//   createdAt DateTime  @default(now())
//   updatedAt DateTime  @updatedAt
// }

// model Account {
//   id String @default(auto())  @id @map("_id") @db.ObjectId
//   provider String
//   email String @unique
//   password String?
//   type String
//   name String
//   providerAccountId String?
//   refresh_token String?
//   access_token String?
//   token_type String?
//   expires_at   Int?
//   scope  String?
//   id_token String?
//   avatar String?
//   session_state     String?
//   userId String @db.ObjectId
//   user User @relation(fields: [userId],references: [id])
//   createdAt DateTime @default(now())
//   updatedAt DateTime @default(now())

//   @@unique([provider,providerAccountId])

// }
