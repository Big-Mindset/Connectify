import React from 'react';
import { motion } from "framer-motion";
import {  useRouter } from 'next/navigation';
import { Users, Users2, UserSquare } from 'lucide-react';
const MoreOption = () => {
   let route = useRouter()
    let handleNavigate = (prop)=>{
    route.push(prop)
}
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 450, opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className='absolute  top-14 overflow-hidden w-[300px] z-50 right-0 bg-violet-300 backdrop-brightness-100  p-3 rounded-xl shadow-xl border border-violet-100'
    >
      <div className='flex flex-col gap-1'>
        <button onClick={()=>handleNavigate("Profile")} className="flex items-center gap-3 p-3 hover:bg-violet-50 rounded-lg transition-all duration-200">
          <div className="text-violet-600 bg-violet-100 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-left">
            <span className="font-medium text-gray-800">User Profile</span>
            <p className="text-xs text-gray-500">Manage your account</p>
          </div>
        </button>
        
        <button  className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition-all duration-200">
          <div className="text-blue-600 bg-blue-100 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
          <div className="text-left">
            <span className="font-medium text-gray-800">Create Group</span>
            <p className="text-xs text-gray-500">Start a new conversation</p>
          </div>
        </button>
        
        <button onClick={()=>handleNavigate("settings")} className="flex items-center gap-3 p-3 hover:bg-purple-50 rounded-lg transition-all duration-200">
          <div className="text-purple-600 bg-purple-100 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-left">
            <span className="font-medium text-gray-800">Settings</span>
            <p className="text-xs text-gray-500">Configure preferences</p>
          </div>
        </button>
        
        <button className="flex items-center gap-3 p-3 hover:bg-violet-50 rounded-lg transition-all duration-200">
          <div className="text-indigo-600 bg-indigo-100 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-left">
            <span className="font-medium text-gray-800">Archive</span>
            <p className="text-xs text-gray-500">View archived items</p>
          </div>
        </button>
        
        <button className="flex items-center gap-3 p-3 hover:bg-red-50 rounded-lg transition-all duration-200 mt-1">
          <div className="text-green-500 bg-indigo-100 p-2 rounded-lg">
            <UserSquare />
          </div>
          <div className="text-left">
            <span className="font-medium text-gray-800">Add Users</span>
            <p className="text-xs text-gray-500">You can add users using their username</p>
          </div>
        </button>
    
      </div>
    </motion.div>
  )
}

export default MoreOption;