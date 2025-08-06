"use client"

import {  useEffect, useMemo } from 'react';
import { authstore } from '@/zustand/store';
import { groupstore } from '@/zustand/groupStore';
const SocketLogic = () => {
    const session = authstore.use.session();
    const socket = authstore.use.socket();
    const Selected = authstore.use.Selected();
    const handleGetMessage = authstore.use.handleGetMessage();
    const readed = authstore.use.readed();
    const changeAllStatus = authstore.use.changeAllStatus();
    const connectSocket = authstore.use.connectSocket();
    const updateInIndexdb = authstore.use.updateInIndexdb()
    const groups = groupstore.use.groups();
    const handleGetMessages = groupstore.use.handleGetMessages();
    const handleGroupDelivered = groupstore.use.handleGroupDelivered();
    const getGroup = groupstore.use.getGroup();
    const users = authstore.use.users();
    const setUsers = authstore.use.setUsers();
   const setselectedInfo = authstore.use.setselectedInfo()
   const selectedInfo = authstore.use.selectedInfo()
    
    useEffect(() => {
      connectSocket()
        return () => socket?.disconnect()
        
      }, [session])
      let sockets = useMemo(()=>({
        "get-message" : handleGetMessage,
        "readed" : readed,
        "changeStatus-all" : changeAllStatus,
        "receiveMessages" : handleGetMessages,
        "groupDelivered-success" : handleGroupDelivered,
        "fetch-groups" : getGroup,
        "upodateIndexdb" : updateInIndexdb
  
      }),[handleGetMessage,readed,changeAllStatus,handleGetMessage,handleGroupDelivered,getGroup,updateInIndexdb])
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
      },[socket])
      
    
  
  
      useEffect(() => {
        let senderId = session?.data?.user?.id
        
        if (senderId && socket){
          
          socket?.emit("message-delivered",senderId)
        }
      }, [socket,Selected,session])

      useEffect(() => {
        socket?.on("lastseen",(data)=>{
          setUsers((prev) =>
            prev.map((user) => {
              if (user.friend.id === data.updated.id) {
                return { ...user, friend: { ...user.friend, lastseen: data.updated.lastseen } };
              }
              return user;
            }));
            if (Selected === data.updated.id){
    
              let update = {...selectedInfo,friend : {...selectedInfo.friend , lastseen : data.updated.lastseen} }
              
              setselectedInfo(update)
            }
            
        })
        getGroup()
    }, [socket,users])
    
  
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