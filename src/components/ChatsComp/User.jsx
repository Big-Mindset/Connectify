import { groupStore } from '@/zustand/groupStore'
import { authStore } from '@/zustand/store'
import Image from 'next/image'
import React from 'react'

const User = ({ user, idx }) => {
  let { Selected, onlineUsers, setSelected } = authStore()
  let { setselectedGroup } = groupStore()
  const handleSelect = (userId) => {
    setSelected(userId)
    setselectedGroup(null)
  }

  return (
    <div onClick={() => handleSelect(user.id)}
      style={{ animationDelay: `${idx * 75}ms` }}

      className={`flex ${Selected === user.id ? "bg-blue-800/50 " : "hover:bg-purple-800/20 group"} animate-fade-in-up  opacity-0  justify-between gap-2 w-full border-b-[0.4px] pb-3 border-indigo-600    
    px-2.5  transition-all duration-200  p-1.5 items-center`}>
      <div className='flex gap-2'>
        <div className='relative'>

          <div className='rounded-full   overflow-hidden ring-[0.7px] group-hover:ring-2 group-hover:scale-105 ring-indigo-600/50 duration-200 size-14 border-1 border-indigo-500/30'>
            <Image
              src={user.avatar}
              alt='User'
              width={100}
              height={100}
              className='object-cover'
            />
          </div>
          {onlineUsers && onlineUsers?.includes(user.id) && <div className='absolute bottom-1 ring-1  right-0 rounded-full size-3 bg-green-500'></div>
            }


        </div>

        <div className='flex justify-center flex-col'>
          <h2 className='text-[1rem] font-medium text-indigo-50'>{user.name}</h2>
          <p className='flex gap-1 items-center'>
            <span className='text-[0.8rem]  text-indigo-300/80'>{user.bio || "No bio for that user"}</span></p>
        </div>

      </div>
      <div className='justify-self-end items-start'>
        <span className='text-green-400 font-bold text-sm'>
          {onlineUsers && onlineUsers?.includes(user.id) ? "Online" : "Offline"}

        </span>
      </div>
    </div>
  )
}

export default User












