"use client"

import { useEffect, useMemo, useRef, useState } from 'react';
import { authstore } from '@/zustand/store';
import { groupstore } from '@/zustand/groupStore';
export function SocketLogic() {
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
  const updateReaction2 = authstore.use.updateReaction2()
  const d_reaction = authstore.use.d_reaction()
  const u_reaction = authstore.use.u_reaction()
  const delete_message = authstore.use.delete_message()
  const handleRequestNotification = authstore.use.handleRequestNotification()
  const handleAccpeted = authstore.use.handleAccpeted()
  useEffect(() => {
    if (session?.user?.id) {

      connectSocket()
    }
    return () => socket?.disconnect()

  }, [session?.user?.id])
  let sockets = useMemo(() => ({
    "get-message": handleGetMessage,
    "readed": readed,
    "changeStatus-all": changeAllStatus,
    "receiveMessages": handleGetMessages,
    "groupDelivered-success": handleGroupDelivered,
    "fetch-groups": getGroup,
    "upodateIndexdb": updateInIndexdb,
    "receive-reaction": updateReaction2,
    "d-reaction": d_reaction,
    "u-reaction": u_reaction,
    "deleleMessage": delete_message,
    "request_receive_notification": handleRequestNotification,
    "request_accepted": handleAccpeted,


  }), [handleGetMessage, readed, changeAllStatus, handleGetMessage, handleGroupDelivered, getGroup, updateInIndexdb, updateReaction2, d_reaction, u_reaction, delete_message, handleRequestNotification, handleAccpeted])
  useEffect(() => {


    if (!socket) return;
    Object.entries(sockets).forEach(([key, val]) => {

      socket.on(key, val)
    })
    return () => {
      Object.entries(sockets).forEach(([key, val]) => {
        socket.off(key, val)
      })
    }
  }, [socket])




  useEffect(() => {
    let senderId = session?.data?.user?.id

    if (senderId && socket) {

      socket?.emit("message-delivered", senderId)
    }
  }, [socket, Selected, session])

  useEffect(() => {
    socket?.on("lastseen", (data) => {

      setUsers((prev) =>
        prev.map((user) => {
          if (user.friend.id === data.updated.id) {
            return { ...user, friend: { ...user.friend, lastseen: data.updated.lastseen } };
          }
          return user;
        }));
          
      if (selectedInfo?.id === data.updated.id) {
        let updated = {...selectedInfo , friend: { ...selectedInfo.friend, lastseen: data.updated.lastseen }}
          setselectedInfo(updated)
      }

    })
  }, [socket, users])


const isFirstRender = useRef(true);

useEffect(() => {
  if (!socket?.connected || groups.length === 0) return;
  
  let usersObj = {};
  
  if (isFirstRender.current) {
    groups.forEach((group) => {
      usersObj[group.id] = [...group.users];
    });
      const allGroupIds = groups.map(g => g.id);
      localStorage.setItem("groupIds", JSON.stringify(allGroupIds));
    isFirstRender.current = false;
  } else {
    let storedGroupIds = [];
    try {
      const stored = localStorage.getItem("groupIds");
      storedGroupIds = stored ? JSON.parse(stored) : [];
    } catch (error) {
      storedGroupIds = [];
    }
    const newGroups = groups.filter(group => !storedGroupIds.includes(group.id));
    
    if (newGroups.length > 0) {
      newGroups.forEach((group) => {
        usersObj[group.id] = [...group.users];
      });
     
        const allGroupIds = groups.map(g => g.id);
        localStorage.setItem("groupIds", JSON.stringify(allGroupIds));
      
    }
  }
  
  if (Object.keys(usersObj).length === 0) {
    return;
  }
  
    const timeout = setTimeout(() => {
      socket.emit("join-users", usersObj, (res) => {
        if (res && res.success) {
          console.log("Successfully joined groups:");
        }
    });
  }, 200);

  
  return () => clearTimeout(timeout);
}, [socket?.connected, groups]);

}
