"use client"

import ImageCLip from "@/assets/Paperclip.svg"
import Image from "next/image"
import { memo } from "react"

const FileInput = memo(({onChange,ref})=>{
    
    return (
        <>
        <input ref={ref} onChange={onChange} type="file" name="file" id='file' className='hidden' />
        <label  htmlFor="file" className='hover:bg-[#3A2466] p-2 duration-150  rounded-xl'>
        <Image src={ImageCLip} alt='Image Upload' width={24} height={24} className='filter invert-[0.2]' />
        </label>
        </>
    )
    })
  

export default FileInput