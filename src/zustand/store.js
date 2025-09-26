"use client"
import toast from "react-hot-toast"
import { create } from "zustand"
import { groupStore } from "./groupStore"
import { createSelectors } from "@/lib/Selector"
import { addallmessages, addmessage, deletelastmessage, deletemessage, deletereaction, getmessagebyid, getOneMessage, updateallreactions,  updatemessage, updatereaction, updateToRead } from "@/database/indexdb"
import { dropDown } from "./dropdown"
import {motion} from "framer-motion"
import api from "@/lib/axiosInstance"
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
  setSelectedInfo: (dataFunc) => set((state)=>({
    selectedInfo : dataFunc(state.selectedInfo)
  })),
  setSocket: (socket) => set({ socket }),
  skeleton: false,
  setSkeleton: (skeleton) => set({ skeleton }),
  messages: [],
  setMessages: (messagesParam) => set({ messages: messagesParam }),

  addReactionToMessage: (id, reaction) => {
    set((state) => ({
      messages: state.messages.map((msg) => {
        if (msg.id === id) {
          return { ...msg, Reactors: [...msg.Reactors, reaction] }
        }
        return msg
      })
    }))
  },
  deleteReaction: (reactId, id) => {

    
    set((state) => ({
      messages: state.messages.map((msg) => {
        if(msg.id === id ){
          
          let filtered = msg.Reactors.filter((reactor)=>reactor.id !== reactId)
          return {...msg , Reactors : filtered}
        }
        return msg
      })
    }))
  },
  updateReaction : (id,reactId,url)=>{

    set((state) => ({
      messages: state.messages.map((msg) => {
        if(msg.id === id){
          
          let updatedData = msg.Reactors.map((reactor)=>{
            
            if (reactor.id === reactId){
              
              return {...reactor , emoji : url}
            }
            return reactor
          })
          return {...msg , Reactors : updatedData}
        }
        return msg 

      })
    }))
  },
  updateWithDbId : (messageId , reactId,uniqueId)=>{
    
    set((state)=>({
      messages : state.messages.map((msg)=>{
        if (msg.id === messageId ){
          
          let updatedReactors = msg.Reactors.map((obj)=>{
            
            if (obj?.uniqueId === uniqueId){
              return {...obj,id : reactId,uniqueId : undefined}
            }
            return obj
          })
          
          return {...msg,Reactors :updatedReactors }
        }
        return msg
      })
    }))
  }
