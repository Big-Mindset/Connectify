"use client"
import React from 'react'
import EmojiPicker from 'emoji-picker-react';
import { useTheme } from 'next-themes';

const Emojies = React.memo(({ setMessageData}) => {
  let {theme} = useTheme()
  let handleEmojiClick =  (evt)=>{

    
    setMessageData(prev=>({...prev , content : prev.content +=evt.emoji}))
  }
  return (
    
    <div
     
      className='absolute left-10 will-change-transform border-l-2 border-l-indigo-300 bg-gray-900 border-[1px] border-blue-500/50 bottom-23 rounded-md '>
      <EmojiPicker onEmojiClick={handleEmojiClick} width={500} height={500} emojiStyle="apple" theme={theme}   />
     
    </div>
  )
}
)

export default Emojies