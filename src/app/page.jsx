"use client"

import { Roboto } from 'next/font/google';
import ChatList from '@/components/ChatsComp/ChatList';
import ChatMain from '@/components/ChatsComp/ChatMain';
import AddFriends from '@/components/AddFriends';

import SocketLogic from '@/lib/SocketLogic';
import { useEffect, useState } from 'react';
import { groupstore } from '@/zustand/groupStore';
import { authstore } from '@/zustand/store';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import properLogo from '@/assets/logop.webp'
import Image from 'next/image';
import Typewriter from 'typewriter-effect';
import { Moon, Sun } from 'lucide-react';
import Loader from '@/components/ChatsComp/Loader';
import { useSession } from 'next-auth/react';


const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"]
});

export let useWidth = () => {
  const [width, setwidth] = useState(0)

  useEffect(() => {
    const handleResize = () => setwidth(window.innerWidth);
    handleResize()
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width
}

const Page = () => {
  const [showBlur, setshowBlur] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setshowBlur(true)
    }, 2000);
  }, []);
  const selectedGroup = groupstore.use.selectedGroup()
  const getChatData = authstore.use.getChatData()
  const session = authstore.use.session()
  const loading = authstore.use.loading()
  const Selected = authstore.use.Selected()
  const [openfriendSearch, setopenfriendSearch] = useState(false)

  SocketLogic()


  useEffect(() => {
    getChatData()
  }, [])

  const [Completed, setCompleted] = useState(false)
  let { setTheme, resolvedTheme } = useTheme()


  let handleTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light")
      localStorage.setItem("theme","light")
    } else {
      setTheme("dark")
      localStorage.setItem("theme","dark")
    }
  }
  let width = useWidth()
  const [mounted, setmounted] = useState(false)
  const [isType, setisType] = useState(true)
  
  useEffect(() => {
    setmounted(true)
  }, [])
  useEffect(() => {
    if (Completed){

      setisType(false)
    }
  }, [Completed])
  
  return (
    <>
    {loading ? <Loader /> : 
    <motion.div
      initial={{ scale: 1.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, }}
      className={`h-dvh flex ${mounted && "theme-transition"} justify-center ${roboto.className}`}>
      <div className={`rounded-xl overflow-hidden relative flex ${showBlur && "shadow-[0_0_8px_4px_rgba(60,0,200,0.6)]"}  transition-all w-full     
     duration-300  before:transition-all
      bg-gray-100 dark:bg-[#111927]`}>



        {width > 768 ?

<div className={`basis-full md:basis-1/3 relative from-800/20 bg-gradient-to-t from-[#EDF2FE] to-[#F9F9FB] dark:from-[#0D1520] dark:to-[#0D1520]  `}>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: mounted ? "100%" : 0 }}
              transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
              className={`absolute right-0 top-0 z-50  w-[0.3px]  h-[1px]  ${showBlur && "dark:shadow-[1px_0_5px_2px_#37209e]"} bg-[#CDCED7]  dark:bg-[#205D9E]`}></motion.div>



            <AddFriends setopenfriendSearch={setopenfriendSearch} openfriendSearch={openfriendSearch} />


            <ChatList setopenfriendSearch={setopenfriendSearch} />

          </div>
          : ((Selected || selectedGroup) === null) && <div className={`basis-full md:basis-1/3 relative from-800/20    md:p-3 `}>

            <AddFriends setopenfriendSearch={setopenfriendSearch} openfriendSearch={openfriendSearch} />


            <ChatList setopenfriendSearch={setopenfriendSearch} />

          </div>
        }

        {(Selected || selectedGroup) ? (
          
          <ChatMain />
        ) : width > 768 && (
          <div className='flex-1 flex justify-center relative h-full'>
            <div className={`size-0  rounded-full blur-[200px]   bg-blue-600/20 ${Completed && "size-200 "} duration-1000 delay-500 absolute top-1/2 left-1/2 -translate-1/2`}>
              
            </div>
      
            <div className={`absolute top-10 h-[0.6px] left-[18%] w-0 ${Completed && "w-[25%] duration-1000 delay-500"} bg-blue-600`}>
            </div>

            <div className={`absolute top-10 h-[0.6px] w-0 left-[58%] ${Completed && "w-[32%] duration-900 delay-900"} bg-blue-600`}>
            </div>

            <div className={`${Completed ? "top-10 scale-100 left-30" : "top-1/2 left-1/2"} absolute flex gap-1 items-center duration-1000 scale-200 -translate-1/2`}>
               {
                isType ?
              <Typewriter
                options={{ delay: 60, cursor: "" }}
                onInit={(typewriter) => {
                  typewriter
                  .typeString('Powered by')
                  .pauseFor(1600)
                    .deleteAll()
                    .typeString('<span class="bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text font-semibold">OpenAI</span>')
                    .stop()
                    .callFunction(() => {
                      setCompleted(true)
                    })
                    .start()
                  }}
              />
              :

              <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text font-semibold">OpenAI</span>
              }

              <svg width="20"
                className={`${Completed ? "opacity-100 scale-100" : "scale-0 opacity-0"} z-50 delay-1000 duration-700`}
                height="20" viewBox="0 0 20 20"
                fill="cyan" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.2475 18.25C10.6975 18.25 10.175 18.1455 9.67999 17.9365C9.18499 17.7275 8.74499 17.436 8.35999 17.062C7.94199 17.205 7.50749 17.2765 7.05649 17.2765C6.31949 17.2765 5.63749 17.095 5.01049 16.732C4.38349 16.369 3.87749 15.874 3.49249 15.247C3.11849 14.62 2.93149 13.9215 2.93149 13.1515C2.93149 12.8325 2.97549 12.486 3.06349 12.112C2.62349 11.705 2.28249 11.2375 2.04049 10.7095C1.79849 10.1705 1.67749 9.6095 1.67749 9.0265C1.67749 8.4325 1.80399 7.8605 2.05699 7.3105C2.30999 6.7605 2.66199 6.2875 3.11299 5.8915C3.57499 5.4845 4.10849 5.204 4.71349 5.05C4.83449 4.423 5.08749 3.862 5.47249 3.367C5.86849 2.861 6.35249 2.465 6.92449 2.179C7.49649 1.893 8.10699 1.75 8.75599 1.75C9.30599 1.75 9.82849 1.8545 10.3235 2.0635C10.8185 2.2725 11.2585 2.564 11.6435 2.938C12.0615 2.795 12.496 2.7235 12.947 2.7235C13.684 2.7235 14.366 2.905 14.993 3.268C15.62 3.631 16.1205 4.126 16.4945 4.753C16.8795 5.38 17.072 6.0785 17.072 6.8485C17.072 7.1675 17.028 7.514 16.94 7.888C17.38 8.295 17.721 8.768 17.963 9.307C18.205 9.835 18.326 10.3905 18.326 10.9735C18.326 11.5675 18.1995 12.1395 17.9465 12.6895C17.6935 13.2395 17.336 13.718 16.874 14.125C16.423 14.521 15.895 14.796 15.29 14.95C15.169 15.577 14.9105 16.138 14.5145 16.633C14.1295 17.139 13.651 17.535 13.079 17.821C12.507 18.107 11.8965 18.25 11.2475 18.25ZM7.17199 16.1875C7.72199 16.1875 8.20049 16.072 8.60749 15.841L11.7095 14.059C11.8195 13.982 11.8745 13.8775 11.8745 13.7455V12.3265L7.88149 14.62C7.63949 14.763 7.39749 14.763 7.15549 14.62L4.03699 12.8215C4.03699 12.8545 4.03149 12.893 4.02049 12.937C4.02049 12.981 4.02049 13.047 4.02049 13.135C4.02049 13.696 4.15249 14.213 4.41649 14.686C4.69149 15.148 5.07099 15.511 5.55499 15.775C6.03899 16.05 6.57799 16.1875 7.17199 16.1875ZM7.33699 13.498C7.40299 13.531 7.46349 13.5475 7.51849 13.5475C7.57349 13.5475 7.62849 13.531 7.68349 13.498L8.92099 12.7885L4.94449 10.4785C4.70249 10.3355 4.58149 10.121 4.58149 9.835V6.2545C4.03149 6.4965 3.59149 6.8705 3.26149 7.3765C2.93149 7.8715 2.76649 8.4215 2.76649 9.0265C2.76649 9.5655 2.90399 10.0825 3.17899 10.5775C3.45399 11.0725 3.81149 11.4465 4.25149 11.6995L7.33699 13.498ZM11.2475 17.161C11.8305 17.161 12.3585 17.029 12.8315 16.765C13.3045 16.501 13.6785 16.138 13.9535 15.676C14.2285 15.214 14.366 14.697 14.366 14.125V10.561C14.366 10.429 14.311 10.33 14.201 10.264L12.947 9.538V14.1415C12.947 14.4275 12.826 14.642 12.584 14.785L9.46549 16.5835C10.0045 16.9685 10.5985 17.161 11.2475 17.161ZM11.8745 11.122V8.878L10.01 7.822L8.12899 8.878V11.122L10.01 12.178L11.8745 11.122ZM7.05649 5.8585C7.05649 5.5725 7.17749 5.358 7.41949 5.215L10.538 3.4165C9.99899 3.0315 9.40499 2.839 8.75599 2.839C8.17299 2.839 7.64499 2.971 7.17199 3.235C6.69899 3.499 6.32499 3.862 6.04999 4.324C5.78599 4.786 5.65399 5.303 5.65399 5.875V9.4225C5.65399 9.5545 5.70899 9.659 5.81899 9.736L7.05649 10.462V5.8585ZM15.4385 13.7455C15.9885 13.5035 16.423 13.1295 16.742 12.6235C17.072 12.1175 17.237 11.5675 17.237 10.9735C17.237 10.4345 17.0995 9.9175 16.8245 9.4225C16.5495 8.9275 16.192 8.5535 15.752 8.3005L12.6665 6.5185C12.6005 6.4745 12.54 6.458 12.485 6.469C12.43 6.469 12.375 6.4855 12.32 6.5185L11.0825 7.2115L15.0755 9.538C15.1965 9.604 15.2845 9.692 15.3395 9.802C15.4055 9.901 15.4385 10.022 15.4385 10.165V13.7455ZM12.122 5.3635C12.364 5.2095 12.606 5.2095 12.848 5.3635L15.983 7.195C15.983 7.118 15.983 7.019 15.983 6.898C15.983 6.37 15.851 5.8695 15.587 5.3965C15.334 4.9125 14.9655 4.5275 14.4815 4.2415C14.0085 3.9555 13.4585 3.8125 12.8315 3.8125C12.2815 3.8125 11.803 3.928 11.396 4.159L8.29399 5.941C8.18399 6.018 8.12899 6.1225 8.12899 6.2545V7.6735L12.122 5.3635Z">
                </path>
              </svg>
            </div>

            <div className={`absolute right-30 bg-blue-500 ${Completed ? "opacity-100 scale-100 duration-1000 delay-700" : "opacity-0 scale-0"} top-5`}>
              {
                mounted &&
                <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                  onClick={handleTheme}
                  className='dark:bg-indigo-100 absolute left-1/2 -translate-x-1/2 dark:ring-black ring-1 ring-white cursor-pointer duration-300 transition-colors dark:text-black text-white bg-indigo-800 rounded-full p-1.5'>
                  {resolvedTheme === "light" ? <Moon /> : <Sun />}
                </motion.button>
              }
            </div>

            <div className='absolute top-5 overflow-hidden -translate-x-1/2 left-1/2'>
              <p className={`${Completed ? "opacity-100 scale-100 duration-1000 delay-700" : "opacity-0 scale-0"} from-purple-500 font-bold to-blue-600 text-transparent bg-gradient-to-r bg-clip-text text-3xl`}>
                Connectify
              </p>
            </div>

            <div className={`mt-30 w-full flex gap-5 flex-col ${Completed ? "opacity-100 duration-1000 delay-1000" : "opacity-0"}`}>

              <div className='flex justify-center mt-28  w-20 mx-auto'>
                <Image src={properLogo} height={100} width={100} alt="Connectify-Logo" className='object-cover size-full object-center' />
              </div>

              <div className={`text-center max-w-2xl mx-auto px-6 ${Completed ? "opacity-100 translate-y-0 duration-1000 delay-1200" : "opacity-0 translate-y-10"}`}>
                <h2 className='text-2xl font-bold text-gray-800 dark:text-white mb-4'>
                  Connect. Collaborate. Create.
                </h2>
                <p className='text-lg text-gray-600 dark:text-gray-300 leading-relaxed'>
                  Experience the future of communication with AI-powered conversations that understand, adapt, and inspire.
                  Connectify brings intelligence to every interaction.
                </p>
              </div>

              <div className={`grid md:grid-cols-3 gap-6 max-w-5xl mx-auto px-6 mt-12 ${Completed ? "opacity-100 translate-y-0 duration-1000 delay-1400" : "opacity-0 translate-y-10"}`}>

                {/* Smart Conversations */}
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className='bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700 shadow-lg hover:shadow-xl transition-all duration-300'>
                  <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4'>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-3'>Smart Conversations</h3>
                  <p className='text-gray-600 dark:text-gray-300 text-sm'>
                    Engage in meaningful dialogues with advanced AI that understands context, emotion, and intent.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className='bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700 shadow-lg hover:shadow-xl transition-all duration-300'>
                  <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4'>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-3'>Team Collaboration</h3>
                  <p className='text-gray-600 dark:text-gray-300 text-sm'>
                    Work together seamlessly with your team in shared spaces enhanced by intelligent assistance.
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className='bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700 shadow-lg hover:shadow-xl transition-all duration-300'>
                  <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4'>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-3'>Secure & Private</h3>
                  <p className='text-gray-600 dark:text-gray-300 text-sm'>
                    Your conversations are protected with enterprise-grade security and privacy controls.
                  </p>
                </motion.div>
              </div>


              <div
                // onClick={handleChatting}
                className={`mt-16 text-center max-w-2xl mx-auto px-6 pb-20 ${Completed ? "opacity-100 translate-y-0 duration-1000 delay-1800" : "opacity-0 translate-y-10"}`}>
                <motion.button

className='bg-gradient-to-r cursor-pointer  from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-100 mb-6'>
                  Chat with AI
                </motion.button>
              </div>
            </div>

            <div className='absolute bottom-10 left-1/2 -translate-1/2'>

              <Typewriter
                options={{ delay: 60, cursor: "" }}
                onInit={(typewriter) => {
                  typewriter
                  .pauseFor(5000)
                  .typeString('end to end - encrypted')
                  
                    .start()
                  }}
                  />
            </div>
          </div>
        )}
    
      </div>
    </motion.div>
    }
</>

  )
}

export default Page