,
  getChatData : async ()=>{
    set({loading : true})
    
    let setgroups = groupStore.getState().setgroups
    try {
    let [res1 , res2] = await Promise.all([

      api.get("/all-users"),
       api.get("/get-groups")
    ])
     
      if (res1.status === 200) {
        let users = res1?.data.users
        
        let sortedUsers = users.sort((a, b) => (new Date(b.lastmessage?.createdAt ?? 0).getTime()) - (new Date(a.lastmessage?.createdAt ?? 0).getTime()))

        set({ users: sortedUsers })
      }
      setgroups(res2?.data?.groups)
      get().getAllMessages()
    } catch (error) {
      if (error?.response?.status === 404) {
        toast.error(error?.response?.data.message)
      } else if (error?.response?.status === 404) {
        error?.response?.data.message
      }

      else {
        toast.error(error?.response?.data.message)

      }
    } finally{
      set({loading : false})
    }

  },
  handleUpdate: async (uniqueId, message) => {
    await addmessage(message)
    if (!get().Selected) return
    set(state => ({
      messages: state.messages.map((val) => {
        if ((!val?.uniqueId && val.id === message.id) ||( val?.uniqueId ===uniqueId) ) {
          return { ...val, status: "delivered" }
        }
        return val
      })

    }))
    let chatId = get().selectedInfo.id
    set((state) => ({
      users: state.users.map((user) => {
        if (user?.id === chatId) {
          return { ...user, lastmessage: { ...user.lastmessage, status: "delivered" } }
        }
        return user
      })
    }))

  },
  getMessages: async (userId) => {
    set({messages : []})
    set({ skeleton: true })
    
    let messages = await getmessagebyid(userId)
    
    if (messages?.length > 0) {
      
      let sorted = messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      set({ messages: sorted })
    }
    
    get().setUsers((users)=>{
      return users.map((user)=>{
        if (user.id === userId){
          return {...user,friend : {...user.friend,UnReadedMessageCount : 0}} 
        } 
        return user
      })
    })
    
    set({ skeleton: false })

  },
  handleGetMessage: async (message, userId,unqiueId) => {
      let chatId = get().selectedInfo?.id

    if (!get().selectedInfo || userId !== chatId) {
   
      set((state) => ({
        users: state.users.map((user) => {
          if (user.id === userId) {
            return { ...user, lastmessage: message,friend : {...user.friend,UnReadedMessageCount : user.friend.UnReadedMessageCount+ 1} }
          }
          return user
        })
      }))
      
      get().socket.emit("message-delivered", message,unqiueId,userId)
      await addmessage({ ...message, userId: userId })
      return
    }
    set((state)=>({ messages: [...state.messages, message] }))
    get().socket.emit("readed-message",{...message, userId ,status : "read"} )
    set((state) => ({
      users: state.users.map((user) => {
        if (user.id === userId) {
          return { ...user, lastmessage: message }
        }
        return user
      })
    }))
    await addmessage({ ...message, userId: userId })

  },
  handleMessageRead : async (message)=>{
    let chatId = get().selectedInfo.id
    if (message.userId ===chatId ){
      set((state)=>({
        messages : state.messages.map((msg)=>{
          if (msg.id === message.id){
            return message
          }
          return msg
        })
      }))
      
    }
     set((state) => ({
      users: state.users.map((user) => {
        if (user.id === message.userId) {
          return { ...user, lastmessage: message }
        }
        return user
      })
    }))
    await addmessage(message)
  }
  ,
  connectSocket: async () => {
    let {io} = await import("socket.io-client")
    let userId = get().session?.user?.id
    
    if (get().socket?.connected) return

    if (userId && !get().socket) {

      let Socket = io(process.env.NEXTAUTH_URL,{
        withCredentials: true,
        auth: {
          userId: userId
        },
        autoConnect: false
      })
      set({ socket: Socket })
      Socket.connect()
        
      Socket.on("connect", () => {
        Socket.on("getOnlines", onlineUsers => {
          set({ onlineUsers: onlineUsers })
        })
      })
    }
  },

  handleSendMessage: async (data, setData) => {
    let { selectedGroup, setGroupMessages, groupMessages } = groupStore.getState()
    let contents = data.content
    let image = data.image
    if (!contents && !image) return
    let { content, ...rest } = data
    let uniquId = Date.now().toString()
    let date = new Date()
    if (get().Selected !== null) {
      let chatId = get().selectedInfo.id
      let reply = dropDown.getState().reply
      let setReply = dropDown.getState().setReply
      
      let newdata = { ...rest, content: contents, receiverId: get().Selected, senderId: get().session?.user.id, uniqueId: uniquId, createdAt: date, status: "sent",Reactors : [] }
      if (reply){
        newdata = {...newdata,replyToId : reply.id}
        setReply(null)
      }
      let { uniqueId, ...others } = newdata
      set(state => ({ messages: [...state.messages, newdata] }))
      await addmessage({ ...others, id: uniqueId, userId: chatId }) 
     
      
      await deletelastmessage(chatId)
      
      get().socket.emit("receiver-data", newdata, chatId)
      setData({
        receiver: "",
        content: "",
        image: ""
      })

    }
    if (selectedGroup !== null) {

      let groupData = { ...rest, content: contents, senderId: get().session?.user.id, groupId: selectedGroup?.id, createdAt: date, status: "pending", uniqueId: uniquId }
      setGroupMessages([...groupMessages, groupData])
      setData({
        receiver: "",
        content: "",
        image: ""
      })

      get().socket?.emit("send-groupMessage", groupData)
    
      

    }
  },
  readed: async (userId) => {
    console.log("updating messages in client ot read");
    
    let chatId = get().selectedInfo?.id
    await updateToRead(userId,"read")
    if (chatId !== userId) return 
    let messages = get().messages
    if (messages.length === 0) return
    set(state => ({
      messages: state.messages.map(msg => {
        if (msg.status !== "read") {

          return {
            ...msg, status: "read"
          }
        }
        return msg
      })
    }))
    set((state) => ({
      users: state.users.map((user) => {
        if (user.id === chatId) {
          return { ...user, lastmessage: { ...user.lastmessage, status: "read" } }
        }
        return user
      })
    }))

  },
  changeAllStatus: async(userId,chatId) => {
    let { selectedGroup, groupMessages, setGroupMessages } = groupStore.getState()
    await updateToRead(chatId , "delivered")
    get().setUsers((users)=>{
      return users.map((user)=>{
        if (user.id === chatId && user?.lastmessage?.status === "sent"){
          return {...user,lastmessage : {...user.lastmessage,status : "delivered"}}
        }
        return user
      })
    })
    if (get().Selected) {
      
      let messages = get().messages
      if (messages.length === 0) return
      let newMessages = messages.map((msg => {
        if (msg.status === "sent") {
          return { ...msg, status: "delivered" }
        }
        return msg
      }))
      set({ messages: newMessages })
    }
    if (selectedGroup) {
      if (groupMessages.length === 0) return
      
      let updatedMessage = groupMessages.map((message) => {

        return { ...message, status: message.status.map((st) => st.userId === userId ? { ...st, deliveredAt: new Date() } : st) }
      })

      setGroupMessages(updatedMessage)
    }
  },
  getAllMessages: async () => {
   
      let messages = await getOneMessage()
      
      if (messages) {
        let res = await api.get("/getLastSeenMessages")
        console.log(res);
        
        if (res.status === 200){
          if (res.data?.Messages?.length > 0) {
            await addallmessages(res.data?.Messages)
          }
          
          if (res.data?.Reactions?.length > 0){
            await updateallreactions(res.data?.Reactions)
          }
        }
          return null
      }

      let res = await api.get("/getAllMessages")
      
      if (res.status === 200 && res.data?.Messages?.length > 0) {
        await addallmessages(res.data?.Messages)
    
        
      }
   
  },
  updateInIndexdb: async (id, message) => {
    
    let userId = get().selectedInfo.id
    set((state)=>({
      messages : state.messages.map((msg)=>{
        if (msg?.uniqueId === id){
            
        return {...message,userId : userId,uniqueId : id}
        }
        return msg
      })
    }))
    set((state) => {
      let update = state.users.map((user) => {
        if (user.id === userId) {
          return { ...user, lastmessage: message }
        }
        return user
      })
      
      let sortedUsers = update.sort((a, b) => {
      
      
      return  (new Date(b.lastmessage?.createdAt ?? 0).getTime()) - (new Date(a.lastmessage?.createdAt ?? 0).getTime())
      })

      return { users: sortedUsers }
    })
    await updatemessage(id, message, userId)
  },

  updateReaction2 :  (data)=>{
    
    let {messageId,...rest} = data
    get().addReactionToMessage(messageId,rest)
    let message = get().messages.find((msg)=>msg.id === messageId)
    
    addmessage(message)
  },
  d_reaction : async (data)=>{
    
    get().deleteReaction(data.reactionId , data.id)
    await deletereaction({reactionId : data.reactionId , id : data.id})
  },
  u_reaction : async (data)=>{
    
    get().updateReaction(data.id , data.reactionId,data.url)
    await updatereaction({reactionId : data.reactionId , id : data.id,url : data.url})
  },
  delete_message : async(id)=>{
    
    set((state)=>({
      messages : state.messages.map((msg)=>{
        if (msg.id === id){
          return {...msg , DeleteForEveryone : true , content : ""}
        }
        return msg
      })
    }))

    await deletemessage(id,true)
  },
  playSound :async ()=>{
    const audio = new Audio("/notification_simple-02.mp3") 
     audio.play()
  }
  ,
  handleRequestNotification : (userdata)=>{
    get().playSound()
  
    
    toast.custom(
      (t) => (
        <motion.div 
        initial={{y : -60 , opacity : 0}}
        animate={{y : 0 , opacity : 1}}
        transition={{duration : 0.4}}
          className={` max-w-md w-full bg-blue-950 shadow-lg rounded-lg pointer-events-auto flex ring-1  ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-100">
                  Friend Request Received
                </p>
                <p className="mt-1 text-sm text-gray-100">
                  <span className="font-medium text-green-500">"{userdata.name}"</span> would like to be your friend
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-300 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </motion.div>
      ),
      {
        duration: 5000,
      }
    );
    
  },
  handleAccpeted : (data)=>{
    get().playSound()
    toast.custom(
      (t)=>(
        <motion.div 
        initial={{y : -60 , opacity : 0}}
        animate={{y : 0 , opacity : 1}}
        transition={{duration : 0.4}}
          className={` max-w-md w-full bg-blue-950 shadow-lg rounded-lg pointer-events-auto flex ring-1  ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-100">
                  Friend Request Accepted
                </p>
                <p className="mt-1 text-sm text-gray-100">
                  <span className="font-medium text-green-500">"{data.friend.name}"</span> accepted your friend request
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-300 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </motion.div>
      )
    )
      let setUsers = get().setUsers
      let handleUsers = (users) => {
        return [...users, data]
      }
      setUsers(handleUsers)
  }


}))

export let authstore = createSelectors(authStore)