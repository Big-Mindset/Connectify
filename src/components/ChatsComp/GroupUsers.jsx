import Avatar from "@/assets/Avatar.webp"
import { groupstore } from '@/zustand/groupStore'
import { authstore } from '@/zustand/store'
import Image from 'next/image'

const GroupUsers = () => {
  
const setSelected = authstore.use.setSelected();
const setselectedGroup = groupstore.use.setselectedGroup();
const selectedGroup = groupstore.use.selectedGroup();
const groups = groupstore.use.groups();


  
    
  return (
    <div className="space-y-2 p-2">
      {groups === null ? (
        Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="flex animate-pulse items-center gap-4 p-3">
            <div className="h-14 w-14 rounded-full bg-indigo-900/50" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-indigo-900/50" />
              <div className="h-3 w-48 rounded bg-indigo-900/30" />
            </div>
          </div>
        ))
      ) : groups?.length === 0 ? (
        <div className="py-12 text-center text-indigo-300">No groups found</div>
      ) : (
        groups?.map((group, index) => (
          <div 
            key={group.id}
     
     onClick={()=>{setselectedGroup(group)
       setSelected(null)}
      }
            style={{ animationDelay: `${index * 75}ms` }}
            className="animate-fade-in-up  opacity-0 [animation-fill-mode:forwards]"
          >
            <div 
            className={` flex ${selectedGroup?.id === group.id ? "border-indigo-900/70 bg-indigo-900/80" : "hover:bg-indigo-800/40 group hover:shadow-lg hover:shadow-indigo-900/20 border-indigo-900/30 bg-indigo-900/20"} transform  items-center justify-between gap-3 rounded-xl border  p-3 transition-all duration-300 `}>
              <div className="flex items-center gap-3">
                <div className="relative transition-transform duration-300 group-hover:scale-105">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-700/30 to-purple-500/30 opacity-0 transition-opacity group-hover:opacity-100" />
                  <Image
                    src={group.image || Avatar}
                    alt={group.name}
                    width={56}
                    height={56}
                    className="rounded-full border-2 border-indigo-800/50 object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-indigo-100 transition-colors group-hover:text-white">
                    {group.name}
                  </h3>
                  <p className="line-clamp-1 text-sm text-indigo-300/80">
                    {group.description || "No description"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-indigo-900/30 px-3 py-1 text-sm text-indigo-300">
                  {group.members_count} members
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default GroupUsers