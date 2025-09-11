"use client"
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, } from 'framer-motion'
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
import { typingStore } from '@/zustand/typing'
import { dropDown } from '@/zustand/dropdown'
import { Cross1Icon } from '@radix-ui/react-icons'

const ChatMain = () => {

  const fileInputRef = useRef(null)
  const [messageData, setMessageData] = useState({
    receiverId: '',
    content: '',
    image: '',
    file: ''
  })
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const { isTyping, handleTyping } = typingStore()
  const messages = authstore.use.messages();
  const Selected = authstore.use.Selected();
  const selectedInfo = authstore.use.selectedInfo();
  const getMessages = authstore.use.getMessages();
  const socket = authstore.use.socket();
  const handleSendMessage = authstore.use.handleSendMessage();
  const session = authstore.use.session();
  const handleUpdate = authstore.use.handleUpdate();
  const skeleton = authstore.use.skeleton();
  const getGroupMessages = groupstore.use.getGroupMessages()
  const groupMessages = groupstore.use.groupMessages();
  const selectedGroup = groupstore.use.selectedGroup();
  const handleReaded = groupstore.use.handleReaded();
  let timeout = useRef(null)
  let typing = useRef(false)
  let { reply, setReply, Delete, setDelete,DropDown , setDropDown,react,setReact } = dropDown()

  useEffect(() => {
    if (Selected) getMessages(Selected, selectedInfo.id)
    if (selectedGroup?.id) getGroupMessages(selectedGroup.id)
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
    socket.on('typingIndicator', handleTyping)

    return () => {
      socket.off('changeToRead', handleReaded)
      socket.off('delivered-success', handleUpdate)
      socket.off('typingIndicator', handleTyping)

    }
  }, [])

  useEffect(() => {

    let userId = session?.user.id
    socket?.emit("Groupmessage-readed", { userId, groupId: selectedGroup?.id })

  }, [selectedGroup, groupMessages])

  const scrollbarsRef = useRef(null);
  useEffect(() => {
    if (scrollbarsRef.current) {
      scrollbarsRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }

  }, [messages?.length, isTyping]);
  let scrollPosition = useRef(null)

  // useEffect(() => {
  //   console.log("running");

  //   if (scrollPosition?.current?.scrollTop === 0){
  //     console.log(true);

  //   }

  // }, [scrollPosition.current.scrollTop])
  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen(prev => !prev)
  }





  const handleFileInput = useCallback((e) => {
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
  }, [])




  let sendMessages = useCallback(
    () => {
      handleSendMessage(messageData, setMessageData)
    }
    , [messageData])





  let debounce = (delay) => {


    if (timeout.current) {

      clearTimeout(timeout.current)
      timeout.current = null
    }
    if (typing.current) {

      timeout.current = setTimeout(() => {

        socket.emit("typing", { chatId: selectedInfo.id, typing: false, receiverId: Selected })
        timeout.current = null
        typing.current = false
      }, delay)

    }

  }


  let onchnage = useCallback(
    e => {
      setMessageData(prev => ({ ...prev, content: e.target.value }))
      if (timeout.current) {
        clearTimeout(timeout.current)
        timeout.current = null
      }
      if (!typing.current) {
        if (e.target.value.trim() === '') return


        socket.emit("typing", { chatId: selectedInfo.id, typing: true, receiverId: Selected })
      }
      typing.current = true
      debounce(500)
    }
    , [])
  // const [displayMessages, setdisplayMessages] = useState(null)
  // useEffect(() => {
  //   let allmessages = messages.slice(-50)
  //   console.log(akkn);

  //     setdisplayMessages(allmessages)
  // }, [])

  let handleScroll = (e) => {

  }

  let width = useWidth()
  return (
    <motion.div
      initial={{ x: width < 768 ? 0 : "100%", }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
   
      className='flex-1 dark:bg-gradient-to-r dark:from-[#0D1520] dark:to-[#111927] relative flex flex-col'>
      {Delete && <div onClick={() => setDelete(null)} className='absolute z-20 inset-0 opacity-10 bg-gray-800/40 backdrop-blur-2xl'></div>}
      {DropDown && <div onClick={() => {setDropDown(null)}} className='absolute  z-10  inset-0 '></div>}
      <ChatNav />

      <div ref={scrollPosition}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto relative  scroll">

        <div className='flex flex-col justify-end min-h-full gap-2 max-w-[90%]  mx-auto'>
          {skeleton ? (
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
                    {...{ ...msg, id: msg?.id, uniqueId: msg?.uniqueId }}

                  />


                ))
              )}
              {isTyping &&
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2 px-3 py-2 w-[70px] mb-2.5 bg-gradient-to-r from-indigo-950 to-blue-900 rounded-md"
                >
                  <motion.div
                    className="flex space-x-1"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.2 } },
                    }}
                  >
                    <motion.div
                      variants={{
                        hidden: { scale: 0.5 },
                        visible: { scale: 1 }
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: 'reverse'
                      }}
                      className="w-2 h-2 bg-indigo-300 rounded-full"
                    ></motion.div>
                    <motion.div
                      variants={{
                        hidden: { scale: 0.5 },
                        visible: { scale: 1 }
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        delay: 0.2
                      }}
                      className="w-2 h-2 bg-indigo-300 rounded-full"
                    ></motion.div>
                    <motion.div
                      variants={{
                        hidden: { scale: 0.5 },
                        visible: { scale: 1 }
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        delay: 0.4
                      }}
                      className="w-2 h-2 bg-indigo-300 rounded-full"
                    ></motion.div>
                  </motion.div>
                </motion.div>
              }
              <div ref={scrollbarsRef}></div>
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

      </div>
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

      <div className='sticky   right-0 left-0 bottom-0 z-40 p-2'>
        <div className={`dark:bg-black/70 sticky bottom-0 w-full   ${reply?.image ? "h-26" : (reply?.content) ? "h-20" : "bottom-0 h-0"} duration-300 ease-in-out transition-all     rounded-t-lg  size-4 `}>
          <div className='size-full p-2'>

            <div className={`dark:bg-gray-900 border-l-4 ${reply?.name === "You" ? "border-blue-500" : "border-indigo-600"}   rounded-lg overflow-hidden size-full`}>
              {reply &&
                <div
                  onClick={() => setReply(null)}
                  className={`hover:bg-gray-700 cursor-pointer  absolute right-2  inline-block p-1.5 rounded-full `}>
                  <Cross1Icon />
                </div>}
              {reply !== null &&
                <div className='flex items-center justify-between h-full'>

                  <div className='flex flex-col justify-center mt-0.5 ml-2.5 h-full gap-1 '>
                    <span className={`${reply.name === "You" ? "text-blue-500" : "text-indigo-600"}  text-[0.8rem]`}>{reply?.name}</span>
                    <div className='flex items-center gap-1'>
                      {
                        reply?.image &&
                        <ImageIcon className='size-4' />
                      }
                      <p className='text-[0.8rem] mr-1.5 break-all text-gray-300/90'>{reply?.content.length > 200 ? `${reply?.content.slice(0, 200)}...` : reply?.content || "Photo"}</p>
                    </div>
                  </div>
                  {reply?.image && <div className=' mr-20 overflow-hidden'>
                    <Image src={reply.image} width={100} height={100} className='bg-center bg-cover' alt="replying to Image" />
                  </div>}

                </div>
              }
            </div>
          </div>


        </div>
        <div className={` ${reply ? "rounded-b-3xl" : "delay-300  rounded-full" }  overflow-hidden pl-4 pr-2   shadow-[0_0_1px_0_blue]   bg-white dark:bg-black/70  `}>
          <div className='flex items-center   py-1.5 gap-2'>

            <div className='flex items-center  gap-1 '>
              <button
                onClick={toggleEmojiPicker}
                className={`group relative p-2.5 cursor-pointer duration-100 rounded-full transition-all hover:bg-gray-100 ${isEmojiPickerOpen
                  ? 'dark:bg-indigo-500/20 border dark:border-indigo-500/30'
                  : 'dark:bg-slate-800/50 dark:hover:bg-slate-700/70 dark:border dark:border-slate-700/30 dark:hover:border-slate-600/50'
                  }`}
              >
                <Smile
                  size={18}
                  className={`transition-colors duration-200 ${isEmojiPickerOpen ? 'dark:text-indigo-400' : 'dark:text-slate-300 dark:group-hover:text-indigo-400'}`}
                />
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Add emoji
                </div>
              </button>
              <FileInput ref={fileInputRef} onChange={handleFileInput} classes={"hover:bg-gray-100 dark:bg-slate-800/50 relative  dark:hover:bg-slate-700/70 dark:border dark:border-slate-700/30 hover:border-slate-600/50"}>
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
      </div>

      <AnimatePresence>
        {isEmojiPickerOpen && (
          <Emojies setMessageData={setMessageData} />
        )}
      </AnimatePresence>
    </motion.div>

  )
}

export default ChatMain
