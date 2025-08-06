"use client"

import React, { useCallback, useMemo, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Check, Plus, Search, User2, UserPlus, Users, UsersIcon, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from "../ui/popover"
import Avatar from '@/assets/Avatar.webp'
import properLogo from '@/assets/logop.webp'
import { messagestore } from '@/zustand/messageSearchStore'
import { authstore } from '@/zustand/store'
import User from './User'
import UserCardDialog from './UserCardDialog'
import GroupUsers from './GroupUsers'
import useDebounce from '@/lib/useDebounce'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from '@/components/ui/tooltip'
import UserAccount from '../UserAccount'

const ChatList = React.memo(({ setopenfriendSearch }) => {
  const loading = authstore.use.loading()
  const users = authstore.use.users()
  const Selected = authstore.use.Selected()
  const session = authstore.use.session()
  const setCategory = messagestore.use.setCategory()
  const category = messagestore.use.category()

  const [userSearch, setuserSearch] = useState("")
  const [searchResult, setsearchResult] = useState([])
  const [Create, setCreate] = useState(false)
  const [GroupUsersSelect, setGroupUsersSelect] = useState([])
  const [error, seterror] = useState("")
  const [Open, setOpen] = useState(false)

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

  const handleAddToGroup = userId => {
    if (GroupUsersSelect.includes(userId)) {
      const updated = GroupUsersSelect.filter(id => userId !== id)
      setGroupUsersSelect(updated)
      return
    }
    setGroupUsersSelect([...GroupUsersSelect, userId])
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
  const handleAddGroup = useCallback(
    user => handleAddToGroup({ id: user.id, image: user.avatar, name: user.name }),
    []
  )

  let handlepopup = useCallback(() => {
    setCreate(true)
  }, [])

  return (
    <>
      <div className={`absolute ${Create ? "left-0" : "-left-[100%]"} p-4 w-full z-50  bg-black duration-500 top-0 bottom-0`}>
        {Open && <UserCardDialog GroupUsersSelect={GroupUsersSelect} Open={Open} setOpen={setOpen} setGroupUsersSelect={setGroupUsersSelect} />}

        <div className='flex gap-2.5 items-center mb-8'>
          <div onClick={() => {
            setCreate(false)
            setGroupUsersSelect([])
          }} className='p-1.5 rounded-lg transition-all duration-200 cursor-pointer hover:bg-indigo-500/20 focus:bg-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-purple-400/50'>
            <X className='w-6 h-6 text-indigo-400 hover:text-indigo-300 transition-colors' />
          </div>
          <h1 className='text-xl font-semibold text-indigo-200'>Create Group</h1>
        </div>

        <div className="relative group mb-6">
          <input type="text" placeholder=" " className="w-full px-4 py-3 bg-indigo-800/30 rounded-lg border-2 border-indigo-600/50 focus:border-purple-500/60 outline-none text-indigo-50 placeholder-transparent peer" />
          <label className="absolute left-4 -top-3.5 text-indigo-400 text-sm px-1.5 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-indigo-500 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-sm rounded-b-2xl peer-focus:border-b-2 peer-focus:bg-[#1A1035]">
            Search users...
          </label>
          <div className="absolute bottom-0 left-0 w-0 h-1 bg-purple-500/80 transition-all duration-300 group-hover:w-full peer-focus:w-full"></div>
        </div>

        <div className="h-[calc(100%-180px)] scroll overflow-y-scroll relative bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl p-3 border border-indigo-800/50 shadow-[inset_0_4px_12px_rgba(99,102,241,0.05)]">
          {userToMap?.map(user => (
            <div key={user.friend.id} className={`group flex justify-between items-center w-full rounded-xl p-2.5 mb-3 ${Selected === user.id ? "bg-gradient-to-r from-purple-500/15 to-blue-500/15 border border-purple-400/30" : "hover:bg-indigo-900/30 border border-transparent hover:border-indigo-800/50"}`}>
              <div className='flex gap-3 items-center flex-1'>
                <div className='relative rounded-full overflow-hidden size-12 border-2 border-purple-400/20 group-hover:border-purple-400/40'>
                  <Image src={user.friend.avatar} alt='User' width={96} height={96} className='object-cover scale-105 group-hover:scale-100' />
                  {GroupUsersSelect.some(u => u.id === user.friend.id) && (
                    <div className='absolute inset-0 bg-purple-400/20 backdrop-blur-sm flex items-center justify-center'>
                      <Check className='w-5 h-5 text-purple-200' />
                    </div>
                  )}
                </div>
                <div className='flex-1'>
                  <h2 className='text-indigo-50 font-medium flex items-center gap-2'>
                    {user.friend.name}
                    <span className='text-xs text-purple-300/60 font-normal'>@{user.friend.username}</span>
                  </h2>
                  <p className='text-sm text-indigo-300/70 line-clamp-1'>{user.friend.bio || "Digital collaborator • Focused on innovation"}</p>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger onClick={() => handleAddGroup(user.friend)} className={`p-1.5 rounded-lg ${GroupUsersSelect?.some(u => u.id === user.friend.id) ? 'bg-purple-400/20 text-purple-300' : 'text-indigo-400/50 hover:text-purple-300 hover:bg-purple-400/10'}`}>
                    <UserPlus className='w-5 h-5' />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className='px-4 py-2 bg-white text-black rounded-full'>Add to group</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}

          <div>{error}</div>

          <motion.button onClick={handleOpen} whileTap={{ scale: 0.95 }} initial={{ scale: 1 }} transition={{ duration: 0.2 }} className='hover:bg-indigo-600/10 absolute bottom-6 mt-3 bg-blue-600/10 ring-indigo-500 group rounded-xl px-5 py-1.5 hover:ring-[1px] bg-gradient-to-r duration-200 hover:from-indigo-400/20 hover:to-purple-600/20'>
            <p className='bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:font-medium bg-clip-text text-transparent'>Add Group</p>
          </motion.button>
        </div>
      </div>

      <div className='space-y-5.5 mb-2.5 relative '>
        <div className='flex justify-between items-center px-5'>
          <div className='flex gap-3 items-center'>
            <Popover>
              <PopoverTrigger>
                <div className='rounded-full size-12 border-[1px] cursor-pointer border-purple-500 overflow-hidden'>
                  <Image src={session?.user?.image || Avatar} alt='You' priority height={100} width={100} />
                </div>
              </PopoverTrigger>
              <PopoverContent >
                <UserAccount />
              </PopoverContent>
            </Popover>
            <h1 className='font-bold text-indigo-100 text-[1.5rem]'>Chats</h1>
          </div>
          <div className='flex gap-2 items-center'>

            <motion.div
              onClick={handleOpenSearch}
              className="relative cursor-pointer flex items-center gap-2 px-3 py-2 rounded-full bg-slate-800/40 hover:bg-indigo-600/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <User2 className="size-5 text-indigo-400" />
                <Plus className="absolute -bottom-1 -right-1 size-3 bg-indigo-500 rounded-full p-[2px] text-white" />
              </div>
              <span className="text-sm text-indigo-200/90 font-light">Add Friend</span>
            </motion.div>

            <motion.div
              onClick={handlepopup}
              className="relative cursor-pointer flex items-center gap-2 px-3 py-2 rounded-full bg-slate-800/40 hover:bg-indigo-600/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <Users className="size-5 text-indigo-400" />
                <Plus className="absolute -bottom-1 -right-1 size-3 bg-indigo-500 rounded-full p-[2px] text-white" />
              </div>
              <span className="text-sm text-indigo-200/90 font-light">Add Group</span>
            </motion.div>
          </div>
        </div>

        <motion.div
          whileHover={{ scaleX: 0.96 }}
          initial={{ scaleX: 0.97 }}
          transition={{ duration: 0.3 }}
          className='flex items-center gap-2.5 px-2 py-1.5  focus-within:shadow-[1px_1px_10px_2px_rgba(100,0,100,1)]  ring-1 ring-indigo-600 bg-black/10 rounded-lg'>
          <Search className="size-5 text-indigo-400" />
          <input
            placeholder='Search Users'
            type='text'
            onChange={handleChange}
            className='border-none placeholder:text-purple-200/40 text-[0.95rem] text-blue-50 outline-none w-full bg-transparent'
          />
        </motion.div>
      </div>

      <div className='flex gap-3 my-7 ml-3'>
        <motion.div whileTap={{ scale: 0.98 }} initial={{ opacity: 0.9 }} onClick={() => setCategory("All")} className='group relative px-8 cursor-pointer border-[0.7px] text-indigo-500 rounded-md overflow-hidden'>
          <p className={`relative ${category === "All" ? "z-20" : "group-hover:z-20"} text-white`}>All</p>
          <div className={`${category === "All" ? "w-full" : "group-hover:w-full w-0"} absolute left-1/2 top-1/2 -translate-1/2 h-full -z-0 bg-gradient-to-br to-blue-500 from-indigo-500`} />
        </motion.div>

        <motion.div whileTap={{ scale: 0.98 }} initial={{ opacity: 0.9 }} onClick={() => setCategory("Groups")} className='group relative px-8 cursor-pointer border-[0.7px] text-indigo-500 rounded-md overflow-hidden'>
          <p className={`relative ${category === "Groups" ? "z-20" : "group-hover:z-20"} text-white`}>Groups</p>
          <div className={`${category === "Groups" ? "w-full" : "group-hover:w-full w-0"} absolute left-1/2 top-1/2 -translate-1/2 h-full -z-0 bg-gradient-to-br to-blue-500 from-indigo-500`} />
        </motion.div>
      </div>

      <div className='mt-4'>
        {loading ? (
          <div className='absolute text-3xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
            <Image src={properLogo} alt="Loading" width={100} height={100} className='animate-pulse' />
          </div>
        ) : (
          searchResult.length === 0 && userSearch.length > 0 ? (
            <h2 className='text-xl text-white'>No users found...</h2>
          ) : (
            category === "All" ? (
              userToMap?.map((user, idx) => <User key={user.id} user={user} idx={idx} />)
            ) : (
              <GroupUsers />
            )
          )
        )}
      </div>
    </>
  )
})

export default ChatList
