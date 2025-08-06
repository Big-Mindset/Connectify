"use client"

import { authstore } from '@/zustand/store'
import axios from 'axios'
import { Check, Hourglass, MessageCircleMoreIcon, UserPlus2, X } from 'lucide-react'
import Image from 'next/image'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

const SearchedUsers = ({ user,setsearchResult,searchResult }) => {

  const onlineUsers = authstore.use.onlineUsers();
  const session = authstore.use.session();
  const setSelected = authstore.use.setSelected();
  const Selected = authstore.use.Selected();
  const users = authstore.use.users();
  const setselectedInfo = authstore.use.setselectedInfo();
  
  

  const handleSendRequest = async () => {
    try {
      const res = await axios.post("/api/sendFriendRequest", {
        senderId: session?.user.id,
        receiverId : user.id
      })
      
      let result = searchResult.map((us)=>{
        if (us.id === user.id){
          return {...us,requestReceived : [...us.requestReceived,res?.data?.data]}
          // us.requestReceived.push(res?.data?.data)
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


  const isOnline = onlineUsers?.includes(user.id)
  let handleCancelRequest = async ()=>{
    let id = user?.requestReceived.at(-1)?.id
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
    
    setselectedInfo({
        friend : {
          id : user.id,
          name : user.name,
          avatar : user.avatar,
          lastseen : user.lastseen
        }
      
    })
    
  }
  let handleSelected = ()=>{
    setSelected(user.id)
  }

  let handleRequest=async (reqStatus)=>{
    let res = await axios.put("api/accept-Reject-Request",{friendRequestId :user.requestSent.at(-1).id ,status : reqStatus})
    if (res.status === 200){
      let result = searchResult.map((us) => {
        if (us.id === user.id) {
          const updatedRequestSent = [...us.requestSent];
            updatedRequestSent[updatedRequestSent.length - 1] = {
            ...updatedRequestSent[updatedRequestSent.length - 1],
            status: reqStatus
          };
          return {...us,requestSent : updatedRequestSent}
        }
        return us
      })
  
      
      setsearchResult(result)
    }else{
      toast.error("Network Problem try again")
    }
    
    
  }
  
  let requestSentByThem = useMemo(()=>{
    if (user.requestSent.length === 0) return false
    let requestSent = user.requestSent.at(-1).status
   return ["Pending","Accepted","Rejected"].includes(requestSent) && requestSent
  },[user.requestSent])
  let requestReceivedByThem = useMemo(()=>{
    if (user.requestReceived.length === 0) return false

    let requestReceived = user.requestReceived.at(-1).status
   return ["Pending","Accepted","Rejected"].includes(requestReceived) && requestReceived
  },[user.requestReceived])
  console.log(requestSentByThem);
  console.log(requestReceivedByThem);
  
  return (
    <div
    onClick={handleSelect} 
      style={{ animationDelay: `${1 * 75}ms` }}
      className="animate-fade-in-up opacity-0 flex w-full p-3  transition-all duration-200 hover:bg-indigo-900/20 rounded-lg border border-indigo-800/50 mb-2"
    >
      <div className="flex flex-1  gap-3 items-center">
        <div className="relative">
          <div className="rounded-full overflow-hidden ring-1  ring-indigo-600/70 duration-200 w-12 h-12">
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
      {
        requestReceivedByThem === "Pending" &&
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
            }

          {(requestSentByThem === "Accepted" || requestReceivedByThem === "Accepted") && <button onClick={handleSelected} className='border-[0.5px] hover:border-indigo-700 p-2 text-blue-400 flex gap-1 rounded-xl cursor-pointer animate-fade-in-up opacity-0 hover:bg-indigo-500 hover:text-white duration-150 items-center '>
          <p className=''>Open Chat</p>
          <MessageCircleMoreIcon  />
        </button> }
        {requestSentByThem === "Pending" &&<div className=' flex gap-2 transition-colors duration-150   items-center'>
          <button onClick={()=>handleRequest("Rejected")} className='flex gap-1  bg-red-600 hover:bg-red-700  cursor-pointer  text-red-100  border-[0.5px] rounded-full p-1.5   items-center'>
          <X/>
          </button>
          <button onClick={()=>handleRequest("Accepted")} className='flex gap-1  bg-green-600 hover:bg-green-700 cursor-pointer text-green-100  border-[0.5px] rounded-full p-1.5  items-center'>
          <Check/>
      
          </button>
        </div>}

       { (!["Accepted" , "Pending"].includes(requestSentByThem ) && !["Accepted" , "Pending"].includes(requestReceivedByThem )) && 
          <button
            onClick={handleSendRequest}
            className="group flex items-center justify-center w-9 h-9 rounded-full bg-indigo-800 hover:bg-indigo-700 transition-colors"
            aria-label="Send friend request"
          >
            <UserPlus2 className="text-indigo-300 group-hover:text-indigo-100 size-5 transition-colors" />
          </button>
          }

        
      </div>
    </div>
  )
}

export default SearchedUsers