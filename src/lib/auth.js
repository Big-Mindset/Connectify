import dotenv from "dotenv"
dotenv.config()
import NextAuth from "next-auth"
import prisma from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
export const { handlers, auth, signIn, signOut }=NextAuth({
    providers: [
        GoogleProvider({
            clientSecret: process.env.CLIENT_SECRET,
            clientId: process.env.CLIENT_ID,
            authorization: { params: { access_type: 'offline', prompt: 'consent',response_type : "code" } }
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
                                    password: true

                                }
                            }
                        }
                    })
                    
                    
                    
                   
                    if (!user) {
                        return null
                    }

                    let isPasswordCorrect = await bcrypt.compare(credentials.password, user.accounts[0]?.password)
                    if (!isPasswordCorrect) {
                        console.log("incorrect password");
                        
                        return null


                    } else {
                        user.accounts[0].password = null
                    }



                    return {
                        id: user.accounts[0].id,

                    }
                } catch (error) {
                    console.log(error.message);

                    return null

                }
            },

        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            console.log("auth is next")
            console.log(auth())
                if (user) {
                if (user?.provider === "credentials") {
                    token.user = user
                } else {
                    token.user = {
                        ...user,
                        id: user.customId || user.id,
                        provider: account?.provider,
                    }
                }

            }
            

            return token
  
        },

        async session({ session, token }) {

            if (token) {
                session.user = token.user
            }
            return session
        },
        async signIn({ user, account }) {
            
            try {
                if (user?.email && (account.provider === "google" || account.provider === "github")) {
                    let existingUser = await prisma.user.findUnique({
                        where: { email: user.email },
                        select: {
                            id: true,
                            accounts: { select: { provider: true, id: true } }
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
                                }
                            })
                      
                            user.id = userdata.id

                        }else{
                            user.id = isAccountExisted.id
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
                                        id: true
                                    }
                                }
                            }
                        })
                     
                        if (userdata){

                            user.id = userdata.accounts[0].id
                        }else{
                            return false
                        }
                    }

                }
            } catch (error) {
                console.log(error.message);

            }
            return true
        }
    },
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 48,
        updateAge: 60 * 60 * 7
    }
})

