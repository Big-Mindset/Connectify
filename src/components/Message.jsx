"use client"

import twoTicks2 from "@/assets/ticksTwo2.svg"
import ColoredTick from "@/assets/coloredTick.svg"
import singleTick from "@/assets/singleTick.svg"
import {
  ChevronDownIcon,
  CopyIcon,
  CrossCircledIcon,
  FaceIcon,
  ImageIcon,
  PlusIcon,
  ReloadIcon
} from "@radix-ui/react-icons"
import { authstore } from "@/zustand/store"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import React, { useMemo } from "react"
import { ChevronDown, TrashIcon } from "lucide-react"
import { dropDown } from "@/zustand/dropdown"
import { CreateReaction } from "@/actions/CreateReaction"
import {
  addmessage,
  deletemessage,
  deletereaction,
  updatereaction
} from "@/database/indexdb"
import { UpdateReaction } from "@/actions/UpdateReactions"
import { DeleteReaction } from "@/actions/DeleteReaction"
import { updateMessage } from "@/actions/updateMessage"
import { DeleteMessage } from "@/actions/DeleteMessage"
import toast from "react-hot-toast"

const Message = React.memo(
  ({
    content,
    createdAt,
    senderId,
    status,
    image,
    id,
    Reactors,
    receiverId,
    replyToId,
    DeleteForEveryone,
  }) => {
    const session = authstore.use.session()
    const selectedInfo = authstore.use.selectedInfo()
    const addReactionToMessage = authstore.use.addReactionToMessage()
    const updateReaction = authstore.use.updateReaction()
    const deleteReaction = authstore.use.deleteReaction()
    const updateWithDbId = authstore.use.updateWithDbId()
    const messages = authstore.use.messages()
    const setMessages = authstore.use.setMessages()
    const setUsers = authstore.use.setUsers()
    const socket = authstore.use.socket()
    const { DropDown, setDropDown, setReply, react, setReact, setDelete, Delete } = dropDown()
    const newtime = new Date(createdAt)
    const isSender = senderId === session?.user.id
    const isSame = Reactors?.length === 2 && Reactors[0].emoji === Reactors[1].emoji
    const appleEmojis = [
      "https://em-content.zobj.net/source/apple/391/grinning-face_1f600.png",
      "https://em-content.zobj.net/source/apple/391/red-heart_2764-fe0f.png",
      "https://em-content.zobj.net/source/apple/391/thumbs-up_1f44d.png",
      "https://em-content.zobj.net/source/apple/391/face-with-tears-of-joy_1f602.png",
      "https://em-content.zobj.net/source/apple/391/fire_1f525.png",
      "https://em-content.zobj.net/source/apple/391/smiling-face-with-heart-eyes_1f60d.png"
    ]
    let getStatusIcon = () => {
      if (!isSender) return
      return (status === "delivered" ? (
        <Image
          loading="lazy"
          className="size-3 dark:invert-75 invert-25 mb-1"
          src={ColoredTick}
          alt="delivered"
        />
      ) : status === "read" ? (
         <Image loading="lazy" className="size-3.5 mb-1 dark:invert-0 invert-25" src={twoTicks2} alt="read" /> 
      ) : (
        <Image
          loading="lazy"
          className="size-2.5 mb-1 dark:invert-75  invert-25"
          src={singleTick}
          alt="send"
        />
      ))
    }

    const OpenDropDown = (e) => {
      setReact(null)
      if (DropDown?.id === id) return setDropDown(null)
      const rect = e.currentTarget.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      setDropDown({ id, position: spaceBelow < 300 && spaceAbove > 300 ? "top" : "bottom" })
    }

    const handleReply = () => {
      setDropDown(null)
      setReact(null)
      const name = senderId === session?.user.id ? "You" : selectedInfo.friend.name
      setReply({ name, content, image, id })
    }

    const handleReact = async (url) => {
      setReact(null)
      const uniqueId = Date.now().toString()
      const reaction = { uniqueId, reactorId: session.user.id, reactTo: id, emoji: url }
      const payload = { reactorId: session.user.id, reactTo: id, emoji: url }
      const isme = Reactors.find((obj) => obj.reactorId === session.user.id)
      const receiver = isSender ? receiverId : senderId

      if (!isme) {
        console.log("Emitting ");
        
        addReactionToMessage(id, reaction)
        const res = await CreateReaction(payload)
        if (res.ok) {
          updateWithDbId(id, res.id, uniqueId)
          socket.emit("reaction", { ...payload, id: res.id, messageId: id }, receiver)
          const message = messages?.find((msg) => msg.id === id)
          await addmessage({ ...message, Reactors: [...message.Reactors, { ...payload, id: res.id }] })
        }
        return
      }

      const Reactid = isme.id ?? isme.uniqueId

      if (isme.emoji === url) {
        deleteReaction(Reactid, id)
        const response = await DeleteReaction(Reactid)
        if (response.ok) {
          socket.emit("delete-reaction", { reactionId: Reactid, id }, receiver)
          await deletereaction({ reactionId: Reactid, id })
        }
        return
      }

      updateReaction(id, Reactid, url)
      const response = await UpdateReaction({ id: Reactid, url })
      if (response.ok) {
        socket.emit("update-reaction", { reactionId: Reactid, id, url }, receiver)
        await updatereaction({ reactionId: Reactid, id, url })
      }
    }



    const reply = useMemo(() => {
      return messages.find((msg) => msg.id === replyToId)
    }, [replyToId])

    const isReplySender = reply?.senderId === session.user.id

    const handleDelete = async (boolean) => {
      const messageId = Delete.id
      const userId = selectedInfo?.id

      if (boolean) {
        const updatedMessage = messages.map((msg) => {
          return msg.id === messageId ? { ...msg, DeleteForEveryone: true, content: "", } : msg
        })
        setMessages(updatedMessage)
        setUsers((users) =>
          users.map((user) => {
            if (user.id === userId && user.lastmessage?.id === messageId) {
              return { ...user, lastmessage: { ...user.lastmessage, DeleteForEveryone: true, content: "", Reactors: null } }
            }
            return user
          })
        )
        setDelete(null)
        const res = await DeleteMessage(messageId)
        if (res?.ok) {
          socket.emit("delete-message", receiverId, messageId)
          await deletemessage(messageId, true)
        }
      } else {
        const updatedMessage = messages.filter((msg) => msg.id !== messageId)
        setMessages(updatedMessage)
        setUsers((users) =>
          users.map((user) => {
            if (user.id === userId && user.lastmessage.id === messageId && messages[messages.length - 2]) {
              return { ...user, lastmessage: messages[messages.length - 2] }
            }
            return user
          })
        )
        setDelete(null)
        const res = await updateMessage(messageId)

        if (res?.ok) {
          await deletemessage(messageId, false)
        }
      }
    }
    let handleCopy = () => {
      setDropDown(null)
      let text = content || image
      window.navigator.clipboard.writeText(text)

      toast.success("Copied")

    }

    return (
      <div
      data-id={id}
      data-uniqueid={id}
        className="relative w-full message ">
        <div
          className={`flex text-gray-50 ${Reactors?.length > 0 && "mb-3.5"} group/emoji ${isSender ? "justify-end" : "justify-start"}`}
        >
          <div className={`${image ? "max-w-[250px]" : "max-w-[70%]"} relative`}>

            <AnimatePresence>
              {(DropDown && DropDown?.id === id) && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className={`absolute  text-gray-300 overflow-hidden ${DropDown?.position === "top" ? "-top-60" : ""} ${isSender ? "right-0 " : "right-0 transform translate-x-[80%]"} dark:bg-gray-800 bg-gray-50 rounded-lg p-2 z-[99999] w-[170px] shadow-lg border border-gray-100 dark:border-gray-700`}
                  style={{
                    transformOrigin: DropDown?.position === "top"
                      ? (isSender ? "bottom right" : "bottom left")
                      : (isSender ? "top right" : "top left")
                  }}
                >
                  <div className="flex flex-col gap-1.5 p-1 text-gray-800 dark:text-white">
                    <div
                      onClick={handleReply}
                      className="flex gap-2 dark:hover:bg-blue-800/70 p-2 hover:bg-gray-300 rounded-lg cursor-pointer items-center transition-colors"
                    >
                      <ReloadIcon />
                      <p>Reply</p>
                    </div>
                    <div onClick={handleCopy} className="flex gap-2 hover:bg-gray-300 dark:hover:bg-blue-800/70 p-2  rounded-lg cursor-pointer items-center transition-colors">
                      <CopyIcon />
                      <p>Copy</p>
                    </div>
                    <div
                      onClick={() => {
                        setReact(id)
                        setDropDown(null)
                      }}
                      className="flex gap-2 hover:bg-gray-300 dark:hover:bg-blue-800/70 p-2 rounded-lg cursor-pointer items-center transition-colors"
                    >
                      <FaceIcon />
                      <p>React</p>
                    </div>
                  </div>
                  <hr className="my-2 border-gray-600" />
                  <div className="flex flex-col gap-1.5 p-1">
                    <div
                      onClick={() => {
                        setDelete({ id, senderId })
                        setDropDown(null)
                      }}
                      className="flex gap-2 dark:hover:bg-red-600/20  hover:bg-red-400/30 p-2 rounded-lg group cursor-pointer items-center transition-colors"
                    >
                      <TrashIcon className="dark:group-hover:text-red-300 dark:text-white group-hover:text-red-700 text-gray-800" />
                      <p className="dark:group-hover:text-red-300  group-hover:text-red-700 dark:text-white text-gray-800">Delete</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {Delete && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className={`fixed text-gray-300   overflow-hidden left-1/2 top-1/2 -translate-x-1/3 -translate-y-1/2 dark:bg-[#0b243b] bg-gray-100 rounded-lg p-2  ${Delete.senderId === session.user.id ? "w-[600px]" : "w-[400px]"} z-[99999]  max-w-[90vw]`}
                >
                  <p className="text-[0.9rem] dark:text-white text-gray-700 pt-4 px-4">Delete Message ?</p>
                  {Delete.senderId === session.user.id ?
                    <div className="flex flex-col mb-6 items-end gap-3 text-gray-600 text-[0.9rem] dark:text-blue-400 mt-4 px-6">
                      <button
                        onClick={() => handleDelete(false)}
                        className="rounded-full w-[60%]  cursor-pointer py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-blue-500/30 focus:scale-[0.98] border-blue-500/30 border-[0.8px] transition-all"
                      >
                        Delete for me
                      </button>
                      <button
                        onClick={() => handleDelete(true)}
                        className="rounded-full w-[50%] cursor-pointer py-1.5 px-2 focus:scale-[0.98] hover:bg-gray-200 dark:hover:bg-blue-500/30 border-blue-500/30 border-[0.8px] transition-all"
                      >
                        Delete for everyone
                      </button>
                      <button
                        onClick={() => setDelete(null)}
                        className="rounded-full w-[30%] cursor-pointer py-1.5 px-2 hover:bg-gray-200 dark:hover:bg-blue-500/30 focus:scale-[0.98] border-blue-500/30 border-[0.8px] transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                    : (
                      <div className="">
                        <p className="text-center my-4 text-[0.9rem] mt-4  text-gray-300 ">This message will be delete for you</p>
                        <div className="flex gap-6  my-5  justify-center w-[90%] mx-auto  ">
                          <button
                            onClick={() => {
                              setDelete(null)
                            }}
                            className="w-[40%] hover:text-white  cursor-pointer  py-1 border-[#205D9E] bg-[#004074] hover:bg-[#104D87] px-1.5 border-[1px] rounded-full" >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDelete(false)}
                            className="w-[40%] bg-red-800 text-red-200 hover:bg-red-800/80 cursor-pointer border-[1px] border-[#853A2D] rounded-full">
                            Delete
                          </button>
                        </div>
                      </div>
                    )
                  }
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {(react === id) && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute ${isSender
                    ? "-left-4 -translate-x-1/2"
                    : "right-0 translate-x-[70%]"
                    } text-gray-300 p-3 overflow-hidden top-1/2 mb-16 -translate-y-[150%] dark:bg-black/90 bg-gray-200 rounded-full z-[99999] w-[270px]`}
                >
                  <div className="flex gap-2 items-center">
                    {appleEmojis.map((url, index) => (
                      <motion.div
                        initial={{ x: 10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          duration: 0.1,
                          delay: index * 0.03,
                          ease: "easeOut"
                        }}
                        key={index}
                        onClick={() => handleReact(url)}
                        className="size-6 cursor-pointer hover:scale-110 transition-transform duration-75"
                      >
                        <Image
                          src={url}
                          alt="Reaction"
                          height={24}
                          width={24}
                          priority={index < 3}
                          className="w-full h-full object-contain"
                        />
                      </motion.div>
                    ))}
                    <div className="dark:hover:bg-gray-500 text-black hover:bg-gray-100 p-2 rounded-full cursor-pointer duration-150 transition-colors">
                      <PlusIcon className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {(Reactors?.length > 0 && !DeleteForEveryone) && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute right-0 h-7 z-10 w-full p-1 -bottom-3 rounded-full"
              >
                <div className="flex items-center justify-end">
                  {isSame ? (
                    <div className="rounded-full relative size-[22px] p-1">
                      <p className="text-[0.6rem] text-blue-400 absolute -right-1 top-0">2</p>
                      <Image
                        src={Reactors[0].emoji}
                        width={100}
                        height={100}
                        alt="Reaction-Emoji"
                      />
                    </div>
                  ) : (
                    Reactors?.map((reactor) => (
                      <div
                        className="rounded-full size-[22px] bg-gray-50 dark:bg-gray-600 p-1"
                        key={reactor.reactorId}
                      >
                        <Image
                          src={reactor.emoji}
                          width={100}
                          height={100}
                          alt="Reaction-Emoji"
                        />
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {!DeleteForEveryone && (
              <motion.div
                onClick={() => {
                  if (react === id) {
                    setReact(null)
                    return
                  }
                  setReact(id)
                  setDropDown(null)
                }}
                className={`absolute duration-200  transition-all opacity-0 cursor-pointer -z-10 ${isSender
                  ? "left-0 group-hover/emoji:-left-6 group-hover/emoji:z-10 group-hover/emoji:opacity-100"
                  : "right-0 group-hover/emoji:z-10 group-hover/emoji:opacity-100 group-hover/emoji:-right-6"
                  } top-1/2 -translate-y-1/2`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaceIcon className="size-5 dark:text-white text-gray-900" />
              </motion.div>
            )}

            <motion.div
              className={` group  relative inline-block dark:shadow-[0] overflow-hidden shadow-sm shadow-gray-200 rounded-md font-[400] px-[5px] py-[4px] ${isSender
                ? "dark:from-[#253974] dark:to-[#253974]    dark:bg-gradient-to-r   bg-[#dbecff]"
                : "dark:bg-gradient-to-r  bg-[#FAF9FB]  dark:from-[#003362] dark:to-[#004074]"
                }`}
            >

              {(replyToId && !DeleteForEveryone) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`flex items-center gap-4 justify-between ${isSender ? "bg-blue-950" : "bg-black/40"
                    } ${isReplySender ? "border-blue-500" : "border-indigo-500"
                    } rounded-lg overflow-hidden border-l-[4px] h-full`}
                >
                  <div className="flex flex-col justify-center h-full">
                    <span
                      className={`${isReplySender ? "text-blue-300" : "text-indigo-300"
                        } mx-1.5 mt-1 font-bold text-[0.8rem]`}
                    >
                      {isReplySender ? "You" : selectedInfo?.friend?.name}
                    </span>
                    <div className="flex pb-2 px-1.5 items-center gap-1">
                      {reply?.image && <ImageIcon className="size-4" />}
                      <p className="text-[0.8rem] break-all text-gray-300/90">
                        {reply?.image
                          ? ` ${reply?.content.slice(0, 87)}...`
                          : reply?.content || "Photo"}
                      </p>
                    </div>
                  </div>
                  {reply?.image && (
                    <div className="bg-white/80 relative overflow-hidden">
                      <Image
                        src={reply.image}
                        width={80}
                        height={80}
                        className="bg-center bg-cover"
                        alt="replying to Image"
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {!DeleteForEveryone && (
                <motion.div
                  onClick={(e) => OpenDropDown(e)}
                  className={`absolute p-1.5 transition-all ${isSender ? "" : ""
                    } duration-150 -right-9 group-hover:right-0 bg-gradient-to-r dark:to-blue-600/50  cursor-pointer bottom-0 top-0 z-20`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronDownIcon className="size-4 text-black dark:text-white/90" />
                </motion.div>
              )}

              {image && (
                <motion.div
                  className="rounded-md bg-white/80 mb-1 max-w-[250px] overflow-hidden"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Image
                    src={image}
                    alt="Sended-image"
                    height={200}
                    width={200}
                    className="object-contain w-full h-full"
                  />
                </motion.div>
              )}

              <motion.div
                className="flex gap-2"
              >
                {DeleteForEveryone ? (
                  <div className="flex gap-1 items-center ">
                    <CrossCircledIcon className="size-6 text-gray-400" />
                    <p className="text-[0.9rem] ml-0.5 dark:font-[500] font-[400] break-all text-black dark:text-gray-400 mb-[1.5px] flex-1 min-w-0">
                      {isSender ? "You deleted this message" : "This message was deleted"}
                    </p>
                  </div>
                ) : (
                  <p className={`text-[0.9rem] ml-0.5  break-all  dark:text-[#C2E6FF] text-[#063B64]  ${replyToId && "mt-0.5"}    mb-[1.5px] flex-1 min-w-0`}>
                    {content}
                  </p>
                )}

                <div className="flex items-center justify-between self-end gap-[3px] flex-shrink-0">
                  <p className="text-[0.61rem] dark:text-gray-100 text-[#073a60] font-[400] dark:font-[200]">
                    {newtime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true
                    })}
                  </p>
                  {!DeleteForEveryone && (
                    <>
                      <span className="text-[#0b66d1] dark:text-inherit inline-flex items-center">
                        {getStatusIcon()}
                      </span>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    )

  }
)

export default Message