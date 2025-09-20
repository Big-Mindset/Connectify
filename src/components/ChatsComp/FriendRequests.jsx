import { Inbox, Send, Timer, X } from 'lucide-react'
import Image from 'next/image'
import React, {  useEffect, useState } from 'react'
import Button from '../friendrequestComps/Button'
import Button2 from '../friendrequestComps/Button2'
import { GetFriendRequests } from '@/actions/GetFriendRequests'
import toast from 'react-hot-toast'
import { authstore } from '@/zustand/store'
import properLogo from '@/assets/logop.webp'
import axios from 'axios'
import {motion} from "framer-motion"
const FriendRequests = ({ setopenFriendRequest }) => {
  // Texts = #C2E6FF , #70B8FF
    let socket = authstore.use.socket()
  let session = authstore.use.session()
  let playSound = authstore.use.playSound()
  const [Requests, setRequests] = useState([])
  const [loading, setloading] = useState(true)
  const [Selected, setSelected] = useState("Received")
  let isSelected = Selected === "Received"
  
  let filteredData = Requests.filter((req)=>{
    let isSender = session.user.id  === req.senderId
    return (!isSender && isSelected) || (isSender && !isSelected)
  })
  let isSender = filteredData[0]?.senderId === session.user.id
  
  useEffect(() => {
    let getallRequests = async () => {
      
      let res = await GetFriendRequests()
      setloading(false)
      if (res.status === 200) {
        setRequests(res.Requests)
      } else {
        toast.error(res.message)
      }

    }
    getallRequests()
  }, [])
  
  let handleRequest = async (id)=>{
    setRequests(prev=>{
      return prev.filter((req)=>req.id !== id)
    })
    let res = await axios.delete(`/api/deleteRequest/${id}`)
    if (res.status === 200){
      toast.success("Request canceled")
    }
  }
  useEffect(() => {
    let handleReuest = (user)=>{
     playSound()
      let isAvailabe = Requests.find((req)=>req.id === user.requestReceived.id)
      if (!isAvailabe){
        
        setRequests((req)=>{
          
          return [...req,{
            data : {
              name : user.name ,
              bio : user.bio,
              avatar : user.avatar
            },
            id : user.requestReceived.id,
            createdAt : user.requestReceived.createdAt,
            status : user.requestReceived.status
          }]
        })
        
      }
    }
    let cancelRequest = (user)=>{
        
      setRequests((req)=>{
          
        return req.filter((r)=>r.id !== user.requestId)
      })
    }
    socket.on("request_receive_notification",handleReuest)
    socket.on("cancel_request",cancelRequest)
    return () => {
      socket.off("request_receive_notification",handleReuest)
      socket.off("cancel_request",cancelRequest)
    }
  }, [])
  
  
  return (
    <motion.div
    initial={{x : -500 ,}}
    animate={{x : 0 }}
    transition={{duration : 0.5}}
    className='bg-gradient-to-br p-4  h-full dark:from-[#0D2847] to-gray-100 from-white  dark:to-[#141726] absolute inset-0 z-20'>
      <header className='mb-4 flex justify-between items-center' >
        <h1 className='font-bold dark:text-[#70B8FF] text-blue-950 text-[1.3rem]'>Friend Requests</h1>
        <div
          onClick={() => {
            setopenFriendRequest(false)
          }}
          className='rounded-full hover:bg-blue-500 relative z-50 cursor-pointer p-1.5'>

          <X className="text-blue-300" size={20} />
        </div>
      </header>
      <div className='flex gap-3 mb-6 ml-2  items-center'>
        <Button2 status={"Received"} setSelected={setSelected} Selected={Selected} />
        <Button2 status={"Sent"} setSelected={setSelected} Selected={Selected} />
      </div>
      <div className='flex gap-1.5 justify-center items-center'>
        <div className='size-2 rounded-full bg-blue-400'>

        </div>
        <hr className='w-3.5 mt-3.5 border-blue-400' />
        <div className='size-2 rounded-full bg-blue-400'>

        </div>
      </div>
      {
        loading ?  
        <>
          <div className='absolute inset-0 bg-gray-900/40 z-40'></div>
        <div className='absolute text-3xl left-1/2 z-50 top-1/2 -translate-x-1/2 -translate-y-1/2'>
                    <Image src={properLogo} alt="Loading" width={100} height={100} className='animate-pulse relative z-30' />
                  </div> 
        </> 
                  : 
      filteredData.length > 0 ? filteredData.map((req) => {
        let time = new Date(req.createdAt)
        const day = time.toLocaleDateString("en-US", { weekday: "long" });
        const date = time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        });
          return (
            
            <main
              key={req.id}
              className='mt-3.5 border-[0.1px] border-blue-400/50 rounded-lg p-1 bg-blue-900/20 '>
              <div className='user-container rounded-lg  bg-[#] p-2 '>
                <div className='flex items-center justify-between gap-1.5 '>

                  <div className='flex items-center gap-2 '>
                    <div className='user-avatar rounded-full relative overflow-hidden size-14 border-2 b p-0.5'>
                      <Image alt="user-avatar" fill sizes={20}
                        className='w-full h-full object-cover'
                        src={req.data?.avatar} />
                    </div>
                    <div className='flex flex-col'>
                      <p className='font-bold dark:text-blue-100 text-gray-800'>{req.data?.name}</p>
                      <p className='text-[0.8rem] dark:text-gray-300 text-gray-600'>{req.data?.bio}</p>
                    </div>
                  </div>
                  <div className='flex flex-col gap-2 grow-[0.2]'>
                    <div className='flex gap-0.5  items-center'>
                      <Timer size={14} className='dark:text-blue-300 text-blue-800' />
                      <p className='text-[0.79rem] dark:text-blue-100 text-blue-800'>
                        Sent at {day} {date}</p>
                    </div>

                    {isSender ?

                      <button
                        onClick={()=>{
                          handleRequest(req.id)
                        }}

                        className={`border-[1px] hover:text-black hover:border-black flex gap-1 justify-center items-center   py-1 px-2 rounded-full border-red-400  dark:hover:text-red-100 dark:hover:border-red-300  dark:text-red-300 text-red-700  cursor-pointer `}>
                        <X /> <p className=''>Cancel</p>
                      </button>
                      :
                      <div className='flex gap-2 '>
                        <Button status={"Reject"}  userdata={req} setRequests={setRequests}  />
                        <Button status={"Accept"} userdata={req} setRequests={setRequests}   />
                      </div>
                    }
                  </div>
                </div>
              </div>
            </main>

          )

        

      }
    )
    : <div>
        {isSelected ? (
    <div className='absolute left-1/2 top-[40%] -translate-x-1/2 flex flex-col items-center gap-2 mt-2'>
      <Inbox size={32} className='dark:text-blue-300 text-blue-800' />
      <p className='dark:text-[#C2E6FF] text-blue-700'>You haven't received a friend request</p>
    </div>
  ) : (
    <div className='absolute left-1/2 top-[40%] -translate-x-1/2 flex flex-col items-center gap-2 mt-2'>
      <Send size={32} className='dark:text-blue-300 text-blue-800' />
      <p className='dark:text-[#C2E6FF] text-blue-700'>You haven't sent a friend request</p>
    </div>
  )}
      </div>
    }

  
    </motion.div>
  )
}

export default FriendRequests