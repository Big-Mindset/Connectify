import Avatar from "@/assets/Avatar.webp"
import { groupstore } from "@/zustand/groupStore"
import { authstore } from "@/zustand/store"
import { ArrowLeft, Search } from "lucide-react"
import Image from "next/image"
import React, { memo, useMemo, useState } from "react"
import {motion} from 'framer-motion'
import { useWidth } from "@/app/page"
const ChatNav = memo(() => {
    const selectedInfo = authstore.use.selectedInfo();
    const setselectedInfo = authstore.use.setselectedInfo();
    const setSelected = authstore.use.setSelected();
    const selectedGroup = groupstore.use.selectedGroup();
    const setselectedGroup = groupstore.use.setselectedGroup();
    const onlineUsers = authstore.use.onlineUsers();
    const [Focus, setFocus] = useState(false);

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

    const currentChat = isGroupChat ? selectedGroup : selectedInfo?.friend;
    const chatName = isGroupChat ? selectedGroup.name : selectedInfo?.friend?.name;
    const chatImage = isGroupChat ? selectedGroup.image : selectedInfo?.friend?.avatar;

    const isOnline = isIndividualChat ? onlineUsers?.includes(selectedInfo.friend.id) : false;
    

    const handleSearch = (e) => {
        console.log("Searching:", e.target.value);
    };
       let width = useWidth()
   let handleBack = ()=>{
    setselectedGroup(null)
    setselectedInfo(null)
    setSelected(null)
   }
    return (
        <nav className="sticky left-0 top-0 right-0 bg-gradient-to-br from-[#070a1d] to-[#000000] px-4 text-indigo-100">
            <div className="flex md:justify-between justify-center gap-2 w-full bg-gradient-to-r py-2.5 transition-all duration-200 md:px-5 px-0.5 items-center">
            {width <768 && 
                <motion.div
                onClick={handleBack}
                whileTap={{scale : 0.95 }}
                transition={{duration : 0.1}}
                className="bg-blue-700/60  p-1 sm:mr-2.5    rounded-full  ">
                    <ArrowLeft className= "font-light sm:size-6  text-white" />
                </motion.div>}
                <div className='flex gap-2 flex-1/6'>
                    <div className='rounded-full overflow-hidden md:size-14 size-12  border-2 border-indigo-500/30'>
                        <Image
                            src={chatImage || Avatar}
                            alt={isGroupChat ? 'Group' : 'User'}
                            width={100}
                            height={100}
                            className='object-cover'
                        />
                    </div>

                    <div className='flex justify-center flex-col'>
                        <h2 className='md:text-[1rem] sm:text-[0.9rem] text-[0.8rem] font-medium'>{chatName}</h2>
                        <p className='flex gap-1 items-center'>
                            {isIndividualChat && isOnline ? (
                                <span className="bg-gradient-to-r font-bold from-blue-700 md:text-[0.9rem] text-[0.86rem] to-indigo-500 text-transparent bg-clip-text">
                                    Online
                                </span>
                            ) : (
                                <span className='text-gray-300 sm:text-[0.7rem] text-[0.5rem]'>
                                    {isGroupChat ? lastSeenInfo : `last seen ${lastSeenInfo}`}
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                {/* Search Section */}
              
                <div className='flex flex-1  relative items-center gap-2.5 px-2 py-1.5 transition-all duration-200 rounded-lg overflow-hidden'>
                    <span className={`absolute left-0 bottom-0  z-50 w-0 h-[1px] shadow-[0_0_8px_4px_rgba(60,0,200,0.6)] ease-in-out bg-blue-500/60 transition-all duration-500 ${Focus ? "w-full opacity-100" : "w-0 opacity-0"}`}></span>

                    <Search className="text-white size-5" />
                    <input
                        onFocus={() => setFocus(true)}
                        onBlur={() => setFocus(false)}
                        onChange={handleSearch}
                        placeholder='Search Messages'
                        type='text'
                        className='border-none  placeholder:bg-indigo-400/80 placeholder:text-transparent placeholder:bg-clip-text placeholder:bg-gradient-to-r placeholder:from-blue-500/80 placeholder:font-[14px] outline-none w-full bg-transparent'
                    />
                </div>

            </div>
        </nav>
    );
});

export default ChatNav;