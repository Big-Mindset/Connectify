import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { ImageIcon, Smile, X } from 'lucide-react'

import images from '@/image'
import FileInput from '../ChatInputs/FileInput'
import RegularInput from '../ChatInputs/RegularInput'
import ChatNav from './ChatNav'
import Message from '../Message'
import GroupMessage from './GroupMessage'
import Emojies from '../Emojies'
import NoMessages from './NoMessages'

import { authStore } from '@/zustand/store'
import { groupStore } from '@/zustand/groupStore'
import axios from 'axios'

const ChatMain = () => {
  const fileInputRef = useRef(null)
  const bottomRef = useRef(null)

  const {
    messages,
    Selected,
    getMessages,
    setMessages,
    socket,
    handleSendMessage,
    session,
    handleUpdate,
    seleleton
  } = authStore()

  const {
    groupMessages,
    selectedGroup,
    getGroupMessages,
    handleReaded,
    handleReadSuccess
  } = groupStore()

  const [messageData, setMessageData] = useState({
    receiverId: '',
    content: '',
    image: '',
    file: ''
  })

  const [emojiList, setEmojiList] = useState([])
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  useEffect(() => {
    if (Selected) getMessages()
    if (selectedGroup) getGroupMessages(selectedGroup.id)
  }, [Selected, selectedGroup?.id])

  useEffect(() => {
    const receiverId = session?.user?.id
    if (Selected && receiverId) {
      socket.emit('message-readed', {
        receiverId,
        senderId: Selected
      })
    }
  }, [socket, messages, Selected])

  useEffect(() => {
    socket.on('delivered-success', handleUpdate)
    socket.on('changeToRead', handleReaded)
    socket.on('groupRead-success', handleReadSuccess)

    return () => {
      socket.off('groupRead-success', handleReadSuccess)
      socket.off('changeToRead', handleReaded)
      socket.off('delivered-success', handleUpdate)
    }
  }, [])
 let chatContainerRef = useRef()
  useEffect(() => {
    let container = chatContainerRef.current
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })

  }, [messages])
  useEffect(() => {
     
    let userId = session?.user.id
    socket?.emit("Groupmessage-readed",{userId,groupId : selectedGroup?.id})
 
  }, [selectedGroup,groupMessages])

