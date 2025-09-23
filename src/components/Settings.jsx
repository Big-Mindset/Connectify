"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Camera, Save, User, LoaderCircle, X, Sun, Moon } from 'lucide-react';
import Input from '@/components/settingsComps/Input';
import { authstore } from '@/zustand/store';
import Image from 'next/image';
import Img from "@/assets/Avatar.webp"
import toast from 'react-hot-toast'
import {motion} from "framer-motion";
import { useTheme } from 'next-themes';
import {useSession} from "next-auth/react"
import api from '@/lib/axiosInstance';
export default function Settings({ setsettings }) {
    let {update} =  useSession()
    let session = authstore.use.session()
    const [checked, setchecked] = useState(false)
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState({
        name: "",
        bio: "",
        image: "",
    });
    const setsession = authstore.use.setsession();
    useEffect(() => {
        if (!session) return;
        setProfile({
            ...profile,
            name: session?.user?.name ,
            email: session?.user?.email,
            bio: session?.user?.bio,
            image: session?.user?.image || "",
        })
    }, [session])

    let fileRef = useRef()
    const handleAvatarChange = () => {
        fileRef.current.click()
    };
    let handleChange = (e) => {
        let file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfile((prev) => ({
                    ...prev,
                    image: reader.result
                }))
            }
            reader.readAsDataURL(file)
        }
    }
    useMemo(() => {
        let name = session?.user?.name
        let bio = session?.user?.bio
        let image = session?.user?.image
        if (name !== profile.name.trim() || bio !== profile.bio.trim() || image !== profile.image.trim()) {
            setchecked(true)
            return
        }
        setchecked(false)

    }, [profile.name, profile.email, profile.bio, profile.image])

    let handleSave = async () => {
        console.log(checked);
        
        if (!checked) return;
        try {

            setLoading(true)
            let data = {
                id: session?.user?.id,
                name: profile.name,
                email: profile.email,
                bio: profile.bio,
                image: profile.image
            }
            let { image, ...rest } = data;
            
            let res = await api.put("/updateProfile", {...rest,avatar : data.image})
                
            if (res.status === 200) {
                setchecked(false)
                await update(data)
                toast.success("Profile updated")

            } else {
                toast.error("Failed to update profile")
            }
        } catch (error) {

        } finally {
            setLoading(false)

        }

    }
    const [mounted, setmounted] = useState(false)
    useEffect(() => {
      setmounted(true)
    }, [])
    let { setTheme, resolvedTheme} = useTheme()
 
    if (!mounted) return "Loading...";
 
    let handleTheme = () => {
        if (resolvedTheme === "dark") {
            setTheme("light")
            localStorage.setItem("theme","light")
        } else {
            setTheme("dark")
            localStorage.setItem("theme","dark")
        }
    }
    return (
        <div className=" p-4 absolute  left-0 right-0  bottom-0 z-50">
            <div className="max-w-4xl  mx-auto space-y-6">


                <Card className="bg-white/10 backdrop-blur border-white/20 card-1 animate-fade-in-up opacity-0 hover:bg-white/15 transition-all duration-300">

                    <CardHeader>
                        <div className='flex justify-between'>
                            <CardTitle className="dark:text-white text-black flex items-center gap-2 animate-slide-in">
                                <User className="w-5 h-5" />
                                Profile Settings
                            </CardTitle>
                            <motion.button 
                            whileHover={{ scale: 1.07 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleTheme} 
                            className='dark:bg-indigo-100 absolute left-1/2 translate-x-1/2 dark:ring-black ring-1 ring-white  
                            cursor-pointer duration-300 transition-colors dark:text-black text-white   bg-indigo-800 rounded-full p-1.5'>
                                {resolvedTheme === "light" ?<Sun /> : <Moon />}
                                
                            </motion.button>
                            <button onClick={() => setsettings(false)} className='ring-1 ring-gray-500 hover:bg-gray-300  dark:ring-indigo-500/50 rounded-full p-1 cursor-pointer dark:hover:bg-indigo-500/50 ransition-all duration-200'>
                                <X className='dark:text-blue-200 text-black/60' />
                            </button>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="relative group  ">
                                <div className="size-20 transition-transform overflow-hidden rounded-full ">
                                    <Image src={profile.image || Img}
                                        className='bg-cover group rounded-full group-hover:scale-105  duration-300'
                                        height={100} width={100} alt='Avatar' />

                                </div>
                                <Button
                                    size={2}
                                    variant="secondary"
                                    className="absolute -bottom-1 -right-1 cursor-pointer hover:bg-blue-600 rounded-full  bg-indigo-600 p-1 animate-pulse-hover transition-all duration-200 "
                                    onClick={handleAvatarChange}
                                >

                                    <Camera className="w-4 h-4 text-white" />

                                    <input
                                        ref={fileRef}
                                        onChange={(e) => handleChange(e)}
                                        type="file" id="file" className='hidden' htmlFor="Button" />
                                </Button>
                            </div>
                            <div className="dark:text-white text-black">
                                <p className="animate-slide-in">Profile Picture</p>
                                <p className="text-sm dark:text-indigo-200 text-black/60 animate-slide-in">Click the camera to change</p>
                            </div>
                        </div>

                        <Separator className="bg-white/20" />

                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-white/80 font-thin">Email</Label>
                                    <p className='bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text'>{profile.email}</p>
                                </div>
                                <Label htmlFor="name" className="dark:text-white/80 text-black  font-thin ">Full Name</Label>
                                <Input
                                    id="name"
                                    value={profile.name}

                                    setProfile={setProfile}
                                />
                            </div>


                            <div className="space-y-2">
                                <Label htmlFor="bio" className="dark:text-white/80  text-black font-thin">Bio</Label>
                                <Input
                                    id="bio"
                                    value={profile.bio}
                                    setProfile={setProfile}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <div onClick={handleSave} className="flex sticky bottom-0 mt-2 justify-center  button-save animate-fade-in-up opacity-0">
                        <Button

                            size="lg"
                            disabled={!checked || loading}
                            className={`${checked ? " bg-black    " : "    "}  overflow-hidden border-[1px] rounded-md group text-white px-8 transition-all duration-300 
                                 hover:scale-105  hover:shadow-xl hover:shadow-indigo-500/25 active:scale-95
                                 focus:ring-4 relative focus:ring-indigo-500/50`}
                        >
                            <Save className="w-4 h-4 mr-2 transition-transform duration-200" />
                            {loading ? <LoaderCircle className='animate-spin ' /> : "Save Changes"}
                            <div className=' bg-indigo-700 w-0 group bottom-0  transition-all h-full duration-500 left-0 absolute -z-50  group-hover:w-full '></div>
                        </Button>
                    </div>
                </Card>




            </div>
        </div>
    );
}