import useDebounce from '@/lib/useDebounce'
import {UserSearch, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import SearchedUsers from './SearchedUsers'

const AddFriends = React.memo(({setopenfriendSearch,openfriendSearch}) => {

  const [search, setsearch] = useState("")
  const [searchResult, setsearchResult] = useState([])
  const [loading, setloading] = useState(false)
  let getSearchedUsers = async (debounce)=>{
    setloading(true)
    let res = await fetch(`/api/searchUers?name=${encodeURIComponent(debounce)}`)
      let data = await res.json()
      console.log(data);
      
      if (res.status === 200){

        setsearchResult(data.users)
      }else{
        setsearchResult([])
      }
      setloading(false)
    }
    
    let debounce = useDebounce(200,search)
    useEffect(() => {
      if (debounce){
        getSearchedUsers(debounce)
      }
    }, [debounce])
    console.log(!loading , !search);
    
  return (
    <div
    
    className={`absolute  p-4   z-50 w-full   ${openfriendSearch ? "-left-0 opacity-100" : "-left-[100%] opacity-0 "} dark:bg-[#0D1520] bg-gray-200 duration-400  top-0 bottom-0`}>

      <div className='flex justify-between  items-center gap-1.5 p-1.5 '>
        <h1 className='font-bold text-2xl dark:text-gray-200 text-black'>Add Friends</h1>
        <button onClick={()=>setopenfriendSearch(false)} className='p-1 rounded-full hover:bg-gray-300 cursor-pointer duration-100 dark:hover:bg-indigo-800'>
          <X className='dark:text-indigo-400 text-gray-600' />
        </button>
      </div>
      <div className={`flex items-center before:content-[""] relative  ${openfriendSearch && "before:bottom-0 group before:left-0 before:absolute before:w-full"}  before:size-[0.7px] before:transition-all before:duration-1000 before:bg-blue-800 gap-2.5 mt-3.5 px-2 py-2 transition-all duration-200   rounded-lg `}>

        <input
          placeholder='Search for friends'
          type='text'
          
        onChange={(e)=>setsearch(e.target.value)}
          className='border-none dark:placeholder:text-indigo-100 placeholder:text-black/70 placeholder:text-[1rem] dark:text-indigo-50 text-black/90 outline-none w-full bg-transparent'
        />

      </div>
  
      <div className='mt-4'>
      {loading ? <div className='flex justify-center items-center '>
      Loading...
     </div> : 
     <>
      {(searchResult?.length === 0 && search) ? <div>No Users found </div> : searchResult?.map((user)=>{
        return <SearchedUsers key={user.id} user={user} setsearchResult={setsearchResult} searchResult={searchResult}  />
      })}
      
      </>
    }
      </div>
     
       {
         (!loading && !search ) &&
         <div className='mt-14  flex-col   flex items-center gap-2'>
      <h1 className='text-2xl font-stretch-normal text-black dark:text-[#70B8FF]'>Search for friends</h1>
      <UserSearch className='dark:text-blue-400 text-black/70 size-20 mt-7' />
      </div>
      }
      
    </div>
  )
})

export default AddFriends