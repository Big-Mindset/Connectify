import Avatar from "@/assets/Avatar.webp"
import { groupstore } from '@/zustand/groupStore'
import { authstore } from '@/zustand/store'
import Image from 'next/image'

const GroupUsers = () => {

  const setSelected = authstore.use.setSelected();
  const setselectedGroup = groupstore.use.setselectedGroup();
  const selectedGroup = groupstore.use.selectedGroup();
  const groups = groupstore.use.groups();
  const setselectedInfo = authstore.use.setselectedInfo();

  let handlegroupUser = (group) => {

    setselectedGroup(group)
    setSelected(null)
    setselectedInfo(null)

  }

  let getTime = (createdAt) => {
    let time = new Date(createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    })
    return time
  }
  return (
    <div className="space-y-2 p-2">
      {groups?.length === 0 ? (
        <div className="py-12 text-center  dark:text-indigo-300">Groups not found</div>
      ) : (
        groups?.map((group, index) => (
          <div
            key={group.id}

            onClick={() => handlegroupUser(group)}

            style={{ animationDelay: `${index * 75}ms` }}
            className="animate-fade-in-up  opacity-0 [animation-fill-mode:forwards]"
          >
            <div
              className={` flex ${selectedGroup?.id === group.id ? "bg-gradient-to-r from-gray-200 to-gray-200 dark:from-blue-700/30 dark:to-blue-500/40" : "dark:hover:from-[#2c356b]   dark:hover:to-[#372c64] bg-gradient-to-r hover:from-gray-200 hover:to-gray-200 "} transform  items-center justify-between gap-3 rounded-xl   p-3 transition-all duration-300 `}>
              <div className="flex items-center gap-3 flex-1">

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
                <div className="flex-1">
                  <h3 className=" dark:text-indigo-100 text-black transition-colors">
                    {group.name}
                  </h3>
                  {group?.groupsMessages?.length > 0 ? <p className="font-light text-[0.9rem] text-gray-800 dark:text-gray-200">
                    {group?.groupsMessages[0]?.content}
                  </p> :

                    <p className="line-clamp-1   text-[0.8rem] text-black/60 dark:text-indigo-300/80">
                      {group.description}
                    </p>
                  }
                </div>
              </div>
              {group?.groupsMessages?.length > 0
                &&
                  <span className="font-light text-[0.7rem] text-gray-700  dark:text-gray-200">{getTime(group?.groupsMessages[0]?.createdAt)}</span>
              
                }
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default GroupUsers