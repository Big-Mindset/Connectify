import React, { useEffect, useRef, useState } from 'react';
import images from '@/image';
import Image from 'next/image';
import { groupValidate } from '@/zod/groupSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { authStore } from '@/zustand/store';
import { LoaderCircle } from 'lucide-react';
import axios from 'axios';
import { groupStore } from '@/zustand/groupStore';
export default function UserCardDialog({GroupUsersSelect , setOpen,setGroupUsersSelect}) {
  let {loading,setLoading,socket} = authStore()
  let {getGroup,groups} = groupStore()
  let {register,handleSubmit,formState : {errors}} = useForm({
     
    resolver : zodResolver(groupValidate),
    defaultValues : {
      name : "",
      description : ""
    }
  })
  let containerRef = useRef()
  let handleWheel= (e)=>{
    if (containerRef.current){
      e.preventDefault()
      containerRef.current.scrollLeft +=e.deltaY - 40
    }
  }


  console.log(GroupUsersSelect);


  let CreateGroup = async (data) => {
    setLoading(true)
    
    try {
      let res = await axios.post("/api/create-group", {...data,userIds : GroupUsersSelect.map(user=>user.id)})
      
      if (res.status === 201) {
        toast.success(res.data.message)
        setOpen(false)
        setGroupUsersSelect([])
        getGroup()
        let groupId = res?.data?.groupId
        socket.emit("join-to-group",groupId,GroupUsersSelect.map(user=>user.id))

      }
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error(error?.response?.data?.message)
      } else if (error?.response?.status === 404) {
        toast.error(error.response.data.message)
        
        toast.error(error?.response.data.message)
        
      } else {
        toast.error(error?.response?.data?.message)

        
      }
    }finally{

      setLoading(false)
    }
  }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form 
      onSubmit={handleSubmit(CreateGroup)}
      className="bg-[#1A1035] rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-indigo-200">Create Group</h2>
        </div>
        { errors &&

          <p className='text-red-600 text-center'>
          {errors.description && errors.description.message || errors.name && errors.name.message}
        </p>
        }

 <div 
      className={`flex  bg-[#3A2466]  justify-between gap-2 w-full mb-3 pb-3 border-indigo-600    
    px-2.5  transition-all duration-200  p-1.5 items-center`}>
      <div className='flex gap-2'>
        <div className='relative'>
        <div className='rounded-full  overflow-hidden size-14 border-2 border-indigo-500/30'>
          <Image
            src={images.Avatar}
            alt='User'
            width={100}
            height={100}
            className='object-cover'
            />
        </div>
          <div className='absolute bottom-1 bg-blue-400 p-1 rounded-xl hover:bg-blue-500 right-0.5 size-4'>
            <Image src={images.ImageCLip} alt="Choose Image" width={80} height={80} />
          </div>
            </div>

        <div className='flex justify-center w-[300px]  flex-col'>
          <input 
          placeholder='Add group Name' 
          
          {...register("name")}
          name='name'
          className='text-[1rem] font-medium outline-none text-indigo-50' />
          <input 
          {...register("description")}
          name='description'
          placeholder='best group  Ever' 
          className='flex gap-1 outline-none text-[0.8rem] text-indigo-300/70 line-clamp-1 items-center'/>
        </div>

      </div>
    </div>
    <h1 className='text-xl font-bold mb-1 text-white'>Added Users</h1>
  <div className=' rounded-2xl  p-1  mb-2.5'  >
    <div onWheel={handleWheel} ref={containerRef} className='mb-2 flex  overflow-x-auto scroll-1 p-1.5 gap-2.5 items-center w-full'>
  {/* Multiple avatars */}
  {GroupUsersSelect.map((item) => (
    
    <div key={item.id} className='flex-shrink-0 rounded-full overflow-hidden size-14 border-2 border-indigo-500/30'>
      <Image
        src={item.image}
        alt='User'
        width={100}
        height={100}
        className='object-cover w-full h-full'
      />
    </div>
  ))}
</div>
  </div >

    <div className='flex gap-1.5'>


        <button onClick={()=>setOpen(false)} type='button' className="w-full py-2 bg-indigo-600/30 hover:bg-indigo-600/40 rounded-xl text-white font-medium">
          Cancel
        </button>
        <button disabled={loading}  type='submit' className="w-full py-2 hover:to-indigo-800 duration-75 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white font-medium">
          {loading ? <LoaderCircle className='ease-in-out animate-spin  mx-auto' /> : "Add Group"}
        </button>
    </div>
 
  </form>
</div>
  );
}
