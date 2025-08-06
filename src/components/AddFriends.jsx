import useDebounce from '@/lib/useDebounce'
import {motion} from "framer-motion"
import {UserSearch, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import SearchedUsers from './SearchedUsers'

const AddFriends = React.memo(({setopenfriendSearch,openfriendSearch}) => {

  const [search, setsearch] = useState("")
  const [searchResult, setsearchResult] = useState([])
  
  let getSearchedUsers = async (debounce)=>{
    let res = await fetch(`/api/searchUers?name=${encodeURIComponent(debounce)}`)
      let data = await res.json()
      if (res.status === 200){

        setsearchResult(data.users)
      }else{
        setsearchResult(null)
      }
      
    }
    
    let debounce = useDebounce(200,search)
    useEffect(() => {
      if (debounce){
        getSearchedUsers(debounce)
      }
    }, [debounce])
    
  console.log(searchResult)
  return (
    <div

    className={`absolute  p-4   z-50 w-full   ${openfriendSearch ? "-left-0 opacity-100" : "-left-[100%] opacity-0 "} bg-black/100 duration-400  top-0 bottom-0`}>

      <div className='flex justify-between  items-center gap-1.5 p-1.5 '>
        <h1 className='font-bold text-2xl text-gray-300'>Add Friends</h1>
        <button onClick={()=>setopenfriendSearch(false)} className='p-1 rounded-full  duration-100 hover:bg-indigo-800'>
          <X className='text-indigo-400' />
        </button>
      </div>
      <div className={`flex items-center before:content-[""] relative  ${openfriendSearch && "before:bottom-0 group before:left-0 before:absolute before:w-full"}  before:size-[0.7px] before:transition-all before:duration-1000 before:bg-blue-800 gap-2.5 mt-3.5 px-2 py-2 transition-all duration-200   rounded-lg `}>

        <input
          placeholder='Search for friends'
          type='text'
          
        onChange={(e)=>setsearch(e.target.value)}
          className='border-none placeholder:text-indigo-100 placeholder:text-[1rem] text-indigo-50 outline-none w-full bg-transparent'
        />

      </div>
      {search.length > 0 ? 
     
      searchResult.length === 0 ? <div>
        Loading...
      </div> :
      <div className='mt-4'>

      {searchResult?.map((user)=>{
        return <SearchedUsers key={user.id} user={user} setsearchResult={setsearchResult} searchResult={searchResult}  />
      })}
      </div>
     
       :  
      <div className='mt-14  flex-col   flex items-center gap-2'>
      <h1 className='text-2xl font-stretch-normal text-indigo-500'>Search for friends</h1>
      <UserSearch className='text-blue-400 size-20 mt-7' />
      </div>
}
    </div>
  )
})

export default AddFriends