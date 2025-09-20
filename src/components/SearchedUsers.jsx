"use client"

import { authstore } from '@/zustand/store'
import axios from 'axios'
import { Check, Hourglass, Loader, Loader2, MessageCircleMoreIcon, UserPlus2, X } from 'lucide-react'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

const SearchedUsers = ({ user,setsearchResult,searchResult }) => {

  const onlineUsers = authstore.use.onlineUsers();
  const session = authstore.use.session();
  const socket = authstore.use.socket();
  const setSelected = authstore.use.setSelected();
  const setselectedInfo = authstore.use.setselectedInfo();
  
  const [loading, setloading] = useState(false)

  const handleSendRequest = async () => {
    console.log("running");
    
    try {
      setloading(true)
      const res = await axios.post("/api/sendFriendRequest", {
        senderId: session?.user.id,
        receiverId : user.id
      })

      if (res.status === 200){
          setsearchResult(prevResults => 
        prevResults.map((us) => {
          if (us.id === user.id) {
            return {
              ...us,
              requestReceived: res.data.data ? [res.data.data] : []
            };
          }
          return us;
        })
      );
        socket.emit("sendRequest",{...user,requestReceived : res.data.data})
      }
      
      setloading(false)

  
      
      toast.success(res.data.message)
    } catch (error) {
      console.log(error.message);
      
      toast.error("Failed to send request")
    }
  }


  const isOnline = onlineUsers?.includes(user.id)
  let handleCancelRequest = async ()=>{
    let id = user?.requestReceived.at(-1)?.id
    console.log("the id is "+ id);
    
    setloading(true)
    let res = await axios.delete(`/api/deleteRequest/${id}`)

    if (res.status === 200){
    
      let result = searchResult.map((us)=>{
        if (us.id === user.id){
          us.requestReceived = []
        }
        return us
      })
    setloading(false)
      
    socket.emit("cancelRequest",{id : user.id , requestId : id})
      setsearchResult(result)
    }
    
  }

  let handleSelected = ()=>{
    setSelected(user.id)
   
    setselectedInfo({
      friend : {
        id : user.id,
        name : user.name,
        avatar : user.avatar,
        lastseen : user.lastseen
      }
    
  })
  }

  let handleRequest=async (reqStatus)=>{
    setloading(true)

    let res = await axios.put("api/accept-Reject-Request",{friendRequestId :user.requestSent[0].id ,status : reqStatus})
    if (res.status === 200){
      let result = searchResult.map((us) => {
        if (us.id === user.id) {
          if (reqStatus === "Rejected"){
            return {...us,requestSent : []}

          }else{
            return {...us , reqStatus : {...us,requestSent : [{...us.requestSent[0],status : reqStatus}]}}
          }
        } 
        return us
      })
  
      
      setsearchResult(result)
    }else{
      toast.error("Network Problem try again")
    }
    setloading(false)

    
  }
  
  let requestSentByThem = useMemo(()=>{
    if (user.requestSent.length === 0) return false
    let requestSent = user.requestSent.at(-1).status
   return ["Pending","Accepted"].includes(requestSent) && requestSent
  },[user.requestSent])
  let requestReceivedByThem = useMemo(()=>{
    if (user.requestReceived.length === 0) return false

    let requestReceived = user.requestReceived.at(-1).status
   return ["Pending","Accepted"].includes(requestReceived) && requestReceived
  },[user.requestReceived])
  console.log(requestSentByThem , requestReceivedByThem);
  
  return (
    <div
      style={{ animationDelay: `${1 * 75}ms` }}
      className=" flex w-full p-3  transition-all duration-200 dark:hover:bg-indigo-900/20 rounded-lg dark:border border-[0.7px] border-gray-400  dark:border-indigo-800/50 mb-2 "
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
            <h3 className="dark:text-indigo-100 text-black font-medium truncate">{user.name}</h3>
            <span className={`text-xs ${isOnline  ? "text-green-500" : "text-gray-700" }  dark:text-indigo-400/80`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <p className="text-[0.8rem] dark:text-indigo-300/80 text-blue-500 truncate mt-0.5">
            {user.bio}
          </p>
        </div>
      </div>

      <div className="flex items-center">
      {
        requestReceivedByThem === "Pending" ?
          <div className="flex items-center gap-2 bg-blue-600 dark:bg-indigo-800/50 px-3 py-1.5 rounded-lg">
            <Hourglass className="text-yellow-400 size-4 animate-pulse" />
            <span className="text-sm dark:text-indigo-200 text-gray-100 border-r-2 pr-2 dark:border-purple-300">Pending</span>
            {loading
             ? <Loader2 className='animate-spin' /> :  
            <button 
              className="ml-1.5 dark:text-indigo-300 cursor-pointer text-gray-100 flex   items-center  transition-colors"
              onClick={handleCancelRequest}
              >
              <X className="size-4" />
            
            </button>}
          </div>
  : 
(requestSentByThem === "Accepted" || requestReceivedByThem === "Accepted") ? <button onClick={handleSelected} className='border-[0.5px] hover:border-indigo-700 p-2 text-blue-400 flex gap-1 rounded-xl cursor-pointer animate-fade-in-up opacity-0 hover:bg-indigo-500 hover:text-white duration-150 items-center '>
          <p className=''>Open Chat</p>
          <MessageCircleMoreIcon  />
        </button> 
      :  
        requestSentByThem === "Pending" ? <div className=' flex gap-2 transition-colors duration-150   items-center'>
          {loading  ?   <Loader2 className='animate-spin' /> : 
  <>
            <button onClick={()=>handleRequest("Rejected")} className='flex gap-1  bg-red-600 hover:bg-red-700  cursor-pointer  text-red-100  border-[0.5px] rounded-full p-1.5   items-center'>
          <X/>
          </button>
          <button onClick={()=>handleRequest("Accepted")} className='flex gap-1  bg-green-600 hover:bg-green-700 cursor-pointer text-green-100  border-[0.5px] rounded-full p-1.5  items-center'>
          <Check/>
      
          </button>
  </>
          }
        </div>
        :
        
          

        (!["Accepted" , "Pending"].includes(requestSentByThem ) && !["Accepted" , "Pending"].includes(requestReceivedByThem )) && 
       loading ?   <Loader2 className='animate-spin' /> : 
          <button
            onClick={handleSendRequest}
            className="group flex items-center justify-center w-9 h-9 rounded-full cursor-pointer hover:bg-blue-600 bg-blue-500 dark:bg-indigo-800  dark:hover:bg-indigo-700 transition-colors"
            aria-label="Send friend request"
          >
            <UserPlus2 className="dark:text-indigo-300 text-white dark:group-hover:text-indigo-100 size-5 transition-colors" />
          </button>
        
       }

        
      </div>
    </div>
  )
}

export default SearchedUsers