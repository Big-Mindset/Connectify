import { groupstore } from '@/zustand/groupStore'
import { authStore, authstore } from '@/zustand/store'
import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
import ColoredTick from "@/assets/coloredTick.svg"
import twoTicks2 from "@/assets/ticksTwo2.svg"
import singleTick from "@/assets/singleTick.svg"
import { ImageIcon } from 'lucide-react'
const User = React.memo(({ user, idx }) => {
  const Selected = authstore.use.Selected();
  const onlineUsers = authstore.use.onlineUsers();
  const setSelected = authstore.use.setSelected();
  let session  = authstore.use?.session()
  const setselectedGroup = groupstore.use.setselectedGroup();

  const setselectedInfo = authstore.use.setselectedInfo();
  const selectedInfo = authstore.use.selectedInfo();
  const handleSelect = (user) => {
    setSelected(user.friend.id)
    setselectedInfo(user)
    setselectedGroup(null)
  }
  let status = user?.lastmessage?.status
  let dat = user?.lastmessage?.createdAt
  let res = new Date(dat)
  
  return (
    <motion.div

      onClick={() => handleSelect(user)}
      style={{ animationDelay: `${idx * 75}ms` }}

      className={`flex ${Selected === user.friend.id ? "bg-gradient-to-r from-blue-800/50 to-blue-600/50   " : "hover:from-blue-400/30  hover:to-blue-600/10 bg-gradient-to-r group"} opacity-0 animate-fade-in-up  rounded-md   justify-between gap-2 w-full border-b-[0.4px] pb-3 border-blue-600/60    
    px-2.5  transition-colors duration-200  p-1.5 items-center`}>
      <div className='flex gap-2'>
        <div className='relative'>

      
          <span className= {` size-3  transition-all duration-700 ease-in-out rounded-full z-20 bottom-1 ${onlineUsers?.includes(user.friend.id) ?  "opacity-100 scale-100 bg-gradient-to-r from-blue-600/60 to-indigo-700/60 " : "scale-0 opacity-0"  }  right-[0.5px] absolute bg-blue-600  `}>

          </span>
          <div className='rounded-full    overflow-hidden ring-[0.7px] group-hover:ring-2 group-hover:scale-105 ring-indigo-600/50 duration-200 size-14 border-1 border-indigo-500/30'>
            <Image
              src={user.friend.avatar}
              alt='User'
              width={100}
              priority  
              height={100}
              className='object-cover'
            />
          </div>



        </div>

        <div className='flex justify-center flex-col'>
          <h2 className='text-[1rem] font-medium text-indigo-50'>{user.friend.name}</h2>
          <div className='flex gap-1 items-center'>
            <div className='mt-1'>
        
            {
              session?.user.id === user?.lastmessage?.senderId && (
                status === "delivered" ?
                  (<Image loading="lazy"
                    placeholder="blur"
                    blurDataURL="/tiny.jpg"
                    className="size-4 invert-75 mb-1" src={ColoredTick} alt="delivered" />)
                    : status === "read" ?
                    
                    (

                      
                      
                      <Image loading="lazy" className="size-4  mb-1" src={twoTicks2} alt="read" />

                      
                    ) :
                    
                    (<Image loading="lazy" className="size-3 invert-75 mb-1" src={singleTick} alt="send" />)
              )
            }
            </div>
              {user?.lastmessage?.image?.length > 0 && <ImageIcon className='size-5 text-blue-500' />}
              <span className='text-[0.8rem]  text-gray-400'>{user.lastmessage?.content?.slice(0, 60) < user.lastmessage?.content ? `${user.lastmessage?.content?.slice(0, 60)}...` : user.lastmessage?.content?.slice(0, 67)}</span>
            </div>
          
        </div>

      </div>
      {
        dat &&
      <div className='justify-self-start items-start'>
        <span className='text-gray-300 text-[0.8rem]'>
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












