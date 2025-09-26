import { groupstore } from '@/zustand/groupStore'
import { authstore } from '@/zustand/store'
import Avatar from "@/assets/Avatar.webp"

import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
import ColoredTick from "@/assets/coloredTick.svg"
import twoTicks2 from "@/assets/ticksTwo2.svg"
import singleTick from "@/assets/singleTick.svg"
import { ImageIcon, NotepadText } from 'lucide-react'
import { CrossCircledIcon } from '@radix-ui/react-icons'

const User = React.memo(({ user, idx }) => {
  let Selected = authstore.use.Selected();
  let onlineUsers = authstore.use.onlineUsers();
  let setSelected = authstore.use.setSelected();
  let session = authstore.use?.session()
  let setselectedGroup = groupstore.use.setselectedGroup();
  let setselectedInfo = authstore.use.setselectedInfo();
  
  const handleSelect = (user) => {
    
    setSelected(user.friend.id)
    setselectedInfo(user)
    setselectedGroup(null)
  }
  
  let status = user?.lastmessage?.status
  let getStatusIcon = () => {
    if (!status) return
    let value = status === "delivered" ?
      <Image 
        className="size-4 dark:invert-75"
        width={100}
        height={100}
        src={ColoredTick} alt="delivered" />
      : status === "read" ?
        <Image 
        width={100}
        height={100}
        className="size-4 dark:invert-0 invert-25" src={twoTicks2} alt="read" /> :
        <Image
        width={100}
        height={100}
        className="size-3 dark:invert-75 invert-25" src={singleTick} alt="send" />
    return value
  }
  
  let dat = user?.lastmessage?.createdAt
  let res = new Date(dat)
  let isSender = user.lastmessage?.senderId === session?.user?.id

  let content = user.lastmessage?.content?.slice(0, 60) + (user.lastmessage?.content?.length > 60 ? "..." : "")
  let showContent = ((!content && user.lastmessage?.DeleteForEveryone) || content || user.lastmessage?.image)
  let isReaded = user.friend.UnReadedMessageCount
  
  if (!user.lastmessage) {
    showContent = false
  }

  return (
    <motion.div
      onClick={() => handleSelect(user)}
      style={{ animationDelay: `${idx * 75}ms` }}
      className={`flex cursor-pointer  border-blue-100 ${Selected === user.friend.id ? "dark:bg-blue-500/30  dark:border-0  border bg-blue-100" 
      : "dark:hover:bg-blue-500/20  hover:bg-[#F0F0F0]"} 
      opacity-0 animate-fade-in-up rounded-md mb-1 justify-between gap-2 w-full p-3 px-2.5 transition-colors
       duration-100`}>
      
      <div className='flex gap-4 flex-1'>
        <div className='relative'>
          <span className={`size-3 transition-all duration-700 right-0 ease-in-out rounded-full z-20 bottom-1 ${onlineUsers?.includes(user.friend.id) ? "opacity-100 scale-100 bg-gradient-to-r from-green-300 to-green-500" : "scale-0 opacity-0"} right-[0.5px] absolute bg-blue-600`}>
          </span>
          
          <div className='rounded-full relative overflow-hidden ring-[0.7px] group-hover:ring-2 ring-indigo-600/50 duration-200 size-14 border-1 border-indigo-500/30'>
            <Image
              src={user.friend.avatar || Avatar}
              alt='User'
              fill
              priority
              sizes='100px'
              className='object-cover object-center'
            />
          </div>
        </div>
        
        <div className='flex-col flex justify-center flex-1'>
          <div className='flex justify-between items-center flex-1'>
            <h2 className='  text-gray-800 dark:text-indigo-50 text-base'>
              {user.friend.name}
            </h2>
            
            {dat && (
              <span className={`${isReaded ? "text-blue-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-300"} text-xs font-medium`}>
                {res.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true
                })}
              </span>
            )}
          </div>
          
          <div className='flex justify-between items-center'>
            <div className='flex gap-1 items-center mb-1.5 flex-1 min-w-0'>
              {!user?.lastmessage?.DeleteForEveryone && (
                <div className='flex-shrink-0'>
                  {(session?.user.id === user?.lastmessage?.senderId && content) && getStatusIcon()}
                </div>
              )}
              
              {user?.lastmessage?.DeleteForEveryone ? (
                <div className="flex gap-1 items-center min-w-0">
                  <CrossCircledIcon className="size-4 text-gray-400 flex-shrink-0" />
                  <p className="text-sm dark:font-medium font-normal text-gray-600 dark:text-gray-400 truncate">
                    {isSender ? "You deleted this message" : "This message was deleted"}
                  </p>
                </div>
              ) : (
                <>
                  {user?.lastmessage?.image?.length > 0 && (
                    <ImageIcon className='size-4 text-blue-500 flex-shrink-0' />
                  )}
                  <span className={`text-sm  ${isReaded ? "font-semibold text-blue-600 dark:text-indigo-400" : `${showContent ? "text-gray-600 dark:text-gray-400" : "text-blue-500 dark:text-cyan-500 font-medium"}`}`}>
                    {(showContent) ? (
                      content ? content : "Photo"
                    ) : (
                      <div className='flex gap-1 items-center'>
                        <NotepadText size={14} className="flex-shrink-0" />
                        <span className="truncate">{user.friend.bio}</span>
                      </div>
                    )}
                  </span>
                </>
              )}
            </div>
            
            {isReaded > 0 && (
              <span className="inline-block rounded-full bg-blue-600 text-white px-2 py-0.5 text-xs font-semibold ml-2 flex-shrink-0">
                {isReaded > 99 ? '99+' : isReaded}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
})

export default User