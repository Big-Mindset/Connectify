"use client"
import axios from "axios"
import toast from "react-hot-toast"
import { io } from "socket.io-client"
import { create } from "zustand"
import { groupStore } from "./groupStore"

export let authStore = create((set, get) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
  session: null,
  socket: null,
  setsession: (session) => set({ session }),
  users: [],
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
         let result = res?.data.users.map((user) => {
            let userId = get().session?.user.id
            let isMe = user.sender.id === userId
            let friend = isMe ? user.receiver : user.sender
            return {
              name: friend.name,
              bio: friend.bio,
              id: friend.id,
              avatar: friend.avatar,
              friendId: user.id
            }
          })
          set({users : result})
        
      }

    } catch (error) {
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
  handleUpdate: (messageId) => {
   if (!get().Selected) return
   let messages = get().messages
   let newArray = messages.map((val)=>{
    if (val.uniqueId === messageId){
      return {...val,status : "delivered"}
    }
    return val
   })
   set({messages : newArray})
   
   
  },
  getMessages: async (messageId) => {
  
    set({seleleton : true})
    try {
      let senderId = get().session?.user.id
      let res = await axios.get(`/api/get-messages?senderId=${senderId}&receiverId=${get().Selected}`)
      set({ messages: res?.data?.Messages })
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
  handleGetMessage: (message,acknowledge) => {
    acknowledge()
    if (message.senderId !== get().Selected) return
    
    
    set({ messages: [...get().messages, message] })
    
  },
  connectSocket: async () => {
     
    let userId =get().session?.user?.id
    
    if (userId) {

      let Socket = io({
        withCredentials: true,
        auth: {
          userId: userId
        }
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
     let uniqueId = Date.now().toString()
     let date = new Date()
     if (get().Selected !== null){
     let newdata = { ...rest, content: contents, receiverId: get().Selected, senderId: get().session?.user.id, uniqueId: uniqueId, createdAt: date, status: "sent" }
     
       set({ messages: [...get().messages, newdata] })
       
       get().socket.emit("receiver-data", newdata)
       setData({
         receiver: "",
         content: "",
         captionContent: ""
        })
        
        get().socket?.emit('read-message', { receiver: get().Selected, update: true })
      }
      if (selectedGroup !== null){
        console.log("In if");
        
        let groupData = {...rest,content : contents , senderId: get().session?.user.id,groupId : selectedGroup?.id,createdAt: date,status : "pending",uniqueId : uniqueId}
        setGroupMessages([...groupMessages,groupData]) 
        get().socket?.emit("send-groupMessage",groupData)
        
      }
      },
  readed: () => {

    let messages = get().messages
    if (messages.length === 0) return
    let updated = messages.map(msg => {
      if (msg.status !== "read") {

        return {
          ...msg, status: "read"
        }
      }
      return msg
    })
    set({ messages: updated })

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
  } 
    

}))

