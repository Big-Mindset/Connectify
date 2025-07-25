"use client"

import images from "@/image";
import { authStore } from "@/zustand/store";
import Image from "next/image";
import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion"
import { messageStore } from "@/zustand/messageSearchStore";


const Message = memo(({ content, time, senderId, status,groupId }) => {
  let { session } = authStore()



  let newtime = new Date(time)


  return (
    <motion.div
      initial={{ y: 10 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex text-gray-50   ${senderId === session?.user.id ? 'justify-end' : 'justify-start'}`}>

      <div className={`max-w-[550px] rounded-md font-[300]  px-[5px] py-[4px] ${senderId === session?.user.id ? 'bg-indigo-600/90 ' : 'bg-gradient-to-r from-black/50 to-black/20 '}`}>


        <div className="flex  gap-1.5">
          <p className="text-[0.9rem] font-[300] break-all mb-[1.5px] flex-1 min-w-0">{content}</p>
          <div className="flex items-center justify-between  self-end  gap-[3px]  flex-shrink-0">
            <p className="text-[0.6rem]  font-[200] text-gray-50">{newtime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true
            })} </p>
            {
              senderId === session?.user.id && (
                status === "delivered" ?
                  (<Image loading="lazy" className="size-3 invert-75 mb-1" src={images.ColoredTick} alt="delivered" />)
                  : status === "read" ?

                    (
             
  
                      
                        <Image loading="lazy" className="size-3  mb-1" src={images.twoTicks2} alt="read" />
         

                    ) :

                    (<Image loading="lazy" className="size-2.5 invert-75 mb-1" src={images.singleTick} alt="send" />)
              )
            }

          </div>

        </div>

      </div>

    </motion.div>

  )
})


export default Message 