import React from 'react'
import { motion } from "framer-motion"
import toast from 'react-hot-toast'
import { authstore } from '@/zustand/store'
import api from '@/lib/axiosInstance'
const Button = ({ status, userdata, setRequests }) => {
  let setUsers = authstore.use.setUsers()
  let session = authstore.use.session()
  let socket = authstore.use.socket()
  let handleRequest = async (status) => {
    if (status === "Accept") {

      setRequests(prev => {
        return prev.filter((obj) => obj.id !== userdata.id)
      })
      let res = await api.put("/accept-Reject-Request", { friendRequestId: userdata.id, status: "Accepted" })
    
      if (res.status === 200) {
        toast.success("friend request Accepted")


        let handleUsers = (users) => {
          return [...users, {
            id: userdata.id,
            friend: {
              id: userdata.senderId,
              avatar: userdata.data.avatar,
              bio: userdata.data.bio,
              name: userdata.data.name,
             UnReadedMessageCount : 0

            }
          }
          ]
        }
        setUsers(handleUsers)
        
        socket.emit("requestAccepted",{
          id: userdata.id,
          friend: {
            id: session.user.id,
            avatar: session.user.image,
            bio: session.user.bio,
            name: session.user.name,
            UnReadedMessageCount : 0


          }
        },userdata.senderId)
      }
    } else {
      setRequests(prev => {
        return prev.filter((obj) => obj.id !== userdata.id)
      })
      let res = await api.put("/accept-Reject-Request", { friendRequestId: userdata.id, status: "Rejected" })
      if (res.status === 200) {
        toast.success("friend request Rejected")
      }
    }
  }
  return (
    <motion.button
      onClick={() => {
        handleRequest(status)
      }}
      whileTap={{ scale: 1 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className={`border-[1px] flex-1 py-1 px-2 rounded-full ${status == "Accept" ? "border-green-400  hover:text-white hover:border-green-300  text-green-300" : "border-red-400  hover:text-red-100 hover:border-red-300  text-red-300"}   cursor-pointer `}>
      {status}
    </motion.button>
  )
}


export default Button