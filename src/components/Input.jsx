"use client"

import { CircleAlertIcon, Eye, EyeClosed } from 'lucide-react';
import React, { useState } from 'react'
import { memo } from 'react'
const Input = memo(({ label, type, placeholder, id, register, errors }) => {
  const [eye, seteye] = useState(false)
      
  return (
    <div className="flex flex-col relative gap-1   ">

      <div className='flex flex-col'>

        <label htmlFor={id} className="text-sm mb-2.5  relative font-medium text-white/90">
          {label}
        </label>
        <input
          type={
            type === "password" ? eye ? "text" : "password" : type
          }
          id={id}
          name={id}
          {...register(id)}
          placeholder={placeholder}
          className={`px-4 py-3 ${errors[id] ? "border-red-600 ring-red-600" : "focus:ring-purple-300 border-white/30"} rounded-lg border  focus:outline-none focus:ring-2  focus:border-transparent transition-all duration-200 ease-in-out bg-white/10 backdrop-blur-sm text-white placeholder-white/60 hover:bg-white/20 focus:shadow-lg focus:shadow-purple-400/20`}
        />
      </div>
      {
        !errors["password"] &&(

          
          id === "password" &&(
            
            (eye ? <Eye onClick={()=>seteye(!eye)} className='absolute right-2 text-gray-300 cursor-pointer hover:text-gray-200 top-1/2 translate-y-[14%] '/>: 
            <EyeClosed onClick={()=>seteye(!eye)} className='absolute right-2 text-gray-300 cursor-pointer hover:text-gray-200 top-1/2 translate-y-[14%] '/>)
            
          )
        )
           
          }
      {
        errors[id] &&
        <CircleAlertIcon className='text-red-600 absolute size-4.5 right-2 top-1/2 -translate-y-[50%]' />
      }

      {
        errors[id] &&

        <div className='text-gray-500'>
          {errors[id].message}
        </div>
      }
    </div>
  )
})

export default Input