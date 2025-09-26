
"use client"

import properLogo from '@/assets/logop.webp'
import { authstore } from '@/zustand/store'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const Loader = ()=>{
   const [progress, setProgress] = useState(0) 
  const loading = authstore.use.loading()
  let setsession =  authstore.use.setsession()
  let socket =  authstore.use.socket()
    
  let session = useSession()
  useEffect(() => {
    if (session.status === "authenticated"){
      setsession(session.data)
    }
    if (loading) {
      let interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 100) return prev + 6;
          clearInterval(interval);
          return 100;
        });
      }, 50); 
      return () => clearInterval(interval);
    }
  }, [loading,session,socket]);
    return (
        <div className="flex justify-center items-center dark:bg-transparent bg-gray-300 h-dvh w-full">
            <div className="flex flex-col gap-3 items-center w-full">
                <div className='flex flex-col items-center'>

                <div className="size-20 p-2  ">
                <Image src={properLogo} alt="Loading" width={100} priority height={100} className='size-full' />
                </div>
                <p className='text-3xl bg-gradient-to-r to-cyan-500 font-bold from-blue-500 bg-clip-text text-transparent '>CONNECTIFY</p>
                </div>
                <div className='loader bg-blue-100 h-1 mt-1.5 rounded-full overflow-hidden  w-[220px]'>
                    <div
                    style={{width : `${progress}%`}}
                    className='h-full bg-blue-500 w-1'>

                    </div>
                </div>
                <div className='mt-3 dark:text-gray-300 text-[0.9rem]'>
                    End to end-encrypted
                </div>
            </div>
        </div>
    )
}
export default Loader