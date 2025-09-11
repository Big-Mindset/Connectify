"use client"

import { Check, Edit2, X } from 'lucide-react'
import React, { useRef, useState } from 'react'

const Input = ({id , setProfile,value }) => {
    
    const handleProfileChange = (value) => {
        setProfile(prev => ({ ...prev, [id]: value }));
    };

  return (
    <div className='flex items-center '>

    <input
    value={value}
    onChange={(e)=>handleProfileChange(e.target.value)}
    id="" className={`flex-1 outline-none font-sans dark:text-white text-black  focus:border-b-[1px] border-blue-600   duration-300 transition-all  `} />
    <div className='flex gap-2'>
        



   
    <button  className='flex gap-1 items-center'>
    <Edit2 className='dark:text-white text-black   size-4' /> 
</button>
    
    </div>
    </div>
  )
}

export default Input