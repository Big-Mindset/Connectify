"use client"


import { Roboto } from 'next/font/google';
import ChatList from '@/components/ChatsComp/ChatList';
import ChatMain from '@/components/ChatsComp/ChatMain';
import {  useEffect, useState } from 'react';
import { authStore } from '@/zustand/store';
import { groupStore } from '@/zustand/groupStore';
import AddFriends from '@/components/AddFriends';
const roboto = Roboto({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"]
});

const Page = () => {
  let {session,socket,Selected,handleGetMessage,readed,changeAllStatus} = authStore()

  let {selectedGroup,groups,handleGetMessages,handleGroupDelivered,getGroup} = groupStore()
  let {connectSocket} = authStore()
  useEffect(() => {
    connectSocket()
      return () => {
        return ()=> socket?.disconnect()
      }
      
    }, [session])
      const [openfriendSearch, setopenfriendSearch] = useState(false)
    
    useEffect(() => {

      if (!socket) return;
      
      socket.on("get-message", handleGetMessage);
      socket.on("readed",readed)
      socket.on("changeStatus-all",changeAllStatus)
      socket.on("receiveMessages",handleGetMessages)
    socket.on("groupDelivered-success",handleGroupDelivered)
    socket.on("fetch-groups",getGroup)
    
    return () => {
      socket.off("fetch-groups",getGroup)  
        socket.off("receiveMessages",handleGetMessages)
        socket.off("get-message", handleGetMessage);
        socket.off("readed",readed)
        socket.off("groupDelivered-success",handleGroupDelivered)

      };
    }, [socket]);


    useEffect(() => {
      let senderId = session?.data?.user?.id
      
      if (senderId ){
        
        socket?.emit("message-delivered",senderId)
      }
    }, [socket,Selected,session])
    useEffect(() => {
      
      
    
        
      getGroup()
    
  }, [])
  

  useEffect(() => {
    let usersObj = {}

    groups?.forEach((group)=>{
      usersObj[group.id] = [...group.users]
  })
  socket?.emit("join-users",usersObj,(res)=>{
    if (!res.success) console.log("joined failed")  
  })
  }, [socket,groups])
    
  return (
<div className={`h-[calc(100%-20px)] pt-3.5 flex justify-center ${roboto.className}`}>
  <div className='rounded-xl overflow-hidden flex w-full max-w-[90%]   backdrop-blur-lg border border-indigo-900/50 bg-gradient-to-br from-[#0F0A1F] to-[#1A1433]'>

    <div className='basis-1/3 relative bg-[#1A1433]/95 p-3 border-r border-indigo-900/30'>
      
       
       {openfriendSearch ? <AddFriends  setopenfriendSearch= {setopenfriendSearch} />  :<ChatList setopenfriendSearch= {setopenfriendSearch}  /> }
    </div>

    {Selected || selectedGroup ? (
      <ChatMain />
    ) : (
      <div>
        
      </div>
    )}
  </div>
</div>

  )
}

export default Page