import Avatar from "@/assets/Avatar.webp"
import SearchIcon from "@/assets/Search.svg"
import { groupstore } from "@/zustand/groupStore"
import { authstore } from "@/zustand/store"
import Image from "next/image"
  const ChatNav = () => {
const selectedInfo = authstore.use.selectedInfo();
const selectedGroup = groupstore.use.selectedGroup();

    
    return (
        <nav className="sticky  left-0 top-0 right-0 border-b-[1px] border-white/20">
            <div className={`flex  justify-between gap-2 w-full bg-[#2D1A47]  py-2.5  transition-all duration-200 px-5   items-center`}>
                <div className='flex gap-2 flex-1/6'>

                    <div className='rounded-full overflow-hidden size-14 border-2 border-indigo-500/30'>
                        <Image 
                            src={selectedInfo?.avatar || selectedGroup?.images || Avatar}
                            alt='User'
                            width={100}
                            height={100}
                            className='object-cover'
                        />
                    </div>

                    <div className='flex justify-center flex-col'>
                        <h2 className='text-[1rem] font-medium text-indigo-50'>{selectedInfo?.name || selectedGroup?.name}</h2>
                        <p className='flex gap-1 items-center'>
                            <span className='text-indigo-300/50 text-sm'>last seen 1AM</span>
                          </p>
                    </div>

                </div>
                <div className='flex flex-1 bg-[#000427] items-center gap-2.5 px-2 py-1.5 transition-all duration-200 focus-within:ring-2 ring-indigo-500/50 rounded-lg '>
                    <Image   src={SearchIcon} alt='Search' className='filter invert-[0.7]' />
                    <input
                    onChange={((e)=>handleSearch(e))}
                        placeholder='Search Messages'
                        type='text'
                        className='border-none placeholder:text-indigo-400/80 placeholder:font-[14px]  text-indigo-50 outline-none w-full bg-transparent'
                    />
                </div>
            </div>
        </nav>
    )
}

export default ChatNav