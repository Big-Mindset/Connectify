import { groupstore } from '@/zustand/groupStore'
import { authstore } from '@/zustand/store'
import Avatar from "@/assets/Avatar.webp"

import Image from 'next/image'
import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import ColoredTick from "@/assets/coloredTick.svg"
import twoTicks2 from "@/assets/ticksTwo2.svg"
import singleTick from "@/assets/singleTick.svg"
import { ImageIcon } from 'lucide-react'
import { CrossCircledIcon } from '@radix-ui/react-icons'
const User = React.memo(({ user, idx }) => {
  const Selected = authstore.use.Selected();
  const onlineUsers = authstore.use.onlineUsers();
  const setSelected = authstore.use.setSelected();
  let session = authstore.use?.session()
  const setselectedGroup = groupstore.use.setselectedGroup();

  const setselectedInfo = authstore.use.setselectedInfo();
  const handleSelect = (user) => {
    setSelected(user.friend.id)
    setselectedInfo(user)
    setselectedGroup(null)
  }
  let status = user?.lastmessage?.status
  let dat = user?.lastmessage?.createdAt
  let res = new Date(dat)
  let isSender = user.lastmessage?.senderId === session?.user?.id
  let content = useMemo(()=>{
    return user.lastmessage?.content?.slice(0, 60) < user.lastmessage?.content ? `${user.lastmessage?.content?.slice(0, 60)}...` : user.lastmessage?.content?.slice(0, 67)

  },[user.lastmessage?.content])
    let showContent = (!content && user.lastmessage?.DeleteForEveryone || content)
    
  return (
    <motion.div

      onClick={() => handleSelect(user)}
      style={{ animationDelay: `${idx * 75}ms` }}

      className={`flex cursor-pointer  ${Selected === user.friend.id ? "bg-gradient-to-r from-gray-200 to-gray-200 dark:from-blue-700/30 dark:to-blue-500/40   " : "dark:hover:from-blue-500/40  dark:hover:to-blue-500/40  bg-gradient-to-r hover:from-gray-200 hover:to-gray-200 "} opacity-0 animate-fade-in-up  rounded-md  mb-1   justify-between gap-2 w-full p-3   
    px-2.5  transition-colors duration-100   `}>
      <div className='flex gap-4'>
        <div className='relative'>


          <span className={` size-3  transition-all duration-700 right-0 ease-in-out rounded-full z-20 bottom-1 ${onlineUsers?.includes(user.friend.id) ? "opacity-100 scale-100 bg-gradient-to-r from-green-300 to-green-500 " : "scale-0 opacity-0"}  right-[0.5px] absolute bg-blue-600  `}>

          </span>
          <div className='rounded-full  relative  overflow-hidden ring-[0.7px] group-hover:ring-2  ring-indigo-600/50 duration-200 size-14 border-1 border-indigo-500/30'>
            <Image
              src={user.friend.avatar || Avatar}
              alt='User'
              fill
              priority
              className='object-cover'
            />
          </div>



        </div>

        <div className='flex justify-center  flex-col'>
          <h2 className='text-[1rem] font-sans mb-1 text-black/80 dark:text-indigo-50'>{user.friend.name}</h2>
          <div className='flex gap-1 '>
         { !user?.lastmessage?.DeleteForEveryone  &&
            <div className='mt-1'>

              {
                (session?.user.id === user?.lastmessage?.senderId && content) && (
                  status === "delivered" ?
                    (<Image loading="lazy"
                      placeholder="blur"
                      blurDataURL="/tiny.jpg"
                      className="size-4 dark:invert-75 invert-25  mb-1" src={ColoredTick} alt="delivered" />)
                    : status === "read" ?

                      (



                        <Image loading="lazy" className="size-4  mb-1" src={twoTicks2} alt="read" />


                      ) :

                      (<Image loading="lazy" className="size-3 invert-75 mb-1" src={singleTick} alt="send" />)
                )
              }
            </div>
            }
            {user?.lastmessage?.DeleteForEveryone ? <div className="flex gap-1 items-center">
              <CrossCircledIcon className="size-5 text-gray-400" />
              <p className="text-[0.9rem]  ml-0.5 dark:font-[500]  font-[400] break-all text-black/80 dark:text-gray-400 mb-[1.5px] flex-1 min-w-0">
                {
                  isSender ? "You deleted this message" : "This message was deleted"
                }

              </p>
            </div> :
              <>
                {user?.lastmessage?.image?.length > 0 && <ImageIcon className='size-5 text-blue-500' />}
                <span className='text-[0.8rem] justify-self-start dark:text-gray-400 text-black/60'>{(showContent || user.lastmessage?.image ) ? (content ? content : "Photo") :  user.friend.bio}</span>
              </>
            }
          </div>

        </div>

      </div>
      {
        dat &&
        <div className='justify-self-start  mt-2'>
          <span className='dark:text-gray-300 text-black/70 text-[0.7rem]'>
            {res.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true
            })}
          </span>
        </div>
      }
    </motion.div>
  )
})

export default User












