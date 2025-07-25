"use client"

import images from '@/image'
import { messageStore } from '@/zustand/messageSearchStore'
import { authStore } from '@/zustand/store'
import Image from 'next/image'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, MoreVertical, Plus, UserPlus, Users, X } from 'lucide-react'
import User from './User'
import {
  Tooltip, TooltipContent, TooltipTrigger, TooltipProvider
} from "@/components/ui/tooltip"
import UserCardDialog from './UserCardDialog'
import toast from 'react-hot-toast'
import GroupUsers from './GroupUsers'

import MoreOption from '../MoreOption'
const ChatList = ({ setopenfriendSearch }) => {



  let { loading, getAllUsers, users, Selected, setSelected, setselectedInfo, session } = authStore()
  let { setCategory, category } = messageStore()
  const [userSearch, setuserSearch] = useState("")
  const [searchResult, setsearchResult] = useState([])
  const [Create, setCreate] = useState(false)
  const [GroupUsersSelect, setGroupUsersSelect] = useState([])
  const [error, seterror] = useState("")
  const [Open, setOpen] = useState(false)
  const [Popover, setPopover] = useState(false)
  useEffect(() => {

    getAllUsers()
  }, [])



  let handleChange = (e) => {
    let value = e.target.value
    setuserSearch(value)
    if (!value.trim()) {
      setsearchResult([])
      return
    }

    let searchedUsers = users?.filter(user => {

      if (user.name.toLowerCase().includes(value.toLowerCase())) {
        return true
      }


    });

    setsearchResult(searchedUsers)
  }
 
  useEffect(() => {
    let info = users?.find(user => {
      return user.id === Selected
    })
    setselectedInfo(info)

  }, [Selected])

  let userToMap = searchResult.length === 0 ? users : searchResult


  let handleAddToGroup = (userId) => {
    if (GroupUsersSelect.includes(userId)) {
      let updated = GroupUsersSelect.filter((id) => userId !== id)
      setGroupUsersSelect(updated)
      return
    }
    setGroupUsersSelect([...GroupUsersSelect, userId])

  }
  let handleOpen = () => {
    if (GroupUsersSelect.length === 0) {
      toast.error("Select users to create group",
        { id: "t1" }
      )
      return
    }

    let user = session?.user
    let toAdd = GroupUsersSelect.some(us => us.id === user.id)


    if (user && !toAdd) {

      let data = {
        name: user.name,
        id: user.id,
        image: user.image
      }
      setGroupUsersSelect(prev => [...prev, data])
    }
    setOpen(true)

  }

  return (
    <>
      <div className={`absolute ${Create ? "left-0" : "-left-[100%]"} p-4 w-full z-50 bg-[#1A1035] duration-500 top-0 bottom-0`}>
        {Open &&
          <UserCardDialog GroupUsersSelect={GroupUsersSelect} Open={Open} setOpen={setOpen} setGroupUsersSelect={setGroupUsersSelect} />}
        <div className='flex gap-2.5 items-center mb-8'>
          <div
            onClick={() => {
              setCreate(false)
              setGroupUsersSelect([])
            }}
            className='p-1.5 rounded-lg transition-all duration-200 cursor-pointer hover:bg-indigo-500/20 focus:bg-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-purple-400/50'
          >
            <X className='w-6 h-6 text-indigo-400 hover:text-indigo-300 transition-colors' />
          </div>

          <h1 className='text-xl font-semibold text-indigo-200 transition-all outline-none duration-300 focus:text-transparent focus:bg-gradient-to-r focus:from-purple-400 focus:to-blue-400 focus:bg-clip-text'>
            Create Group
          </h1>

        </div>

        {/* Search Input */}
        <div className="relative group mb-6">
          <input
            type="text"
            placeholder=" "
            className="w-full px-4 py-3 bg-indigo-800/30 rounded-lg border-2 border-indigo-600/50 focus:border-purple-500/60 outline-none text-indigo-50 placeholder-transparent transition-all duration-300 peer"
          />
          <label className="absolute left-4 -top-3.5 text-indigo-400 text-sm   px-1.5 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-indigo-500 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-sm rounded-b-2xl peer-focus:border-b-2  peer-focus:bg-[#1A1035]">
            Search users...
          </label>
          <div className="absolute bottom-0 left-0 w-0 h-1 bg-purple-500/80 transition-all duration-300 group-hover:w-full peer-focus:w-full"></div>
        </div>

        {/* Users List */}
        <div className="h-[calc(100%-180px)] overflow-y-scroll scroll relative bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl p-3 border border-indigo-800/50 shadow-[inset_0_4px_12px_rgba(99,102,241,0.05)]">
          {userToMap?.map((user) => (
            <div key={user.id}
              className={`group flex justify-between items-center w-full rounded-xl p-2.5 transition-all duration-200
                    ${Selected === user.id ?
                  "bg-gradient-to-r from-purple-500/15 to-blue-500/15 border border-purple-400/30" :
                  "hover:bg-indigo-900/30 border border-transparent hover:border-indigo-800/50"
                } mb-3 last:mb-0`}
            >
              <div className='flex gap-3 items-center flex-1'>
                <div className='relative rounded-full overflow-hidden size-12 border-2 border-purple-400/20 group-hover:border-purple-400/40 transition-all'>
                  <Image
                    src={user.avatar}
                    alt='User'
                    width={96}
                    height={96}
                    className='object-cover scale-105 group-hover:scale-100 transition-transform'
                  />
                  {GroupUsersSelect.some((u) => u.id === user.id) && (
                    <div className='absolute inset-0 bg-purple-400/20 backdrop-blur-sm flex items-center justify-center'>
                      <Check className='w-5 h-5 text-purple-200' />
                    </div>
                  )}
                </div>

                <div className='flex-1'>
                  <h2 className='text-indigo-50 font-medium flex items-center gap-2'>
                    {user.name}
                    <span className='text-xs text-purple-300/60 font-normal'>
                      @{user.username}
                    </span>
                  </h2>
                  <p className='text-sm text-indigo-300/70 line-clamp-1'>
                    {user.bio || "Digital collaborator • Focused on innovation"}
                  </p>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>

                  <TooltipTrigger
                    onClick={() => handleAddToGroup({ id: user.id, image: user.avatar, name: user.name })} className={`p-1.5 rounded-lg transition-colors ${GroupUsersSelect?.some(u => u.id === user.id) ?
                      'bg-purple-400/20 text-purple-300' :
                      'text-indigo-400/50 hover:text-purple-300 hover:bg-purple-400/10'}`}
                  >
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
          <motion.button
            onClick={handleOpen}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className='hover:bg-indigo-600/10 absolute bottom-6 mt-3 bg-blue-600/10 ring-indigo-500 group rounded-xl px-5 py-1.5 hover:ring-[1px] bg-gradient-to-r duration-200
         transition-colors   hover:from-indigo-400/20 hover:to-purple-600/20  '>

            <p className=' bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:font-medium  bg-clip-text text-transparent  '>Add Group</p>
          </motion.button>
        </div>
      </div>
      <div className='space-y-3.5 mb-2.5 relative'>
        <div className='flex justify-between items-center px-5'>
          <div className='flex gap-3 items-center'>
            <div className='rounded-full size-12 ring-2 ring-purple-400 overflow-hidden '>
              <Image src={session?.user?.image || images.Avatar} alt='You' height={100} width={100} />
            </div>
            <h1 className='font-bold text-indigo-100 text-[1.5rem]'>Chats</h1>
          </div>
          <div className='flex gap-1.5 items-center'>
            <Tooltip>
              <TooltipContent>
                <p className='text-white'>Add friends</p>
              </TooltipContent>
              <TooltipTrigger>

                <div onClick={() => setopenfriendSearch(true)} className='relative hover:ring-1  ring-purple-500 rounded-full p-2 duration-100 '>
                  <Users className='text-green-600' />
                  <Plus className='absolute bottom-3 right-0 size-4 font-bold text-green-500' />
                </div>
              </TooltipTrigger>
            </Tooltip>

            <MoreVertical onClick={() => setPopover(!Popover)} className='text-blue-400 cursor-pointer' />
          </div>
        </div>
        <div className='flex items-center gap-2.5 px-2 py-1.5 transition-all duration-200 focus-within:ring-2 ring-indigo-500/50 rounded-lg bg-[#2D1A47]'>
          {Popover && <MoreOption />}
          <Image src={images.SearchIcon} alt='Search' className='filter invert-[0.7]' />
          <input
            placeholder='Search for Chats'
            type='text'
            onChange={(e) => handleChange(e)}
            className='border-none placeholder:text-indigo-400/80 text-indigo-50 outline-none w-full bg-transparent'
          />
        </div>
      </div>
      <div className='flex gap-3    '>
        <motion.div whileTap={{ scale: 0.98, opacity: 1 }} initial={{ opacity: 0.9 }} onClick={() => setCategory("All")} className='group relative px-8 cursor-pointer   border-[0.7px] text-indigo-500 rounded-md overflow-hidden'>
          <p className={` relative ${category === "All" ? "z-20" : "group-hover:z-20"}  text-white`}>All</p>
          <div className={`${category === "All" ? "w-full" : "group-hover:w-full w-0"}   mx-auto duration-150   absolute left-1/2 -translate-x-1/2 bottom-[0.3px] h-full -z-0 bg-gradient-to-br to-purple-500 from-indigo-500`} />
        </motion.div>
        <motion.div onClick={() => setCategory("Groups")} whileTap={{ scale: 0.98, opacity: 1 }} initial={{ opacity: 0.9 }} className='group relative px-8 cursor-pointer   border-[0.7px] text-indigo-500 rounded-md overflow-hidden'>
          <p className={`relative ${category === "Groups" ? "z-20" : "group-hover:z-20"}  text-white`}>Groups</p>
          <div

            className={`${category === "Groups" ? "w-full" : "group-hover:w-full w-0"}   mx-auto duration-150   absolute left-1/2 -translate-x-1/2 bottom-[0.3px] h-full -z-0  bg-gradient-to-br to-purple-500 from-indigo-500`} />
        </motion.div>
      </div>
      <div className='mt-4 '>

        {loading ? (<div className='absolute text-3xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
          <Image src={images.properLogo} alt="Loading" width={100} height={100} className='animate-pulse duration-75' />

        </div>)
          :
          (
            <>
              {searchResult.length === 0 && userSearch.length > 0 ?
                <h2 className='text-xl  text-white'>No users found...</h2>
                :
                <>
                  {
                    category === "All" ?
                      <>
                        {userToMap?.map((user, idx) => {

                          return <User key={user.id} user={user} idx={idx} />
                        })}
                      </>
                      : <GroupUsers />
                  }
                </>
              }
            </>
          )
        }

      </div>
    </>
  )
}

export default ChatList