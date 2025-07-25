"use client"

import { Send } from "lucide-react"
import { memo } from "react"

const RegularInput = memo(({value,onchange,placeholder,handleSendMessage})=>{
    
    return(
                <div className='flex-1 flex items-center overflow-hidden bg-[#3A2466] rounded-lg focus-within:ring-2 ring-indigo-500/50 duration-300'>
                  <input
                    type="text"
                    value={value}
                    onChange={onchange}
                    placeholder={placeholder}
                    className='flex-1 outline-none p-3 text-indigo-50 placeholder:text-indigo-400/80 bg-transparent'
                    />
                  <button onClick={handleSendMessage} className='p-3 mr-0.5 hover:bg-indigo-600  rounded-r-md bg-indigo-500 text-white transition-colors duration-200'>
                    <Send size={20} />
                  </button>
                </div>
    )

})

export default RegularInput