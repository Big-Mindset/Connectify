import useDebounce from '@/lib/useDebounce'
import {motion} from "framer-motion"
import {UserSearch, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import SearchedUsers from './SearchedUsers'

const AddFriends = React.memo(({setopenfriendSearch}) => {

  const [search, setsearch] = useState("")
  const [searchResult, setsearchResult] = useState(null)
  let debounce = useDebounce(200,search)

    let getSearchedUsers = async ()=>{
      let res = await fetch(`/api/searchUers?name=${encodeURIComponent(debounce)}`)
      let data = await res.json()
      if (res.status === 200){

        setsearchResult(data.users)
      }else{
        setsearchResult(null)
      }
      
    }
    
    useEffect(() => {
      getSearchedUsers()
      
      
    }, [debounce])
    
  
  return (
    <motion.div
    initial={{left : "102%",opacity : 0}}
    animate={{left : 0,opacity : 1}}
    transition={{duration : 0.3,ease : "easeIn"}}
    className='relative'>

      <div className='flex justify-between  items-center gap-1.5 p-1.5 '>
        <h1 className='font-bold text-2xl text-gray-300'>Add Friends</h1>
        <button onClick={()=>setopenfriendSearch(false)} className='p-1 rounded-full  duration-100 hover:bg-indigo-800'>
          <X className='text-indigo-400' />
        </button>
      </div>
      <div className='flex items-center gap-2.5 mt-3.5 px-2 py-2 transition-all duration-200 focus-within:ring-2 ring-indigo-500/50 rounded-lg bg-[#2D1A47]'>

        <input
          placeholder='Search for friends'
          type='text'
        onChange={(e)=>setsearch(e.target.value)}
          className='border-none placeholder:text-indigo-400/80 text-indigo-50 outline-none w-full bg-transparent'
        />

      </div>
      {search.length > 0 ? 
     
      !searchResult ? <div>

      </div> :
      <div className='mt-4'>

      {searchResult?.map((user)=>{
        return <SearchedUsers key={user.id} user={user} setsearchResult={setsearchResult} searchResult={searchResult}  />
      })}
      </div>
     
       :  
      <div className='mt-14  flex-col   flex items-center gap-2'>
      <h1 className='text-2xl font-bold text-indigo-500'>Search for friends</h1>
      <UserSearch className='text-blue-400 size-20 mt-7' />
      </div>
}
    </motion.div>
  )
})

export default AddFriends