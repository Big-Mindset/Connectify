import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"
import path from "path";
import { fileURLToPath } from "url";

export async function POST(req) {
    try {
        let { email, password, name } = await req.json()

        if (!email || !password || !name) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 })
        }
        let verifciationCode = Math.floor(100000 + Math.random() * 800000).toString()

        let expiryDate = new Date()
        expiryDate.setMinutes(expiryDate.getMinutes() + 30)
        let [salt, isExisted] = await Promise.all([
            bcrypt.genSalt(10),
            prisma.user.findUnique({
                where: { email: email },
                select: {
                    id: true,
                    accounts: { select: { provider: true } }
                }
            })
        ])

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const avatarPath = path.join(__dirname, "avatar.png");
        let cloudImage = await cloudinary.uploader.upload(avatarPath)

        let hashedPassword = await bcrypt.hash(password, salt)
        if (isExisted) {
            if (isExisted.accounts.some(acc => acc.provider === "credentials")) {
                return NextResponse.json({ message: "Account already existed with this email" }, { status: 409 })
            }
            await prisma.account.create({

                data: {
                    email: email,
                    name: name,
                    password: hashedPassword,
                    provider: "credentials",
                    avatar: cloudImage.secure_url,
                    userId: isExisted.id,
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
                            password: hashedPassword,
                            provider: "credentials",
                            avatar: cloudImage.secure_url,
                        }
                    }
                },

            })
        }



        return NextResponse.json({ message: "Account created" }, { status: 201 })

    } catch (error) {
        console.log(error.message);

        return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 })
    }
}


//








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