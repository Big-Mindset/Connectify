
import { groupstore } from "@/zustand/groupStore"
import { authstore } from "@/zustand/store"
import { ArrowLeft, } from "lucide-react"
import { DotsVerticalIcon, MagnifyingGlassIcon, ExitIcon, TrashIcon, MinusCircledIcon } from "@radix-ui/react-icons"
import Image from "next/image"
import React, { memo, useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from 'framer-motion'
import { useWidth } from "@/app/page"
const ChatNav = memo(({setOpenSearch,inputRef,openSearch}) => {
    const selectedInfo = authstore.use.selectedInfo();
    const setselectedInfo = authstore.use.setselectedInfo();
    const setSelected = authstore.use.setSelected();
    const selectedGroup = groupstore.use.selectedGroup();
    const setselectedGroup = groupstore.use.setselectedGroup();
    const onlineUsers = authstore.use.onlineUsers();
    const [Menu, setMenu] = useState(false)
    const isGroupChat = selectedGroup && !selectedInfo;
    const isIndividualChat = selectedInfo && !selectedGroup;

    const lastSeenInfo = useMemo(() => {
        if (isGroupChat) {

            const memberCount = selectedGroup.users?.length || 0;
            return `${memberCount} members`;
        }

        if (!selectedInfo?.friend?.lastseen) {
            return "Last seen unknown";
        }

        const nowDate = new Date();
        const lastSeenDate = new Date(selectedInfo.friend.lastseen);
        const diffInMs = nowDate - lastSeenDate;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        if (diffInDays > 7) {
            const date = String(lastSeenDate.getDate()).padStart(2, "0");
            const month = String(lastSeenDate.getMonth() + 1).padStart(2, "0");
            const year = lastSeenDate.getFullYear();
            return `${date}/${month}/${year}`;
        }

        const day = lastSeenDate.toLocaleDateString("en-US", { weekday: "long" });
        const time = lastSeenDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
        return `${day} ${time}`;
    }, [isGroupChat, selectedGroup, selectedInfo, onlineUsers]);

    const chatName = isGroupChat ? selectedGroup.name : selectedInfo?.friend?.name;
    const chatImage = isGroupChat ? selectedGroup.image : selectedInfo?.friend?.avatar;

    const isOnline = isIndividualChat ? onlineUsers?.includes(selectedInfo.friend.id) : false;


   useEffect(()=>{
    if (inputRef?.current){
        inputRef.current.focus()
    }
   },[openSearch])
    let width = useWidth()
    let handleBack = () => {
        setselectedGroup(null)
        setselectedInfo(null)
        setSelected(null)
    }

    return (
        <>
            <AnimatePresence>

                {Menu && <motion.div
                    initial={{ scale: 0, opacity: 0, transformOrigin: "top right" }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="fixed right-[3%] text-gray-300  dark:bg-gray-800  bg-gray-200  rounded-lg p-2 top-[6%] z-[99999] w-[250px]">
                    <div className="flex flex-col gap-1.5 p-1">
                        <div onClick={handleBack} className="flex gap-2 hover:bg-gray-100 dark:hover:bg-blue-800/70 p-2  rounded-lg cursor-pointer items-center">
                            <ExitIcon className="text-gray-600 dark:text-gray-300" />
                            <p className="text-gray-600 dark:text-gray-300">Close Chat</p>
                        </div>
                    </div>
                    <hr className="my-2   border-gray-600" />
                    <div className="flex flex-col gap-1.5 p-1">

                        <div className="flex gap-2 hover:bg-red-600/10 p-2  rounded-lg  group cursor-pointer items-center">
                            <TrashIcon className="dark:group-hover:text-red-200 text-gray-600 dark:text-gray-300 group-hover:text-red-800" />
                            <p className="dark:group-hover:text-red-200 group-hover:text-red-800 dark:text-gray-300 text-gray-600">Delete All Messages</p>
                        </div>
                        <div className="flex gap-2 hover:bg-red-600/10 p-2  rounded-lg  group cursor-pointer items-center">
                            <MinusCircledIcon className="dark:group-hover:text-red-200 dark:text-gray-300 group-hover:text-red-800 text-gray-600" />
                            <p className="dark:group-hover:text-red-200 text-gray-600 dark:text-gray-300 group-hover:text-red-800" >Clear Chat</p>
                        </div>
                    </div>
                </motion.div>}
            </AnimatePresence>
            <nav className="sticky left-0 top-0 right-0  border-b   dark:border-0  border-gray-300 bg-gray-50  dark:bg-[#0D1520] z-30 px-4 text-indigo-100">

                <div className="flex md:justify-between justify-center gap-2 w-full bg-gradient-to-r py-2.5 transition-all duration-200 md:px-5 px-0.5 items-center">
                    {width < 768 &&
                        <motion.div
                            onClick={handleBack}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.1 }}
                            className="bg-blue-700/60  p-1 sm:mr-2.5    rounded-full  ">
                            <ArrowLeft className="font-light sm:size-6  text-black dark:text-white" />
                        </motion.div>}
                    <div className='flex gap-2 flex-1/6'>
                        <div className='rounded-full relative overflow-hidden md:size-14 size-12  border-2 border-indigo-500/30'>
                            <Image
                                src={chatImage}
                                alt={isGroupChat ? 'Group' : 'User'}
                                fill
                                sizes="20px"
                                className='object-cover'
                            />
                        </div>

                        <div className='flex justify-center flex-col'>
                            <h2 className='md:text-[1rem] sm:text-[0.9rem] text-black/90 dark:text-white text-[0.8rem] font-medium'>{chatName}</h2>
                            <p className='flex gap-1 items-center'>
                                {isIndividualChat && isOnline ? (
                                    <span className="bg-gradient-to-r font-bold from-blue-700 md:text-[0.9rem] text-[0.86rem] to-indigo-500 text-transparent bg-clip-text">
                                        Online
                                    </span>
                                ) : (
                                    <span className='dark:text-gray-300 text-black/70 sm:text-[0.7rem] text-[0.5rem]'>
                                        {isGroupChat ? lastSeenInfo : `last seen ${lastSeenInfo}`}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>


                    <div className="flex gap-4 flex-1 items-center justify-end">

                        <div
                            onClick={()=>{
                                setOpenSearch(!openSearch)
                            }}
                        className='flex   relative cursor-pointer   items-center  dark:hover:bg-indigo-600/30 gap-2 p-2  transition-all duration-200 rounded-full overflow-hidden'>

                            <MagnifyingGlassIcon className=" dark:text-white size-[20px]" />
                        </div>
                        <div
                        onClick={() => {
                                setMenu(!Menu)
                            }}
                                  className='p-2 rounded-full bg-[#EFF0F3]  hover:bg-gray-200    cursor-pointer dark:bg-slate-800/40 dark:hover:bg-indigo-600/30 '
                            >
                            

                            <DotsVerticalIcon scale={1.1} className='text-[#1E1F24] dark:text-white font-bold' />
                        </div>
                    </div>

                </div>
            </nav>
        </>
    );
});

export default ChatNav;