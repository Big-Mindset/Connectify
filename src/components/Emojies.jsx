"use client"
import React, { useEffect, useRef, useState } from 'react'
import {  motion } from 'framer-motion'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip"
import { X } from 'lucide-react'
import { Emjies } from '@/zustand/Emojies'

const Emojies = React.memo(({ setOpenEmoji,handleSetEmoji}) => {

  const [SelectedCategory, setSelectedCategory] = useState("")
  const containerRef = useRef(null)
  const scrollTimeout = useRef(null)
  let emojipicker = useRef(null)
  const {Emojies} = Emjies()


  
  


  const handleScroll = () => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
    }

    scrollTimeout.current = setTimeout(() => {
      if (!containerRef.current) return

      const container = containerRef.current
      const scrollPosition = container.scrollTop + 60 

      const sections = Array.from(container.querySelectorAll('[data-id]'))

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section.offsetTop <= scrollPosition) {
          setSelectedCategory(section.dataset.id)
          break
        }
      }
    }, 50)
  }
  const scrollToCategory = (id) => {
    const element = containerRef.current?.querySelector(`[data-id="${id}"]`)
    if (!element) return

    const headerHeight = 60
    const scrollPosition = element.offsetTop - headerHeight

    containerRef.current.scrollTo({
      top: scrollPosition,
      behavior: "smooth"
    })
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])


  return (
    
    <motion.div
      ref={emojipicker}
      initial={{  transformOrigin: "bottom left" }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{duration : 0.3}}
      className='absolute left-10 will-change-transform border-l-2 border-l-indigo-300 bottom-23 rounded-md bg-[#1A1433]'>
      <div className="w-[600px] p-2 z-50">
        <button onClick={() => { setOpenEmoji(false) }} className='absolute right-1  hover:bg-blue-900  p-1 rounded-full text-blue-400'>
          <X />
        </button>

        <div className='flex h-20 gap-1 overflow-x-auto p-1.5 text-indigo-500'>
          <TooltipProvider >
          {Emojies?.map(cat => (
              <Tooltip key={cat.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => scrollToCategory(cat.id)}
                    className={`relative p-1 cursor-pointer before:absolute before:left-1 before:bottom-0 before:h-1 before:rounded-full before:transition-all before:duration-200
                      ${SelectedCategory === cat.id
                        ? "before:bg-blue-600 before:right-1"
                        : "hover:before:bg-indigo-600 hover:before:right-1"}
                    `}
                  >
                    <span className='text-3xl'>
                      {cat.Emoji[0]?.emoji || "❓"}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-indigo-300">
                  {cat.id}
                </TooltipContent>
              </Tooltip>
          ))}
          </TooltipProvider>
        </div>


        <div
          ref={containerRef}
          className="h-[600px] overflow-y-auto scroll overflow-x-hidden p-2 mt-2 bg-[#261C44] rounded-md"
        >
          {Emojies?.map(cat => (
            <div key={cat.id} data-id={cat.id} className="mb-4">
              <div className="text-indigo-400 text-sm font-semibold mb-1 px-1 capitalize">
                {cat.id.replace(/_/g, ' ')}
              </div>
              <div className='grid grid-cols-12 gap-1'>
                {cat.Emoji.map((emojiObj, index) => (
                  <button
                  onClick={()=>handleSetEmoji(emojiObj.emoji)}
                    key={index}
                    className="text-[22px] hover:scale-125 transition-transform"
                  >
                    {emojiObj.emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
     
    </motion.div>
  )
}
)

export default Emojies