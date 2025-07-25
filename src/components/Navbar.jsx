"use client"
import {  Roboto } from 'next/font/google';
import Image from 'next/image';
import images from '@/image';
import Link from 'next/link';
const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"] });
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { signOut, useSession } from 'next-auth/react';
import { authStore } from '@/zustand/store';
import { useEffect, useState } from 'react';
const Navbar = () => {
    const [userData, setuserData] = useState(null)
    let {session} = authStore()
    useEffect(() => {
        if (session?.status === "authenticated"){
            setuserData(session)
        }
    }, [session?.status])
    
    
    return (
        <div className={`fixed duration-300  transition-colors bg-gradient-to-r from-[#68308d] to-[#0e1da3] z-30 top-0 left-0 right-0 ${roboto.className} `}>

            <div className='px-5 py-3'>
                <div className='flex justify-around px-3.5'>
                    <div className='flex gap-3.5 items-center'>
                    <Link href={"/home"} className=''>
                        <Image src={images.Logo} width={60} height={60} alt='User' />
                    </Link>
                    <h3 className='font-bold bg-gradient-to-bl text-3xl text-transparent bg-clip-text from-purple-600 to-indigo-600 via-blue-500'>Connectify</h3>
                    </div>
                    
                    <div className='flex gap-10 items-center'>
                        <div className=''>
                            <Image src={images.Notifications} width={35} height={35} alt='Notifications'
                                className='text-gray-100 '
                            />
                        </div>
                        <Popover>

                            <PopoverContent className="w-80 mt-3 mx-6 p-2.5 bg-[#60B2FF]">
                                <div className='flex gap-2.5 items-center '>
                                    <div className='overflow-hidden ring-1 ring-purple-700 rounded-full'>
                                        <Image alt='Profile' width={50} height={50} src={userData?.avatar || userData?.image || images.Avatar} />
                                    </div>
                                    <div className='space-y-1'>
                                        <h1 className='font-semibold'>{userData?.name}</h1>
                                        <p className='font-normal text-[0.8rem]'>{userData?.email}</p>
                                    </div>
                                </div>
                                <div className='p-4 space-y-3 s text-white'>
                                    <Link href={"/Chat-app"} className='w-[270px]  flex gap-3 items-center duration-150 transition-color p-2 rounded-lg cursor-pointer bg-[#2F00FF]/62 hover:bg-[#2F00FF]/90'>
                                        <Image src={images.MessageCirce} alt='Circle Message' />
                                        <p className='font-semibold text-[14px] '>Chats</p>
                                    </Link>
                                    <Link href={"/settings"} className='w-[270px]  flex gap-3 items-center p-2 rounded-lg cursor-pointer bg-[#0059FF]/62 hover:bg-[#0059FF]/90'>
                                        <Image src={images.sett} alt='Circle Message' />
                                        <p className='font-semibold text-[14px] '>Settings</p>
                                    </Link>
                                    <div onClick={()=>signOut()} className='w-[270px] flex gap-3  items-center p-2 rounded-lg cursor-pointer bg-[#FF0000]/62 hover:bg-[#FF0000]/90'>
                                        <Image src={images.Logout} width={20} height={10} alt='Circle Message' />
                                        <p className='font-semibold text-[14px] '>Logout</p>
                                    </div>
                                </div>
                            </PopoverContent>
                            <PopoverTrigger asChild>

                                <div className=' rounded-full overflow-hidden hover:ring-2 hover:ring-purple-600'>
                                    <Image src={userData?.avatar || userData?.image || images.Avatar} width={50} height={59} alt='User' />
                                </div>
                            </PopoverTrigger>
                        </Popover>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar