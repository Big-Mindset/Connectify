"use client"
import twoTicks2 from "@/assets/ticksTwo2.svg"
import pending from "@/assets/pending.svg"
import ColoredTick from "@/assets/coloredTick.svg"
import singleTick from "@/assets/singleTick.svg"
import { authstore } from "@/zustand/store";
import Image from "next/image";
import { memo, useMemo } from "react";
import { motion } from "framer-motion"


function useAllDelivered(status) {
  
  return useMemo(() => status === "pending" ? status : status.every(s => s.deliveredAt != null), [status]);
}
function useAllReadAt(status) {
  
  return useMemo(() => status === "pending" ? status : status.every(s => s.readAt != null), [status]);
}
const GroupMessage = memo(({ messageData }) => {
  let  session  = authstore.use.session()
  
  let newtime = new Date(messageData.createdAt)
  let delivered = useAllDelivered(messageData.status)
  let readed = useAllReadAt(messageData.status)

  return (
    <motion.div
      initial={{ opacity: 0.8 }}
      animate={{  opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex text-gray-50   ${messageData.senderId === session?.user.id ? 'justify-end' : 'justify-start'}`}>

      <div className={`inline-block max-w-[80%]  sm:max-w-[70%] md:max-w-[65%] rounded-lg px-2.5 py-1.5 shadow-sm ${messageData.senderId === session?.user.id ? 'bg-indigo-600/85 rounded-br-sm ' : 'bg-slate-800/60 rounded-bl-sm'}`}>


        <div className="flex  gap-1.5">
          <p className="text-[0.9rem] font-[300] break-all mb-[1.5px] flex-1 min-w-0">{messageData.content}</p>
          <div className="flex items-center justify-between  self-end  gap-[3px]  flex-shrink-0">
            <p className="text-[0.6rem]  font-[200] text-gray-50">{newtime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true
            })} </p>
            {
              messageData?.senderId === session?.user?.id && (
                delivered === "pending" ?
                  (<Image loading="lazy"  className="size-3 invert-75 mb-1" src={pending} alt="pending" />) :
                  readed ? 
                    (<Image loading="lazy" className="size-3  mb-1" src={twoTicks2} alt="read" />)
                  : delivered && delivered !== "pending" ?
                  (<Image loading="lazy" className="size-3 invert-75 mb-1" src={ColoredTick} alt="delivered" />) :
                     

                    (<Image loading="lazy" className="size-2.5 invert-75 mb-1" src={singleTick} alt="send" />)
              )
            }

          </div>

        </div>

      </div>

    </motion.div>

  )
})


export default GroupMessage 