let handleFetchMore = async ()=>{
  const oldestId = msgsRef.current[0].id
  const res = await axios.get(
          `/api/get-messages?senderId=${session?.user.id}&receiverId=${Selected}&lastMessage=${oldestId}`
        )

        if (res.status === 200 && res.data.Messages.length) {
          setMessages(prev => [
            ...res.data.Messages.reverse(),
            ...prev,
          ])
}
}

  const handleSetEmoji = useCallback((emoji) => {
    setMessageData(prev => ({ ...prev, content: prev.content + emoji }))
  }, [])

  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen(prev => !prev)
  }
  
  const getEmojiByName = (name, data) => {
    return data.emojis[name]?.skins[0]?.native || '❓'
  }

  const fetchEmojis = async () => {
    try {
      const res = await fetch('emojies/all.json')
      const data = await res.json()
      
      const categories = data?.categories?.map(category => {
        const id = category.id
        if (id === 'flags') return { id, Emoji: [] }
        const Emoji = category.emojis.map(name => ({
          name,
          emoji: getEmojiByName(name, data)
        }))
        return { id, Emoji }
      })
      
      const filtered = categories.filter(cat => cat.Emoji.length !== 0)
      setEmojiList(filtered)
      if (filtered.length > 0) setSelectedCategory(filtered[0].id)
      } catch (err) {
    console.error('Failed to load emojis:', err)
  }
  }
  useEffect(() => {
    fetchEmojis()
  }, [])
  
  const handleFileInput = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      const base64 = e.target.result
      setMessageData(prev => ({ ...prev, image: base64 }))
    }
    reader.readAsDataURL(file)
  }

  console.log(groupMessages);
  

  return (
    <div className='flex-1 bg-gradient-to-br from-indigo-900/30 via-[#0F0A1D] to-purple-900/30 flex flex-col backdrop-blur-lg'>
      <ChatNav />
      <main ref={chatContainerRef} className='flex-1 overflow-y-auto p-4 scroll relative'>
        <div className='flex flex-col gap-2 max-w-4xl mx-auto'>
          {seleleton ? (
            [...Array(8)].map((_, i) => {
              const isSent = i % 3 === 0
              const lineCount = Math.floor(Math.random() * 4) + 1

              return (
                <motion.div
                  key={i}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className={`flex ${isSent ? 'justify-end' : 'justify-start'} items-end gap-2`}
                >
                  <div
                    className={`${isSent ? 'bg-indigo-600/20' : 'bg-gray-700/20'} rounded-xl p-3 animate-pulse ${['w-[40%]', 'w-[55%]', 'w-[65%]', 'w-[75%]', 'w-[85%]'][i % 5]} min-w-[120px] relative`}
                  >
                    <div className='space-y-2 mb-4'>
                      {Array.from({ length: lineCount }).map((_, index) => (
                        <div
                          key={index}
                          className={`h-4 bg-gradient-to-r ${isSent ? 'from-indigo-500/20 to-indigo-600/20' : 'from-gray-600/20 to-gray-700/20'} rounded-full ${index === lineCount - 1 ? ['w-3/4', 'w-5/6', 'w-2/3'][lineCount % 3] : 'w-full'}`}
                        />
                      ))}
                    </div>
                    <div className='absolute bottom-1 right-2 flex items-center gap-1.5'>
                      <div className='h-2 w-12 bg-gray-500/20 rounded-full' />
                      {isSent && <div className='h-2 w-2 bg-gray-500/20 rounded-full' />}
                    </div>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <>
              {Selected && (
                messages.length === 0 ? <NoMessages /> : messages.map((msg) => (
                  <Message
                    key={msg?.uniqueId ?? msg.id}
                    content={msg.content}
                    time={msg.createdAt}
                    senderId={msg.senderId}
                    status={msg.status}
                    image={msg.image}
                  />
                ))
              )}
              {selectedGroup && (
                groupMessages.length === 0 ? <NoMessages /> : groupMessages.map((msg) => (
                  <GroupMessage
                    key={msg.uniqueId ?? msg.id}
                    messageData={msg}
                  />
                ))
              )}
            </>
          )}
        </div>
      </main>

      {messageData.image && (
        <div className='mx-4 mb-3 bg-[#3A2466] rounded-lg border border-indigo-700/50 overflow-hidden transition-all duration-300'>
          <div className='flex justify-between items-center p-2 bg-[#2D1A47] border-b border-indigo-700/50'>
            <div className='flex items-center gap-2 text-indigo-300'>
              <ImageIcon size={16} />
              <span className='text-sm font-medium'>Image Preview</span>
            </div>
            <button onClick={() => setMessageData(prev => ({ ...prev, image: '' }))} className='p-1 rounded-full hover:bg-indigo-900/50 transition-colors'>
              <X size={16} className='text-rose-400' />
            </button>
          </div>
          <div className='relative h-48 w-full'>
            <Image src={messageData.image} alt='Preview' fill className='object-contain p-2' />
          </div>
        </div>
      )}

      <div className='sticky w-full bottom-0 bg-[#2D1A47]/95 backdrop-blur-lg p-4 border-t border-indigo-900/30'>
        <div className='flex items-center gap-4'>
          <div className='flex gap-4'>
            <button onClick={toggleEmojiPicker} className='hover:bg-[#3A2466] p-2 duration-150 rounded-xl text-blue-500'>
              <Smile size={24} strokeWidth={1.5} className='text-indigo-400' />
            </button>
            <FileInput ref={fileInputRef} onChange={handleFileInput}>
              <div className='hover:bg-[#3A2466] p-2 duration-150 rounded-xl cursor-pointer'>
                <Image src={images.PaperClip} alt='Attachment' width={24} height={24} className='filter invert-[0.4] brightness-125' />
              </div>
            </FileInput>
          </div>
          <RegularInput
            value={messageData.content}
            handleSendMessage={() => handleSendMessage(messageData, setMessageData)}
            placeholder={messageData.image ? 'Add Captions (optional)' : 'Start Chatting'}
            onchange={(e) => setMessageData({ ...messageData, content: e.target.value })}
          />
        </div>
      </div>

      <AnimatePresence>
        {isEmojiPickerOpen && (
          <Emojies setOpenEmoji={setIsEmojiPickerOpen} handleSetEmoji={handleSetEmoji} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default ChatMain
