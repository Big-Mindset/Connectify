"use client"

import { CircleAlertIcon, Eye, EyeClosed } from 'lucide-react';
import React, { useState } from 'react'
import { memo } from 'react'
const Input = memo(({ label, type, placeholder, id, register, errors }) => {
  const [eye, seteye] = useState(false)
      
  return (
    <div className="flex flex-col relative gap-1   ">

      <div className='flex flex-col'>

        <label htmlFor={id} className="text-sm mb-2.5  relative font-medium text-black/80 dark:text-white/90">
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
          className={`px-4 py-3 ${errors[id] ? "border-red-600 ring-red-600" : "dark:focus:ring-purple-300 dark:border-white/30"} rounded-lg border
           border-gray-300 focus:border-blue-500   focus:outline-none dark:focus:ring-2
            dark:focus:border-transparent transition-all duration-200 ease-in-out bg-white/10 backdrop-blur-sm dark:text-white text-black placeholder:text-black/40 placeholder:text-[0.97rem] 
             dark:placeholder-white/60 dark:hover:bg-white/20 dark:focus:shadow-lg dark:focus:shadow-purple-400/20`
            }
        />
      </div>
      {
        !errors["password"] &&(

          
          id === "password" &&(
            
            (eye ? <Eye onClick={()=>seteye(!eye)} className='absolute right-2 size-5 dark:text-gray-300 cursor-pointer dark:hover:text-gray-200 top-1/2 translate-y-[14%] '/>: 
            <EyeClosed onClick={()=>seteye(!eye)} className='absolute right-2 size-5 dark:text-gray-300 cursor-pointer dark:hover:text-gray-200 top-1/2 translate-y-[14%] '/>)
            
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