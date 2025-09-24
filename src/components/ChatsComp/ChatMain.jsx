"use client"
import React, {useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, } from 'framer-motion'
import Image from 'next/image'
import { ChevronDown, ImageIcon, LoaderCircle, Search, Smile, X } from 'lucide-react'
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
import { getMoreMessages } from '@/actions/getMoreMessages'

const ChatMain = () => {
console.log("rerendering");

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
  const setMessages = authstore.use.setMessages();
  const getGroupMessages = groupstore.use.getGroupMessages()
  const groupMessages = groupstore.use.groupMessages();
  const selectedGroup = groupstore.use.selectedGroup();
  const handleReaded = groupstore.use.handleReaded();
  let timeout = useRef(null)
  let typing = useRef(false)
  let { reply, setReply, Delete, setDelete, DropDown, setDropDown, } = dropDown()
  let [load, setLoad] = useState(true)
  let intersecting = useRef(null)
  let [GoDown, setGoDown] = useState(false)
  let [openSearch , setOpenSearch] = useState(false)
  let [hasMore , sethasMore] = useState(true)
  let inputRef = useRef(null)
  useEffect(() => {
    if (Selected) getMessages(selectedInfo.id)
    if (selectedGroup?.id) getGroupMessages(selectedGroup.id)
  }, [selectedInfo, selectedGroup?.id])

  useEffect(() => {
    console.log("running useeffect");
    
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
  const [prevChatID , setprevChatID] = useState(null)
  useEffect(() => {
    
    if (!messages.length) return
    let id = selectedInfo ? selectedInfo?.id : selectedGroup.id
    
    if (id !== prevChatID) {
      
      scrollbarsRef.current.scrollIntoView({ block: "end" });
      setprevChatID(id)
    setLoad(false);

      return
    }
 if (load) {
    scrollbarsRef.current.scrollIntoView({ block: "end" });
    setLoad(false);
    return;
  }
  console.log("running the scroll ");
  
    scrollbarsRef.current.scrollIntoView({ behavior: "smooth", block: "end" });

  }, [messages?.length, isTyping,Selected,selectedGroup?.id]);


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




  let sendMessages = useCallback((inputRef) => {
    inputRef?.current?.focus()
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
      if (selectedGroup) return
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
    
    let [loading , setLoading] = useState(false)
  let width = useWidth()
  let container = useRef(null)
    const el = container.current;


  useEffect(() => {
    if (!messages.length || !container.current || !hasMore) return;
        const scrolledContent = (el?.scrollHeight - el?.scrollTop - el?.clientHeight)  >=800
        if (!scrolledContent) return
    let topMessage = container.current.querySelector(".message:first-child");
    if (!topMessage) return;

    let id = topMessage.getAttribute("data-id");

    let prevOffset = topMessage.offsetTop;

    let intersectionObserver = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting && !intersecting.current) {
        
        setLoading(true)
        intersecting.current = true

        intersectionObserver.unobserve(topMessage);
try{

  let res = await getMoreMessages(id);
  
        if (res.ok) {
            if (!res.message.length ) {
              sethasMore(false)
            }else{
              
              setMessages([...res.message.reverse(), ...messages]);
            }
            requestAnimationFrame(() => {
              let newTopMessage = container.current.querySelector(
                `.message[data-id="${id}"]`
            );
            if (newTopMessage) {
              container.current.scrollTop =
              newTopMessage.offsetTop - prevOffset;
            }
          });
        }
      }finally{
            setLoading(false)
            setTimeout(() => {
        intersecting.current = false; 
      }, 100);
      
      }
      }
    }, {
      root: container.current,
      rootMargin: "100px"
    });

    intersectionObserver.observe(topMessage);

    return () => intersectionObserver.disconnect();
  }, [messages.length,hasMore,loading]);

  useEffect(() => {
    const el = container.current;
    if (!el) return;

    const handleScroll = () => {

      const atBottom = (el.scrollHeight - el.scrollTop - el.clientHeight) >= 1000;
      setGoDown(atBottom);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  let handleGoDown = () => {
    setGoDown(false)
    scrollbarsRef.current.scrollIntoView({ block: "end" });
    let updatedMessages = [...messages].slice(-50)
    setMessages(updatedMessages)
  }



  return (

    <motion.div
      initial={{ x: width < 768 ? 0 : "100%", }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}

      className='flex-2 bg-[#F0F0F0] dark:bg-gradient-to-r dark:from-[#0D1520] dark:to-[#111927] relative flex flex-col'>
      {Delete && <div onClick={() => setDelete(null)} className='absolute z-20 inset-0 opacity-10 bg-gray-800/40 backdrop-blur-2xl'></div>}
      {DropDown && <div onClick={() => { setDropDown(null) }} className='absolute  z-10  inset-0 '></div>}
      <ChatNav setOpenSearch={setOpenSearch} inputRef={inputRef} openSearch={openSearch}/>
      {
        selectedInfo &&
 <motion.div
 initial={{ x: "100%" }}
 animate={{ x: openSearch ? "0%" : "100%" }}
 transition={{ duration: 0.4 }}
  className="fixed top-0 right-0 bottom-0 w-full md:w-[45%] z-50 border-l border-indigo-600/60 dark:bg-blue-950"
>
  <div className='absolute left-1/2 top-1/2 -translate-1/2 '>
      <p className='whitespace-nowrap text-gray-300'>Search for messages with <span className='text-blue-300'>${selectedInfo.friend.name}</span></p>
      </div>
      <div className='flex flex-col gap-4 p-3'>
        <div className='flex gap-2  items-center '>
        <div 
        
          onClick={()=>setOpenSearch(!openSearch)}
          className='overflow-hidden hover:bg-blue-900 rounded-full p-1.5 cursor-pointer'>
          <X size={20} />
        </div>
        <p className='text-[0.95rem]'>Search Messages</p>
        </div>
        <div className='rounded-full  bg-blue-950 ring-black focus-within:ring-blue-500 focus-within:bg-[#0D1520] focus-within:ring-2 hover:ring-2 flex-1 py-1 px-2 items-center flex gap-2 '>
          <div
          className='rounded-full cursor-pointer p-1.5 hover:bg-blue-500'>

          <Search size={19} className='text-blue-200' />
          </div>
          <input
          ref={inputRef}
          type="text"
          className='w-full outline-0 px-2 py-0.5'
          placeholder='Search'
          />
          
        </div>
      </div>
    </motion.div>
      }
      {GoDown && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute bottom-6 right-6 z-40"
        >
          <button
            onClick={handleGoDown}
            className=" rounded-full 
            bg-gray-800 cursor-pointer text-white hover:ring-2 ring-indigo-500 shadow-lg 
            hover:bg-gray-900 active:scale-95 
            transition-transform duration-200 
            absolute -right-3 bottom-12 p-1.5"
            >
            <ChevronDown size={28} className='text-gray-400' />
          </button>
        </motion.div>
      )}

      <div
        ref={container}
        className="flex-1 overflow-y-auto relative  scroll">

        <div
          className={`flex flex-col justify-end min-h-full ${!Selected && "gap-2"}  max-w-[90%]  mx-auto`}>

          <>
          {loading &&
          <div className='flex justify-center mt-1'>
          <LoaderCircle className='animate-spin text-blue-500 ' />
          </div>}
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
        <div className={`dark:bg-black/70 bg-gray-50 sticky bottom-0 w-full   ${reply?.image ? "h-26" : (reply?.content) ? "h-20" : "bottom-0 h-0"} duration-300 ease-in-out transition-all     rounded-t-lg  size-4 `}>
          <div className='size-full p-2'>

            <div className={`dark:bg-gray-900 bg-gray-100 border-l-4 ${reply?.name === "You" ? "border-blue-500" : "border-indigo-600"}   rounded-lg overflow-hidden size-full`}>
              {reply &&
                <div
                  onClick={() => setReply(null)}
                  className={`hover:bg-gray-700 cursor-pointer  absolute right-2  inline-block p-1.5 rounded-full `}>
                  <Cross1Icon />
                </div>}
              {reply !== null &&
                <div className='flex items-center  justify-between h-full'>

                  <div className='flex flex-col justify-center mt-0.5 ml-2.5 h-full gap-1 '>
                    <span className={`${reply.name === "You" ? "text-blue-500" : "text-indigo-600"}  text-[0.8rem]`}>{reply?.name}</span>
                    <div className='flex items-center gap-1'>
                      {
                        reply?.image &&
                        <ImageIcon className='size-4' />
                      }
                      <p className='text-[0.8rem] mr-1.5 break-all text-gray-600 dark:text-gray-300/90'>{reply?.content.length > 200 ? `${reply?.content.slice(0, 200)}...` : reply?.content || "Photo"}</p>
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
        <div className={` ${reply ? "rounded-b-3xl" : "delay-300  rounded-full"}  overflow-hidden pl-4 pr-2   shadow-[0_0_1px_0_blue]   bg-white dark:bg-black/70  `}>
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
