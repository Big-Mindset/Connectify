import dotenv from "dotenv"
dotenv.config()
import NextAuth from "next-auth"
import prisma from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
export const { handlers, auth, signIn, signOut }=NextAuth({
    trustHost : true,
    providers: [
        GoogleProvider({
            clientSecret: process.env.CLIENT_SECRET,
            clientId: process.env.CLIENT_ID,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials) {
                
                try {
                    if (!credentials) return null
                    let user = await prisma.user.findUnique({
                        where: {  
                            email: credentials.email,
                        },
                        select: {
                            id: true,
                            accounts: {
                                where: {
                                    provider: "credentials"
                                },
                                select: {
                                    id: true,
                                    provider: true,
                                    email: true,
                                    name: true,
                                    avatar: true,
                                    password: true,
                                    bio : true,
                                    isCompleted : true

                                }
                            }
                        }
                    })
                    
                   
                    if (!user) {
                        return null
                    }
                    let isPasswordCorrect ;

                        if (credentials?.password){
                            
                            isPasswordCorrect=  await bcrypt.compare(credentials?.password, user.accounts[0]?.password)
                        }
                       
                    if (!isPasswordCorrect && !credentials?.permission) {
                        return null


                    } else {
                        user.accounts[0].password = null
                    }


                    let account = user.accounts[0]
                    
                    return {
                        id: account.id,
                        name: account.name,
                        email : account.email,
                        image : account.image || "",
                        bio : account.bio || "",
                        isCompleted : account.isCompleted

                    }
                } catch (error) {

                    return null

                }
            },

        }),
    ],
    callbacks: {
        async jwt({ token, user,trigger ,session }) {
            console.log("the user is this ");
            console.log(user);
            
                if (user) {
                    token = {}
                    token.user = user
                }
                
                
                if (trigger === "update" && session?.isCompleted){
                    
                    token.user.isCompleted = true
                    token.user.name = session?.name
                    token.user.bio = session?.bio
                    token.user.image = session?.image

                }   
                console.log("the token is ::");
                    console.log(token);
                    
            return token
  
        },

        async session({ session, token }) {

            if (token) {
                session.user = token.user
            }
            return session
        },
        async signIn({ user, account }) {
            
                if (user?.email && (account.provider === "google" || account.provider === "github")) {
                    let existingUser = await prisma.user.findUnique({
                        where: { email: user.email },
                        select: {
                            id: true,
                            accounts: { select: 
                                {
                                     provider: true, 
                                     id: true,
                                     bio : true ,
                                     isCompleted : true
                                }
                             }
                            
                        }
                    })

                    if (existingUser) {
                        
                        let isAccountExisted = existingUser.accounts.find(userr => userr.provider === account.provider)
                        if (!isAccountExisted) {
             
                            let userdata = await prisma.account.create({
                                data: {
                                    userId: existingUser.id,
                                    name: user.name,
                                    provider: account.provider,
                                    email: user.email,
                                    avatar: user.image,
                                    isCompleted : true
                                }
                            })
                      
                            user.id = userdata.id
                            user.bio = userdata?.bio || ""
                            user.isCompleted = isAccountExisted.isCompleted


                        }else{
                            
                            user.id = isAccountExisted.id
                            user.bio = isAccountExisted?.bio || ""
                            user.isCompleted = isAccountExisted.isCompleted

                        }
                    } else {
                        
                        
                        let userdata = await prisma.user.create({
                            data: {
                                email: user.email,
                                accounts: {
                                    create: {
                                        name: user.name,
                                        provider: account.provider,
                                        email: user.email,
                                        avatar: user.image,
                                    }
                                },

                            },
                            include: {
                                accounts: {
                                    where: {
                                        provider: account.provider
                                    },
                                    select: {
                                        id: true,
                                        bio : true,
                                        isCompleted : true
                                    }
                                }
                            }
                        })
                     
                        if (userdata){

                            user.id = userdata.accounts[0].id
                             user.bio = userdata.accounts[0]?.bio || ""
                             user.isCompleted = userdata.accounts[0].isCompleted

                        }else{
                            return false
                        }
                    }

                }
            
            return true
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 48,
        updateAge: 60 * 60 * 7
    }
})

