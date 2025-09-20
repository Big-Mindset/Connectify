"use client"
import React, { useCallback, useMemo, useState, useEffect } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import Setting from '@/components/Settings'
import { Check, Plus, Search, Settings, User2, UserPlus, UserPlus2, UserPlusIcon, UserRoundPlusIcon, Users, Users2, UsersRound, UserX2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import Avatar from '@/assets/Avatar.webp'
import properLogo from '@/assets/logop.webp'
import { messagestore } from '@/zustand/messageSearchStore'
import { authstore } from '@/zustand/store'
import User from './User'
import UserCardDialog from './UserCardDialog'
import GroupUsers from './GroupUsers'
import useDebounce from '@/lib/useDebounce'
import UserAccount from '../UserAccount'
import { DotsVerticalIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import FriendRequests from './FriendRequests'

const ChatList = React.memo(({ setopenfriendSearch }) => {
  const loading = authstore.use.loading()
  const users = authstore.use.users()
  const session = authstore.use.session()
  const setCategory = messagestore.use.setCategory()
  const category = messagestore.use.category()

  const [userSearch, setuserSearch] = useState("")
  const [searchResult, setsearchResult] = useState([])
  const [Create, setCreate] = useState(false)
  const [GroupUsersSelect, setGroupUsersSelect] = useState([])
  const [error, seterror] = useState("")
  const [Open, setOpen] = useState(false)
  const [settings, setsettings] = useState(false)
  const [focus, setfocus] = useState(false)
  const debounce = useDebounce(200, userSearch)

  const searchedUsers = useMemo(() => {
    if (!debounce.trim()) return []
    return users?.filter(user =>
      user?.friend.name.toLowerCase().includes(userSearch.toLowerCase())
    )
  }, [users, debounce])

  useEffect(() => {
    setsearchResult(searchedUsers)
  }, [searchedUsers])

  const userToMap = useMemo(() => {
    return searchResult.length === 0 ? users : searchResult
  }, [searchResult, users])

  const handleChange = e => {
    setuserSearch(e.target.value)
    
         
        
  }

  const handleAddToGroup = (User) => {
    let userId = User.id

    let isAvailable = GroupUsersSelect.some((user) => user.id === userId)
    if (!isAvailable) {
      setGroupUsersSelect(prev => [...prev, User])
    } else {
      let filteredData = GroupUsersSelect.filter((user) => user.id !== User.id)
      setGroupUsersSelect(filteredData)

    }

  }

  const handleOpen = () => {
    if (GroupUsersSelect.length === 0) {
      toast.error("Select users to create group", { id: "t1" })
      return
    }

    const user = session?.user
    const toAdd = GroupUsersSelect.some(us => us.id === user.id)

    if (user && !toAdd) {
      const data = {
        name: user.name,
        id: user.id,
        image: user.image
      }
      setGroupUsersSelect(prev => [...prev, data])
    }

    setOpen(true)
  }

  const handleOpenSearch = useCallback(() => setopenfriendSearch(true), [])
  const [Menu, setMenu] = useState(false)

  const [openFriendRequest, setopenFriendRequest] = useState(false)

  return (
    <>
        {openFriendRequest && <FriendRequests setopenFriendRequest={setopenFriendRequest} />}
      <div className={`absolute ${Create ? "left-0" : "-left-[100%]"} p-4 w-full z-50  dark:bg-black bg-gray-200 duration-500 top-0 bottom-0`}>
        {Open && <UserCardDialog GroupUsersSelect={GroupUsersSelect} Open={Open} setOpen={setOpen} setGroupUsersSelect={setGroupUsersSelect} />}

        <div className='flex gap-2.5 items-center mb-8'>
          <div onClick={() => {
            setCreate(false)
            setGroupUsersSelect([])
          }} className='p-1.5  transition-all duration-200 cursor-pointer rounded-full hover:bg-gray-300 dark:hover:bg-indigo-500/20 focus:bg-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-purple-400/50'>
            <X className='w-6 h-6 dark:text-indigo-400 text-black/70 dark:hover:text-indigo-300 transition-colors' />
          </div>
          <h1 className='text-xl font-semibold text-black dark:text-indigo-200'>Create Group</h1>
        </div>

        <div className="relative group mb-6">
          <input type="text" placeholder="Search for Users" className="w-full px-4 py-3 dark:bg-indigo-800/30 rounded-lg border-t border-r border-l peer  dark:placeholder:text-gray-200 dark:placeholder:text-[0.9rem] dark:border-indigo-600/50 dark:focus:border-purple-500/60 outline-none dark:text-indigo-50  " />

          <div className="absolute bottom-0 left-0 w-0 h-[1px]  bg-black dark:bg-purple-500/80 transition-all rounded-lg duration-300 group-hover:w-full peer-focus:w-[calc(100%-8px)] mx-auto "></div>
        </div>

        <div className="h-[calc(100%-140px)]  scroll overflow-y-auto relative dark:bg-gradient-to-br  border-gray-400 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-3 border dark:border-indigo-800/50 shadow-[inset_0_4px_12px_rgba(99,102,241,0.05)]">
          {userToMap?.map(user => (
            <div key={user.friend.id} className={`group flex justify-between items-center w-full rounded-xl  p-2.5 mb-3 ${GroupUsersSelect.some(u => u.id === user.friend.id) ? "bg-gradient-to-r  from-slate-100 to-slate-100 dark:from-purple-500/15 dark:to-blue-500/15 border  border-purple-400/30" : "dark:hover:bg-indigo-900/30 border border-transparent  dark:hover:border-indigo-800/50"}`}>
              <div className='flex gap-3 items-center flex-1'>
                <div className='relative rounded-full overflow-hidden size-12 border-2 border-purple-400/20 group-hover:border-purple-400/40'>
                  <Image src={user.friend.avatar || Avatar} alt='User' width={96} height={96} className='object-cover scale-105 group-hover:scale-100' />
                  {GroupUsersSelect.some(u => u.id === user.friend.id) && (
                    <div className='absolute inset-0 bg-purple-400/20 backdrop-blur-sm flex items-center justify-center'>
                      <Check className='w-5 h-5 text-purple-200' />
                    </div>
                  )}
                </div>
                <div className='flex-1'>
                  <h2 className='dark:text-indigo-50 font-medium text-black flex items-center gap-2'>
                    {user.friend.name}
                    <span className='text-xs dark:text-purple-300/60 text-black font-normal'>@{user.friend.username}</span>
                  </h2>
                  <p className='text-sm dark:text-indigo-300/70 text-blue-500 line-clamp-1'>{user.friend.bio}</p>
                </div>
              </div>
              <div onClick={() => handleAddToGroup(user.friend)} className={`p-1.5 cursor-pointer rounded-lg ${GroupUsersSelect?.some(u => u.id === user.friend.id) ? 'dark:bg-purple-400/20 bg-gray-300  dark:text-purple-300' : 'dark:text-indigo-400/50 dark:hover:text-purple-300 hover:bg-gray-200 dark:hover:bg-purple-400/10'}`}>
                {!GroupUsersSelect.some(us => us.id === user.friend.id) ? <UserPlus className='size-5' /> : <X className='size-5' />}

              </div>

            </div>
          ))}

          <div>{error}</div>

          <motion.button onClick={handleOpen} whileTap={{ scale: 0.95 }} initial={{ scale: 1 }} transition={{ duration: 0.2 }} className='hover:bg-indigo-600/10 absolute bottom-6 mt-3 bg-blue-600/10 ring-indigo-500 group rounded-xl px-5 py-1.5 hover:ring-[1px] bg-gradient-to-r duration-200 hover:from-indigo-400/20 hover:to-purple-600/20'>
            <p className='bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:font-medium bg-clip-text text-transparent'>Add Group</p>
          </motion.button>
        </div>
      </div>

      <div className='space-y-5.5 mb-2.5 relative p-3'>
        <div className='flex justify-between items-center px-5'>
          <div className='flex gap-3 items-center'>
            <Popover>
              <PopoverTrigger>
                <div className='rounded-full relative size-12 border-[1px] cursor-pointer border-[#87A5EF] overflow-hidden'>
                  {session?.user?.image &&
                    <Image src={session?.user?.image} className='object-cover object-center' sizes='100px' alt='You' fill priority />

                  }
                </div>
              </PopoverTrigger>
              <PopoverContent >
                <UserAccount />
              </PopoverContent>
            </Popover>
            <h1 className='font-bold dark:text-indigo-100 text-[#395BC7] text-[1.5rem]'>Connectify</h1>
          </div>
          <div className='flex gap-2  items-center'>
          <motion.div
              onClick={handleOpenSearch}
              className="relative cursor-pointer flex items-center gap-2 px-3 py-2 hover:bg-[#E7E8EC] hover:ring-1 ring-gray-400 bg-[#EFF0F3] rounded-full dark:bg-slate-800/40 dark:hover:bg-indigo-600/30 transition-colors"
            >
              <div className="relative">
                <User2 className="size-5 text-[#395BC7] dark:text-indigo-400" />
                <Plus className="absolute -bottom-1 -right-1 size-3 bg-[#395BC7] dark:bg-indigo-500   rounded-full p-[2px] text-white" />
              </div>
              <span className="text-sm dark:text-indigo-200/90 text-[#1D2E5C]  font-light">Add Friends</span>

            </motion.div>
            <div className='relative'>

                  <div
                  onClick={()=>{
                    setMenu(!Menu)
                  }}
                  className='p-2 rounded-full bg-[#EFF0F3]  hover:bg-gray-200  hover:ring-1 ring-gray-400 cursor-pointer dark:bg-slate-800/40 dark:hover:bg-indigo-600/30 '>
                  
                  <DotsVerticalIcon scale={1.1} className='text-[#1E1F24] dark:text-white font-bold' />
                  </div> 
                  <AnimatePresence >
                  {Menu && 

                  <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.1 }}
                  style={{
                    transformOrigin: "top left"
                   }}
                    exit={{ scale: 0, opacity: 0 }}
                  className={`absolute  dark:text-gray-300 text-gray-600 overflow-hidden bg-gray-200  dark:bg-gray-800 rounded-lg p-2 z-[99999] w-[200px] shadow-lg dark:border  dark:border-gray-700`}
                 
                >
                  <div className="flex flex-col gap-1.5 p-1">
                    <div
                    onClick={()=>{
                      setCreate(true)
                      setMenu(false)
                    }}
                      className="flex gap-2 dark:bg-slate-800/40 dark:hover:bg-indigo-600/30 hover:bg-gray-100 p-2 rounded-lg cursor-pointer items-center transition-colors"
                    >
                      {/* <DoubleUser /> */}
                      <Users2 />
                      <p>Add Groups</p>
                    </div>
                    <div
                    onClick={()=>{
                      setopenFriendRequest(true)
                      setMenu(false)

                    }}
                    className="flex gap-2 dark:bg-slate-800/40 hover:bg-gray-100 dark:hover:bg-indigo-600/30 p-2 rounded-lg cursor-pointer items-center transition-colors">
                      <UserPlus />
                      <p>Friend Requests</p>
                    </div>
                  </div>
                 
                </motion.div>
                }
                  </AnimatePresence>
            </div>

          

          </div>
        </div>

        <motion.div
          className={`flex items-center bg-gray-200  gap-2.5 p-2 ${focus ? "ring-2 ring-[#87A5EF] bg-white" : "hover:ring-gray-400 hover:ring-[1px]"}   dark:focus-within:shadow-[1px_1px_10px_2px_rgba(100,0,100,1)]   dark:ring-indigo-600 dark:bg-blue-900/20 rounded-full`}>
          <Search className="size-5  dark:text-indigo-500" />
          <input
            onFocus={() => setfocus(true)}
            onBlur={() => setfocus(false)}
            placeholder='Search Users'
            type='text'
            onChange={handleChange}
            className='border-none dark:placeholder:text-purple-200/40 placeholder:text-black/60 text-[0.95rem] text-black/90 outline-none w-full dark:text-white bg-transparent'
          />
        </motion.div>
      </div>

      <div className='flex gap-3 my-5 ml-3 p-3'>
        <motion.div whileTap={{ scale: 0.98 }} initial={{ opacity: 0.9 }} onClick={() => setCategory("All")} className='group relative px-8 cursor-pointer  border-[0.7px] border-[#D8D9E0] dark:border-indigo-500  dark:text-indigo-500 text-black/70 rounded-md overflow-hidden'>
          <p className={`relative ${category === "All" ? "z-20" : "group-hover:z-20"} dark:text-white text-gray-800`}>All</p>
          <div className={`${category === "All" ? "w-full" : "group-hover:w-full w-0"} absolute left-1/2 top-1/2 -translate-1/2 h-full duration-200 transition-all -z-0 bg-gradient-to-br  bg-gray-200  dark:to-blue-500 dark:from-indigo-500`} />
        </motion.div>

        <motion.div whileTap={{ scale: 0.98 }} initial={{ opacity: 0.9 }} onClick={() => setCategory("Groups")} className='group relative px-8 cursor-pointer border-[0.7px] border-[#D8D9E0] dark:border-indigo-500  dark:text-indigo-500 text-black/70 rounded-md overflow-hidden'>
          <p className={`relative ${category === "Groups" ? "z-20" : "group-hover:z-20"} dark:text-white text-gray-800`}>Groups</p>
          <div className={`${category === "Groups" ? "w-full" : "group-hover:w-full w-0"} absolute left-1/2 top-1/2 -translate-1/2 h-full duration-200 transition-all -z-0 bg-gradient-to-br  bg-gray-200  dark:to-blue-500 dark:from-indigo-500`} />
        </motion.div>
      </div>

      <div className='mt-4 px-5 flex flex-col overflow-y-auto h-full gap-1 max-h-[calc(100vh-225px)] w-full scrollStyles '>
        {
          searchResult.length === 0 && userSearch.length > 0 ? (
            <h2 className='text-xl text-white'>No users found...</h2>
          ) : (
            category === "All" ? (
              userToMap.length === 0 ? <div className='absolute top-[40%] w-full left-1/2 -translate-1/2'>
                <div className='flex-col flex gap-1.5 items-center justify-center'>
                  <div className='flex flex-col items-center gap-3 mb-8'>
                    <motion.h1
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, }}
                      className='text-[1.3rem] text-[#C2E6FF] '>Users not found</motion.h1>
                    <UserX2 className='size-14 ' />

                  </div>
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 1 }}
                    transition={{ duration: 0.2, }}
                    onClick={handleOpenSearch}
                    className='rounded-full bg-gradient-to-r  from-blue-500 ring-1 hover:ring-0 ring-blue-400 shadow-blue-500 hover:shadow-[0_0_10px_2px_indigo]  to-blue-400 via-sky-600  cursor-pointer flex gap-2 items-center justify-center  w-[40%] px-4 py-2'><p>Connect</p> <UserRoundPlusIcon size={17} />
                  </motion.button>
                </div>
              </div> : userToMap.map((user, idx) => <User key={user.id} user={user} idx={idx} />)
            ) : (
              <GroupUsers />
            )
          )
        }
      </div>
      <button

        onClick={() => setsettings(true)}
        className={`absolute bottom-3 ${settings && "border-blue-600 border-2"} duration-150 hover:scale-105 cursor-pointer focus:scale-100   
        right-3 rounded-full p-2 bg-gradient-to-r  from-indigo-700/90 to-purple-500/90`} >
        <Settings className={`text-white size-5 duration-300 transition-all ${settings && "rotate-90 "}`} />
      </button>
      {settings && (
        <Setting setsettings={setsettings} />
      )}
    </>
  )
})

export default ChatList
