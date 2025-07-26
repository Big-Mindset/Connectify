"use client"


import { Roboto } from 'next/font/google';
import ChatList from '@/components/ChatsComp/ChatList';
import ChatMain from '@/components/ChatsComp/ChatMain';
import AddFriends from '@/components/AddFriends';
import SocketLogic from '@/lib/SocketLogic';
import { useState } from 'react';
import { groupstore, groupStore } from '@/zustand/groupStore';
import { authstore } from '@/zustand/store';
const roboto = Roboto({
  weight: ["400","700"],
  subsets: ["latin"]
});

const Page = () => {
  
      const selectedGroup = groupstore.use.selectedGroup()
      const Selected = authstore.use.Selected()
  
        const [openfriendSearch, setopenfriendSearch] = useState(false)

    SocketLogic()
  return (
<div className={`h-[calc(100%-20px)] pt-3.5 flex justify-center ${roboto.className}`}>
  <div className='rounded-xl overflow-hidden flex w-full max-w-[90%]   backdrop-blur-lg border border-indigo-900/50 bg-gradient-to-br from-[#0F0A1F] to-[#1A1433]'>

    <div className='basis-1/3 relative bg-[#1A1433]/95 p-3 border-r border-indigo-900/30'>
      
       
       {openfriendSearch ? <AddFriends  setopenfriendSearch= {setopenfriendSearch} />  :<ChatList setopenfriendSearch= {setopenfriendSearch}  /> }
    </div>

    {Selected || selectedGroup ? (
      <ChatMain />
    ) : (
      <div>
        
      </div>
    )}
  </div>
</div>

  )
}

export default Page