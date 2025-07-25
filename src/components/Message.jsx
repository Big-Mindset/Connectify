"use client"

import images from "@/image";
import { authStore } from "@/zustand/store";
import Image from "next/image";
import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion"
import { messageStore } from "@/zustand/messageSearchStore";


const Message = memo(({ content, time, senderId, status,image }) => {
  let { session } = authStore()



  let newtime = new Date(time)


  return (
    <motion.div
      initial={{ y: 10 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex text-gray-50   ${senderId === session?.user.id ? 'justify-end' : 'justify-start'}`}>

      <div className={` ${image ? "max-w-[250px]" : "max-w-[550px]" } flex flex-col gap-1.5 overflow-hidden rounded-md font-[300]  px-[5px] py-[4px] ${senderId === session?.user.id ? 'bg-gradient-to-br from-indigo-700 to-indigo-900' : 'bg-gradient-to-br from-indigo-900/30 via-[#0F0A1D] to-[#0F0A1D]'}`}>


          {image &&
          <div className=" rounded-md max-w-[250px] overflow-hidden">
            <Image src={image} alt="Sended-image" height={200} width={200} className="object-contain w-full h-full" />
          </div>
          }
        <div className="flex flex-col   gap-1.5">
          <p className="text-[0.9rem] font-[300] break-all mb-[1.5px] flex-1 min-w-0">{content}</p>
          <div className="flex items-center justify-between  self-end  gap-[3px]  flex-shrink-0">
            <p className="text-[0.6rem] text-gray-300/80  font-[200] ">{newtime.toLocaleTimeString([], {
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