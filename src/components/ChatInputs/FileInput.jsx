"use client"
import { Paperclip } from "lucide-react"
import { memo } from "react"

const FileInput = memo(({onChange,ref,classes,iconClasses})=>{
    
    return (
        <>
        <input 
          ref={ref} 
          onChange={onChange} 
          type="file" 
          name="file" 
          id='file' 
          className='hidden'
          accept="image/*,video/*,.pdf,.doc,.docx"
        />
        <label  
          htmlFor="file" 
          className={`group  ${classes}  p-2.5  duration-100 rounded-full  transition-all cursor-pointer`}
        >
          <Paperclip 
            size={18} 
            className={`dark:text-slate-300 ${iconClasses} dark:group-hover:text-indigo-400 transition-colors duration-200`}
          />
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Attach file
          </div>
        </label>
      </>
    )
    })
  

export default FileInput