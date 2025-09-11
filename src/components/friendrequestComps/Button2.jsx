import { motion } from 'framer-motion'
import React from 'react'

const Button2 = ({status,Selected,setSelected}) => {
  return (
    <motion.div
    onClick={()=>{
        setSelected(status)
    }}
    className={` ${status === "Received" ? 
        Selected === status ? "bg-violet-600 text-violet-100 border-violet-900" : "border-violet-500 text-violet-100  hover:text-violet-300 hover:bg-violet-800/20"  
        : Selected === status ? "bg-blue-600 border-blue-900 text-blue-100" : "border-blue-500 text-blue-100 hover:text-blue-300  hover:bg-blue-800/20" }  cursor-pointer border-[0.5px] py-1.5 px-3  rounded-full `}
    // initial={{}}
    >
        {status === "Received" ? "Receieved requests" : "Sent requests"}

    </motion.div>
  )
}

export default Button2