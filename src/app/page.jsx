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
import { Emjies } from '@/zustand/Emojies';
import { addemoji, getemoji } from '@/database/indexdb';

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"]
});

  export let useWidth = ()=>{
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
  const [mounted, setMounted] = useState(false);
  const [showBlur, setshowBlur] = useState(false)
  useEffect(() => {
    setMounted(true)
    setTimeout(() => {
      setshowBlur(true)
    }, 2000);
  }, []);
  const selectedGroup = groupstore.use.selectedGroup()
  const getAllUsers = authstore.use.getAllUsers()
  const getAllMessages = authstore.use.getAllMessages()
  const Selected = authstore.use.Selected()
  const { setemojies, emojies, setEmojies, Emojies } = Emjies()
  const [openfriendSearch, setopenfriendSearch] = useState(false)
  
  
  SocketLogic()
  
  
  let getEmojies = async () => {
    let emojies = await getemoji()
    if (emojies) {
      setemojies(emojies)
      return
    } else {
      let res = await fetch("emojies/all.json")
      let data = await res.json()
      setemojies(data)
      await addemoji(data)
    }
  }
  
  useEffect(() => {
    getEmojies()
    getAllUsers()
    getAllMessages()
  }, [])
  // useMemo(() => {
    //   console.log("in that ");
    
    //   const getEmojiByName = (name) => {
  //     return emojies.emojis[name]?.skins[0]?.native || "❓"
  //   }

  //   let filteredData = emojies?.categories?.map(category => {
    
    //     let id = category.id
    //     if (id === "flags") return { id, Emoji: [] }
    //     let Emoji = category?.emojis.map(name => ({
      //       name,
      //       emoji: getEmojiByName(name)
      //     }))
      //     return { id, Emoji }
      //   })
      //   setEmojies(filteredData)
      // }, [emojies])
      
      
      
       let width = useWidth()
    
      
      return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, }}
      className={`h-dvh flex justify-center ${roboto.className}`}>
      <div className={`rounded-xl overflow-hidden relative flex ${showBlur && "shadow-[0_0_8px_4px_rgba(60,0,200,0.6)]"}  transition-all w-full     
     duration-300  before:transition-all
     bg-gradient-to-br from-[#0f1225] to-[#1f1939]`}>
        <span className={`absolute left-0 top-0 z-50  h-0 w-[0.2px] bg-blue-500/60  ease-in-out transition-all duration-1000  ${mounted ? "h-full " : "h-0"} `}></span>
        <span className={`absolute left-0 top-0 z-50 h-[0.2px] w-0 bg-blue-500/60 ease-in-out transition-all duration-1000  ${mounted ? "w-full " : "w-0"} `}></span>
        <span className={`absolute right-0 top-0 z-50 h-0 w-[0.3px] delay-1000 ease-in-out bg-blue-500/60 transition-all duration-1000  ${mounted ? "h-full " : "h-0"} `}></span>
        <span className={`absolute left-0 bottom-0 z-50 w-0 h-[1px] delay-1000 ease-in-out bg-blue-500/60 transition-all duration-1000  ${mounted ? "w-full " : "w-0"} `}></span>

        
        { width > 768 ?

        <div className={`basis-full md:basis-1/3 relative from-800/20    p-3`}>
          <span className={`absolute right-0 top-0 z-10  w-[0.3px] ease-in-out h-[1px] delay-200 ${showBlur && "shadow-[1px_0_5px_2px_rgba(60,0,200,0.6)]"} bg-blue-500/60 transition-all duration-1000  ${mounted ? "h-full " : "h-0"} `}></span>



          <AddFriends setopenfriendSearch={setopenfriendSearch} openfriendSearch={openfriendSearch} />


          <ChatList setopenfriendSearch={setopenfriendSearch} />

        </div>
        : ((Selected || selectedGroup) ===null) && <div className={`basis-full md:basis-1/3 relative from-800/20    p-3`}>
        <span className={`absolute right-0 top-0 z-10  w-[0.3px] ease-in-out h-[1px] delay-200 ${showBlur && "shadow-[1px_0_5px_2px_rgba(60,0,200,0.6)]"} bg-blue-500/60 transition-all duration-1000  ${mounted ? "h-full " : "h-0"} `}></span>



        <AddFriends setopenfriendSearch={setopenfriendSearch} openfriendSearch={openfriendSearch} />


        <ChatList setopenfriendSearch={setopenfriendSearch} />

      </div>
        }
          
        {(Selected || selectedGroup) ? (
          
          <ChatMain />
        ) : (
          <motion.div 
          // initial={}
          >
            
          </motion.div>
        )}
      </div>
    </motion.div>

  )
}

export default Page