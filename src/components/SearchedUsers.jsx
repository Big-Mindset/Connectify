"use client"

import { authStore } from '@/zustand/store'
import axios from 'axios'
import { Check, Hourglass, MessageCircleMoreIcon, UserPlus2, X } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'

const SearchedUsers = ({ user,setsearchResult,searchResult }) => {
  const { onlineUsers, session,setSelected,Selected,users,setselectedInfo } = authStore()

  const handleSendRequest = async () => {
    try {
      const res = await axios.post("/api/sendFriendRequest", {
        senderId: session?.id,
        receiverId : user.id
      })
      
      let result = searchResult.map((us)=>{
        if (us.id === user.id){
          us.requestReceived.push(res?.data?.data)
        }
        return us
      })
  
      
      setsearchResult(result)
      toast.success(res.data.message)
    } catch (error) {
      console.log(error.message);
      
      toast.error("Failed to send request")
    }
  }

  const isPending = user?.requestReceived[0]?.status === "Pending"
  const acceptRequest = user?.requestSent[0]?.status === "Pending"
  const isAccepted = user?.requestSent[0]?.status === "Accepted"
  const isAcceptedByThem = user?.requestReceived[0]?.status === "Accepted"
  const isOnline = onlineUsers?.includes(user.id)
  let handleCancelRequest = async ()=>{
    let id = user?.requestReceived[0]?.id
    let res = await axios.delete(`/api/deleteRequest?id=${id}`)

    if (res.status === 200){
    
      let result = searchResult.map((us)=>{
        if (us.id === user.id){
          us.requestReceived = []
        }
        return us
      })
      
      setsearchResult(result)
    }
    
  }
 let handleSelect = ()=>{
  
   let info = users?.find(user => {
     return user.id === Selected
    })
    
    setselectedInfo(info)
    
  }

  let handleRequest=async (reqStatus)=>{
    let res = await axios.put("api/accept-Reject-Request",{friendRequestId :user.requestSent[0].id ,status : reqStatus})
    user?.requestSent[0]?.status === "Accepted"
        
    if (res.status === 200){
      let result = searchResult.map((us)=>{
        if (us.id === user.id){
          us.requestSent[0].status = res?.data.status
        }
        return us
      })
  
      
      setsearchResult(result)
    }else{
      toast.error("Network Problem try again")
    }
    
    
  }
  
  return (
    <div
    onClick={handleSelect} 
      style={{ animationDelay: `${1 * 75}ms` }}
      className="animate-fade-in-up opacity-0 flex w-full p-3  transition-all duration-200 hover:bg-indigo-900/20 rounded-lg border border-indigo-800/50 mb-2"
    >
      <div className="flex flex-1 gap-3 items-center">
        <div className="relative">
          <div className="rounded-full overflow-hidden ring-1 ring-indigo-600/70 duration-200 w-12 h-12">
            <Image
              src={user.avatar}
              alt={user.name}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          
          {/* Online status indicator */}
          {isOnline && (
            <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-indigo-900" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <h3 className="text-indigo-100 font-medium truncate">{user.name}</h3>
            <span className="text-xs text-indigo-400/80">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <p className="text-sm text-indigo-300/80 truncate mt-0.5">
            {user.bio || "No bio available"}
          </p>
        </div>
      </div>

      <div className="flex items-center">
        {isPending ? (
          <div className="flex items-center gap-2 bg-indigo-800/50 px-3 py-1.5 rounded-lg">
            <Hourglass className="text-yellow-400 size-4 animate-pulse" />
            <span className="text-sm text-indigo-200 border-r-2 pr-2 border-purple-300">Pending</span>
            <button 
              className="ml-1.5 text-indigo-300 flex  items-center hover:text-red-400 transition-colors"
              onClick={handleCancelRequest}
            >
              <X className="size-4" />
            
            </button>
          </div>

        ) :
        isAccepted || isAcceptedByThem ? <button onClick={()=>setSelected(user.id)} className='border-[0.5px] hover:border-indigo-700 p-2 text-blue-400 flex gap-1 rounded-xl cursor-pointer animate-fade-in-up opacity-0 hover:bg-indigo-500 hover:text-white duration-150 items-center '>
          <p className=''>Open Chat</p>
          <MessageCircleMoreIcon  />
        </button> : 
        acceptRequest ? (
          <div className=' flex gap-2 transition-colors duration-150   items-center'>
          <button onClick={()=>handleRequest("Rejected")} className='flex gap-1  bg-red-600 hover:bg-red-700  cursor-pointer  text-red-100  border-[0.5px] rounded-full p-1.5   items-center'>
          <X/>
          </button>
          <button onClick={()=>handleRequest("Accepted")} className='flex gap-1  bg-green-600 hover:bg-green-700 cursor-pointer text-green-100  border-[0.5px] rounded-full p-1.5  items-center'>
          <Check/>
      
          </button>
        </div>
        ) : 
        (
          <button
            onClick={handleSendRequest}
            className="group flex items-center justify-center w-9 h-9 rounded-full bg-indigo-800 hover:bg-indigo-700 transition-colors"
            aria-label="Send friend request"
          >
            <UserPlus2 className="text-indigo-300 group-hover:text-indigo-100 size-5 transition-colors" />
          </button>
        
        )}
      </div>
    </div>
  )
}

export default SearchedUsers