"use client"

import { Send } from "lucide-react"
import { memo } from "react"

const RegularInput = memo(({value,onchange,placeholder,handleSendMessage,hasContent})=>{
  
    return(
                <div
                
                className='flex-1 flex  items-center overflow-hidden relative'>
      <input
        type="text"
        value={value}
        onChange={onchange}
        placeholder={placeholder}
        className='w-[calc(100%-40px)] emoji outline-none px-4 py-3 text-black/90 dark:text-white/90 placeholder:text-slate-400 bg-transparent text-sm resize-none   transition-all duration-200 backdrop-blur-sm'
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
          }
        }}
        
      />
      <button 
        onClick={handleSendMessage} 
        disabled={hasContent}
        className={`absolute right-2 p-2.5 rounded-full  transition-all duration-200 ${
          !hasContent 
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-100' 
            : 'bg-slate-700/50 text-slate-400 scale-95 cursor-not-allowed'
        }`}
      >
        <Send size={16} className={!hasContent ? '' : 'opacity-50'} />
      </button>
    </div>
    )

})

export default RegularInput