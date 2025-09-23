import React, { useRef, useState } from 'react';
import Avatar from "@/assets/Avatar.webp"
import Image from 'next/image';
import { groupValidate } from '@/zod/groupSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { authstore } from '@/zustand/store';
import { LoaderCircle, X, Users, Type, FileText, Camera } from 'lucide-react';
import { groupstore } from '@/zustand/groupStore';
import api from '@/lib/axiosInstance';

function UserCardDialog({ GroupUsersSelect, setOpen, setGroupUsersSelect }) {
  let [loading , setloading ] = useState()
  const setLoading = authstore.use.setLoading();
  const socket = authstore.use.socket();
  const onlineUsers = authstore.use.onlineUsers();
  const getGroup = groupstore.use.getGroup();

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(groupValidate),
    defaultValues: {
      name: "",
      description: "",
    }
  });
  const [image, setimage] = useState("")
  const watchedName = watch("name");

  const containerRef = useRef();
  
  const handleWheel = (e) => {
    if (containerRef.current) {
      e.preventDefault();
      containerRef.current.scrollLeft += e.deltaY;
    }
  };

  const CreateGroup = async (data) => {
    setloading(true);
      console.log("Creating the group");
        console.log(data);
        console.log(GroupUsersSelect);
        console.log(image);
        
    try {
      let res = await api.post("/create-group", {
        ...data,
        userIds: GroupUsersSelect.map(user => user.id),
        image 
      });
      console.log(res);
      
      
      if (res.status === 201) {
        toast.success(res.data.message);
        setOpen(false);
        setGroupUsersSelect([]);
        getGroup();
        let groupId = res?.data?.groupId;
        socket.emit("join-to-group", groupId, GroupUsersSelect.map(user => user.id));
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error(error?.response?.data?.message);
      }
    } finally {
      setloading(false);
    }
  };
  let inputRef = useRef(null)

  const handleClose = () => {
    setOpen(false);
  };
  let handleChange = (e)=>{
    let files = e.target.files[0]
    if (files){

      let reader = new FileReader()
      reader.onload = ()=>{
        setimage(reader.result)
      }
      reader.readAsDataURL(files)
    }
  }
  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 md:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 md:rounded-3xl shadow-2xl w-full h-full max-w-lg transform animate-in slide-in-from-bottom-4 duration-300">
     
        <div className="flex items-center justify-between md:p-6 p-2.5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create Group
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X className="size-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit(CreateGroup)} className="md:p-6 p-2 space-y-6">
   
          {errors && (errors.name || errors.description) && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-in slide-in-from-top-2 duration-200">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                {errors.name?.message || errors.description?.message}
              </p>
            </div>
          )}

          <div className="flex justify-center">
            <div className="relative group">
              <div className="size-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 p-0.5 shadow-lg">
                <div className="size-full rounded-full overflow-hidden bg-white dark:bg-gray-800">
                  <Image
                    src={image || Avatar}
                    alt="Group Avatar"
                    width={80}
                    height={80}
                    
                    className="size-full object-cover"
                  />
                </div>
              </div>
              <button
              onClick={()=>inputRef.current.click()}
                type="button"
                className="absolute -bottom-1 -right-1 p-1.5 bg-blue-500 hover:bg-blue-600 rounded-xl shadow-lg transition-all duration-200 hover:scale-110"
              >
                <Camera className="size-4 text-white" />
              </button>
              <input 
              ref={inputRef}
              type="file"
              accept='image/*'
              className='hidden'
              onChange={(e)=>(handleChange(e))} />
            </div>
          </div>

          <div className="space-y-4">
     
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Type className="w-4 h-4" />
                Group Name
              </label>
              <input
                {...register("name")}
                placeholder="Enter group name..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <FileText className="w-4 h-4" />
                Description (optional)
              </label>
              <textarea
                {...register("description")}
                placeholder="What's this group about?"
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
              />
            </div>
          </div>

        
          {GroupUsersSelect.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Members ({GroupUsersSelect.length})
                </h3>
              </div>
              
              <div 
                ref={containerRef}
                onWheel={handleWheel}
                className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
              >
                {GroupUsersSelect.map((user, index) => (
                  <div
                    key={user.id}
                    className="flex-shrink-0 flex flex-col items-center gap-2 animate-in slide-in-from-right-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 p-0.5 shadow-md">
                        <div className="w-full h-full rounded-xl overflow-hidden">
                          <Image
                            src={user?.avatar || user.image}
                            alt={user.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      {onlineUsers.includes(user.id) &&
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                      }
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 max-w-12 truncate">
                      {user.name?.split(' ')[0] || 'User'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 md:py-3 py-2 md:px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !watchedName?.trim() || !image}
              className="flex-1 md:py-3 md:px-4 py-2  bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <LoaderCircle className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Create Group
                </>
              )}
            </button>
          </div>

        
        </form>
      </div>
    </div>
  );
}

export default React.memo(UserCardDialog);