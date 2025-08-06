"use client"
import axios from "axios"
import toast from "react-hot-toast"
import { io } from "socket.io-client"
import { create } from "zustand"
import { groupStore } from "./groupStore"
import { createSelectors } from "@/lib/Selector"
import { addallmessages, addmessage, getmessagebyid, getOneMessage, updatemessage, updatemessagestatus, updateToRead } from "@/database/indexdb"

export let authStore = create((set, get) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
  session: null,
  socket: null,
  setsession: (session) => set({ session }),
  users: [],
  setUsers: (updaterFn) =>
    set((state) => ({
      users: updaterFn(state.users)
    })),
  onlineUsers: [],
  Selected: null,
  setSelected: (newSelected) => set({ Selected: newSelected }),
  selectedInfo: null,
  setselectedInfo: (selectedInfo) => set({ selectedInfo }),
  setSocket: (socket) => set({ socket }),
  seleleton : false,



  messages: [],
  setMessages: (messagesParam) =>
    set((state) => {
      if (!messagesParam) {
        return { messages: [] };
      }

      if (typeof messagesParam === "object" && !Array.isArray(messagesParam)) {
        return {
          messages: [...state.messages, messagesParam],
        };
      }

      if (Array.isArray(messagesParam)) {
        return { messages: messagesParam };
      }

      const updatedMessages = state.messages.map((msg) =>
        msg?.uniqueId === messagesParam ? { ...msg, status: "delivered" } : msg
      );

      return { messages: updatedMessages };
    }),


  getAllUsers: async () => {
    set({ loading: true })
    try {
      let res = await axios.get("/api/all-users")

      if (res.status === 200) {
         let users = res?.data.users
          set({users : users})
    }} catch (error) {
      console.log(error);

      if (error?.response?.status === 404) {
        toast.error(error?.response?.data.message)
      } else if (error?.response?.status === 404) {
        error?.response?.data.message
      }

      else {
        toast.error(error?.response?.data.message)

      }
    } finally {
      set({ loading: false })


    }

  },
  handleUpdate: async (uniqueId,message) => {
    console.log(message);
    
    await updatemessagestatus(message)
   if (!get().Selected) return
   set(state=>({
    messages : state.messages.map((val)=>{
      if (val?.uniqueId === uniqueId){
       return {...val,status : "delivered"}
     }
     return val
   }) 
   
   }))
   let chatId = get().selectedInfo.id
   set((state)=>({
    users : state.users.map((user)=>{
      if (user?.id === chatId){
        return {...user , lastmessage : {...user.lastmessage , status : "delivered"}}
      }
      return user
    })
   }))
   
  },
  getMessages: async (receiverId,userId) => {
    let senderId = get().session.user.id
    let messages = await getmessagebyid(userId)
    if (messages.length > 0){
     let sorted = messages.sort((a,b)=>new Date(a.createdAt) - new Date(b.createdAt))
      set({messages : sorted})

      return
    }
    try {
    set({seleleton : true})
    let res = await axios.get(`/api/get-messages?senderId=${senderId}&receiverId=${receiverId}`)
    let messgs = res?.data.Messages.reverse()
    if (res.status === 200){
      set({messages : messgs})
    }
    } catch (error) {
      if (error?.response?.status === 404) {
        set({ messages: [] })
      } else {
        toast.error("Check your network connection")
      }

    }finally {
      
      set({seleleton : false})
    }
  },
  handleGetMessage:async (message,userId,acknowledge) => {
    if (message.senderId !== get().Selected) {
      await addmessage({...message , userId : userId})
      return
    }
    acknowledge()
    set({ messages: [...get().messages, message] })
    
  },
  connectSocket: async () => {

    let userId =get().session?.user?.id
    
    if (userId) {

      let Socket = io({
        withCredentials: true,
        auth: {
          userId: userId
        },
        autoConnect : false
      })
      set({ socket: Socket })
      Socket.on("connect", () => {
        Socket.on("getOnlines", onlineUsers => {
          set({ onlineUsers: onlineUsers })
        })
      })
    }
  },

  handleSendMessage:  async (data, setData) => {
     let {selectedGroup,setGroupMessages,groupMessages} = groupStore.getState()
     let contents = data.content 
     let image = data.image 
     if (!contents && !image) return
     let { content, ...rest } = data
     let uniquId = Date.now().toString()
     let date = new Date()
     if (get().Selected !== null){
    let chatId = get().selectedInfo.id
    
      
     let newdata = { ...rest, content: contents, receiverId: get().Selected, senderId: get().session?.user.id, uniqueId: uniquId, createdAt: date, status: "sent" }
     let {uniqueId ,...others } = newdata
      await addmessage({...others , id : uniqueId,userId : chatId})
     set((state)=>({
      users : state.users.map((user)=>{
        if (user.id === chatId){
          return {...user , lastmessage : newdata}
        }
        return user
      })
     }))
     set(state=>({ messages: [...state.messages, newdata] }))
     
       
       get().socket.emit("receiver-data", newdata,chatId)
       setData({
         receiver: "",
         content: "",
         image : ""
        })
        
        get().socket?.emit('read-message', { receiver: get().Selected, update: true })
      }
      if (selectedGroup !== null){
             
        let groupData = {...rest,content : contents , senderId: get().session?.user.id,groupId : selectedGroup?.id,createdAt: date,status : "pending",uniqueId : uniqueId}
        setGroupMessages([...groupMessages,groupData]) 
        setData({
          receiver: "",
          content: "",
          image: ""
         })
         
        get().socket?.emit("send-groupMessage",groupData)
        
      }
      },
  readed: async(userId) => {
    let chatId = get().selectedInfo.id
    await updateToRead(userId)
    let messages = get().messages
    if (messages.length === 0) return
    set(state=>({
      messages : state.messages.map(msg => {
        if (msg.status !== "read") {
  
          return {
            ...msg, status: "read"
          }
        }
        return msg
      })
    }))
    set((state)=>({
      users : state.users.map((user)=>{
        if (user.id === chatId){
          return {...user , lastmessage : {...user.lastmessage , status : "read"}}
        }
        return user
      })
     }))

  },
  changeAllStatus : (userId)=>{
    let {selectedGroup,groupMessages,setGroupMessages} = groupStore.getState()
    if (get().Selected){

      let messages = get().messages
      if (messages.length === 0) return
      let newMessages = messages.map((msg=>{
        if (msg.status === "sent"){
          return {...msg,status : "delivered"}
        }
        return msg
      }))
      set({messages : newMessages})
    }
    if (selectedGroup){
      if (groupMessages.length === 0)return
      let updatedMessage = groupMessages.map((message)=>{
        
        return {...message,status : message.status.map((st)=> st.userId === userId ? {...st,deliveredAt : new Date()} : st)}
      })
      
      setGroupMessages(updatedMessage)
    }
  } ,
  getAllMessages :async ()=>{
    
    try {
      let messages = await getOneMessage()
      if (messages !== null) {
        
            let res = await axios.get("/api/getLastSeenMessages")
            console.log(res);
            if (res.status === 200 && res.data?.Messages.length > 0){
                await addallmessages(res.data?.Messages)
            }
       return null
      }

        let res = await axios.get("/api/getAllMessages")
        
        if (res.status === 200 && res.data?.Messages.length > 0){
          await addallmessages(res.data?.Messages)
        }
      
    } catch (error) {
      console.log("Error");
      
      console.log(error);
      
    }
  },
  updateInIndexdb :async(id,message)=>{
    let userId = get().selectedInfo.id
    await updatemessage(id,message,userId)
  },

    

}))

export let authstore = createSelectors(authStore)