"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Scrollbar } from 'react-scrollbars-custom'
import Image from 'next/image'
import { ImageIcon, Smile, X } from 'lucide-react'
import FileInput from '../ChatInputs/FileInput'
import RegularInput from '../ChatInputs/RegularInput'
import ChatNav from './ChatNav'
import Message from '../Message'
import GroupMessage from './GroupMessage'
import Emojies from '../Emojies'
import NoMessages from './NoMessages'

import { authstore } from '@/zustand/store'
import { groupstore } from '@/zustand/groupStore'
import { useWidth } from '@/app/page'

const ChatMain = () => {

  const fileInputRef = useRef(null)
  const [messageData, setMessageData] = useState({
    receiverId: '',
    content: '',
    image: '',
    file: ''
  })

  const [emojiList, setEmojiList] = useState([])
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')

  const messages = authstore.use.messages();
  const Selected = authstore.use.Selected();
  const selectedInfo = authstore.use.selectedInfo();
  const getMessages = authstore.use.getMessages();
  const socket = authstore.use.socket();
  const handleSendMessage = authstore.use.handleSendMessage();
  const session = authstore.use.session();
  const handleUpdate = authstore.use.handleUpdate();
  const seleleton = authstore.use.seleleton();

  const groupMessages = groupstore.use.groupMessages();
  const selectedGroup = groupstore.use.selectedGroup();
  const getGroupMessages = groupstore.use.getGroupMessages();
  const handleReaded = groupstore.use.handleReaded();

  useEffect(() => {
    if (Selected) getMessages(Selected, selectedInfo.id)
    if (selectedGroup) getGroupMessages(selectedGroup.id)
  }, [Selected, selectedGroup?.id])

  useEffect(() => {
    const receiverId = session?.user?.id
    if (Selected && receiverId) {
      socket.emit('message-readed', {
        receiverId,
        senderId: Selected,
        chatId: selectedInfo?.id
      })
    }
  }, [socket, messages, Selected])

  useEffect(() => {
    socket.on('delivered-success', handleUpdate)
    socket.on('changeToRead', handleReaded)

    return () => {
      socket.off('changeToRead', handleReaded)
      socket.off('delivered-success', handleUpdate)
    }
  }, [])

  useEffect(() => {

    let userId = session?.user.id
    socket?.emit("Groupmessage-readed", { userId, groupId: selectedGroup?.id })

  }, [selectedGroup, groupMessages])

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
    if (!file || !(file instanceof Blob)) {
      return
    }
    const reader = new FileReader()

    reader.onload = (e) => {
      const base64 = e.target.result
      setMessageData(prev => ({ ...prev, image: base64 }))
    }
    reader.readAsDataURL(file)
  }

  const scrollbarsRef = useRef(null);

  useEffect(() => {
    if (scrollbarsRef.current) {
      scrollbarsRef.current.scrollToBottom();
    }
  }, [messages]);

  let sendMessages = useCallback(
    () => {
      handleSendMessage(messageData, setMessageData)
    }
    , [messageData])
  let onchnage = useCallback(
    e => {
      setMessageData(prev => ({ ...prev, content: e.target.value }))
    }

    , [])
  console.log(groupMessages);
  let width = useWidth()
  return (
    <motion.div
      initial={{ x: width > 768 ? 0 : "100%", }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}

      className='flex-1 relative flex flex-col'>
      <ChatNav />




      <Scrollbar
        ref={scrollbarsRef}
        style={{ width: '100%', height: 700 }}
        className='flex-1 relative group'
        thumbYProps={{
          style : {backgroundColor : "rgba(200,0,100,0.8)",borderRadius : "4px",width : "5px"},
          renderer: props => {
            const { elementRef, style, ...restProps } = props
            return (
              <div
                ref={elementRef}
                style={style}
                {...restProps}
                className="bg-blue-500 rounded-md w-[6px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            )
          }
        }}
      >
        <div className='flex flex-col gap-2 max-w-[95%]  mx-auto'>
          {seleleton ? (
            [...Array(8)].map((_, i) => {
              const isSent = i % 3 === 0
              const lineCount = Math.floor(Math.random() * 4) + 1

              return (
                <motion.div
                  key={i}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, }}
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
      </Scrollbar>

      {messageData.image && (
        <div className='mx-4 mb-3 bg-gradient-to-r from-blue-600/20 to-indigo-600/40 rounded-lg border border-indigo-700/50 overflow-hidden transition-all duration-300'>
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

      <div className='sticky right-0 left-0 bottom-1 overflow-hidden  p-2'>
        <div className='flex items-center rounded-full overflow-hidden pl-4 pr-2 py-1    bg-black  gap-2'>
          <div className='flex items-center gap-1 '>
            <button
              onClick={toggleEmojiPicker}
              className={`group relative p-2.5 duration-200 rounded-full transition-all ${isEmojiPickerOpen
                ? 'bg-indigo-500/20 border border-indigo-500/30'
                : 'bg-slate-800/50 hover:bg-slate-700/70 border border-slate-700/30 hover:border-slate-600/50'
                }`}
            >
              <Smile
                size={18}
                className={`transition-colors duration-200 ${isEmojiPickerOpen ? 'text-indigo-400' : 'text-slate-300 group-hover:text-indigo-400'}`}
              />
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Add emoji
              </div>
            </button>
            <FileInput ref={fileInputRef} onChange={handleFileInput}>
            </FileInput>
          </div>
          <RegularInput
            value={messageData.content}
            handleSendMessage={sendMessages}
            placeholder={messageData.image ? 'Add Captions (optional)' : 'type a Message'}
            onchange={onchnage}
            hasContent={messageData.content.length === 0 && !messageData.image}
          />
        </div>
      </div>

      <AnimatePresence>
        {isEmojiPickerOpen && (
          <Emojies setOpenEmoji={setIsEmojiPickerOpen} handleSetEmoji={handleSetEmoji} />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ChatMain
