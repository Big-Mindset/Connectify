import axios from "axios"
import toast from "react-hot-toast"
import {create} from "zustand"
import { authStore } from "./store"
import { createSelectors } from "@/lib/Selector"


export let groupStore = create((set,get)=>({
    setselectedGroup : (selectedGroup)=>set({selectedGroup}),
    selectedGroup : null,
    groups : [],
    setgroups : (groups)=>set({groups}),
    groupMessages : [],
    setGroupMessages : (groupMessages)=>set({groupMessages}),


    handleGetMessages :  (messages,uniqueId)=>{
        console.log("the group func");
        console.log(messages);
        console.log(uniqueId);
        let {groups , setgroups,} = get()
        let selectedGroup = get().selectedGroup
        let {socket,session} = authStore.getState()
        let sender = session?.user.id
        if (messages.senderId !==sender){
            
            let status = messages?.status
        let updatedStatus = status.find((st)=>
            st.userId === session?.user.id
        )
        
        if (selectedGroup && selectedGroup?.id === messages.groupId){
            
            
            socket?.emit("read-groupMessage",{...updatedStatus,readAt : new Date(),deliveredAt : new Date()},messages.groupId)
        }else{
            
            
            socket?.emit("delivered-groupMessage",{...updatedStatus,deliveredAt : new Date()},messages.groupId)
        }
    }

    
    if (!selectedGroup || selectedGroup?.id !== messages?.groupId) return

        

        if (messages.senderId ===sender && uniqueId ){
            let updatedMessage = get().groupMessages.map((message)=>{
                    if (message.uniqueId && message.uniqueId === uniqueId){
                        return messages
                    }
                    return message
                })
                set({groupMessages : updatedMessage})
     
      setgroups(groups.map((group)=>{
        if (group.id === selectedGroup.id){
          return {...group,groupsMessages : [messages]}
        }
        return group
      }))
        }else{
            
            set({groupMessages : [...get().groupMessages,messages]})
        } 
        // socket.emit("message-read",{...updatedStatus,readAt : new Date()},messages.groupId)
        
    },
    getGroupMessages : async (groupId)=>{
        let setSkeleton = authStore.getState().setSkeleton
        setSkeleton(true)
        try{
            let res = await axios.get(`api/groupMessages?groupId=${groupId}`)
            if (res.status === 200){
                set({groupMessages :res.data.messages })
                
            }
        }catch(err){
            if (err?.response?.status){
                
                toast.error(err.response.data.message)
            }else{
                console.log(err.message);
                
            }
        }finally{
        setSkeleton(false)

        }
    },

    handleGroupDelivered : async (messageObj)=>{
       if (!get().selectedGroup) return

        let getMessage = get().groupMessages.find((msg)=>msg.id === messageObj.groupMessage);
        
        let updatedStatus = getMessage?.status.map((st)=>{
            if (st.id === messageObj.id){
                return {...messageObj,status : "delivered"}
            }
            return st
        })
        let updatedMessage = {...getMessage,status : updatedStatus}
        let result = get().groupMessages.map((message)=>{
            return message.id === updatedMessage.id ? updatedMessage : message
        });
        set({groupMessages :result })
    },
    handleReaded : (userId)=>{
        if (!get().selectedGroup) return
      
      
            let updatedArray = get().groupMessages.map((msg)=>{
              return {...msg,status : msg.status.map((st)=>{
                if (st.userId === userId){
                  return {...st,readAt : new Date()}
                }
                return st
              })}
            })
            set({groupMessages : updatedArray})
          
    },
     getGroup : async ()=>{
        try {
          let res = await axios.get("api/get-groups")
          set({groups  : res?.data?.groups})
        } catch (error) {
          if (error?.response?.status){
            toast.error(error.response.data.message)
          }else{
            console.log(error.message);
            
          }
      }
    },
}))

export const groupstore = createSelectors(groupStore);
