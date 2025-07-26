"use client"

import {  useEffect, useMemo } from 'react';
import { authstore, authStore } from '@/zustand/store';
import { groupstore, groupStore } from '@/zustand/groupStore';
const SocketLogic = () => {
    const session = authstore.use.session();
    const socket = authstore.use.socket();
    const Selected = authstore.use.Selected();
    const handleGetMessage = authstore.use.handleGetMessage();
    const readed = authstore.use.readed();
    const changeAllStatus = authstore.use.changeAllStatus();
    const connectSocket = authstore.use.connectSocket();
    
    const groups = groupstore.use.groups();
    const handleGetMessages = groupstore.use.handleGetMessages();
    const handleGroupDelivered = groupstore.use.handleGroupDelivered();
    const getGroup = groupstore.use.getGroup();
    
  
    useEffect(() => {
      connectSocket()
        return () => socket?.disconnect()
        
      }, [session,connectSocket])
      let sockets = useMemo(()=>({
        "get-message" : handleGetMessage,
        "readed" : readed,
        "changeStatus-all" : changeAllStatus,
        "receiveMessages" : handleGetMessages,
        "groupDelivered-success" : handleGroupDelivered,
        "fetch-groups" : getGroup
  
      }),[handleGetMessage,readed,changeAllStatus,handleGetMessage,handleGroupDelivered,getGroup])
      useEffect(() => {
  
        
        if (!socket) return;
        Object.entries(sockets).forEach(([key,val])=>{
          socket.on(key,val)
        })
      
      return () => {
        Object.entries(sockets).forEach(([key,val])=>{
          socket.off(key,val)
        })
      }
      },[])
      
    
  
  
      useEffect(() => {
        let senderId = session?.data?.user?.id
        
        if (senderId && socket){
          
          socket?.emit("message-delivered",senderId)
        }
      }, [socket,Selected,session])
      useEffect(() => {
        getGroup()
    }, [socket])
    
  
    useEffect(() => {
      let usersObj = {}
  
      groups?.forEach((group)=>{
        usersObj[group.id] = [...group.users]
    })
    socket?.emit("join-users",usersObj,(res)=>{
      if (!res.success) console.log("joined failed")  
    })
    }, [socket,groups])
}

export default SocketLogic