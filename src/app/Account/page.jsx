"use client"
import { authstore } from '@/zustand/store'
import axios from 'axios'
import { Save, User, FileText, Camera, Sparkles, X } from 'lucide-react'
import { useSession } from "next-auth/react"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

const page = () => {
  let session = useSession()
  const setsession = authstore.use.setsession()
  const [avatars, setavatars] = useState([])
  const [userData, setuserData] = useState({
    name: "",
    avatar: "",
    bio: ""
  })

  const [showAvatars, setShowAvatars] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const fileref = useRef()

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setuserData(prev => ({ ...prev, avatar: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const getAvatars = async () => {
    const avatarNames = ["Jude", "Jameson", "Eden", "Leah", "Valentina", "Christian", "Andrea", "Christopher", "Brooklynn", "Jocelyn", "Jessica", "Riley", "Katherine", "Oliver", "Liam", "Eliza", "Kingston", "Maria", "Mackenzie", "Robert"]
    const avatarUrls = avatarNames.map(name =>
      `https://api.dicebear.com/9.x/avataaars/png?seed=${name}`
    )
    setavatars(avatarUrls)
  }

  useEffect(() => {
    getAvatars()
  }, [])
  useEffect(() => {

    setuserData(prev => {
      return { ...prev, name: session?.user?.name ?? "", avatar: session?.user?.image ?? "", bio: session?.user?.bio ?? "" }
    })
  }, [session.status])
  console.log(session);
  
  const handleAvatarSelect = (avatarUrl) => {
    setuserData(prev => ({ ...prev, avatar: avatarUrl }))
    setShowAvatars(false)
  }

  const handleInputChange = (field, value) => {
    setuserData(prev => ({ ...prev, [field]: value }))
  }
  let { update } = useSession()
  const handleSave = async () => {
    if (!userData.bio || !userData.avatar || !userData.name) return
      console.log(session);
      
    try {
      setIsLoading(true)
      const res = await axios.put("api/updateProfile", {
        id: session?.user?.id,
        name: userData.name,
        bio: userData.bio,
        avatar: userData.avatar,
        isCompleted: true

      })

      if (res.status === 200) {
        let data = {
          name: userData.name,
          bio: userData.bio,
          image: userData.avatar,
          isCompleted: true
        }
        setsession({
          ...session,user : {...session.user , ...data}
        })
        update(data)
        router.push("/")
      }
    } catch (error) {
      console.log(error);
      
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = (userData?.bio?.trim() && userData.avatar && userData.name.trim())
  let isSame = (userData?.bio?.trim() === session?.user?.bio && userData.avatar === session?.user?.image && userData.name.trim() === session?.user?.name)
  return (
    <div
      className="min-h-screen"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-#70B8FF via-#3B9EFF to-#0090FF bg-clip-text text-transparent mb-3">
            Complete Your Profile
          </h1>
        </div>

        <div className="max-w-2xl mx-auto">
          <div
            className="rounded-3xl overflow-hidden "
          >

            <div className="px-8 py-8 ">
              <div className="flex flex-col items-center">

                <div className="relative group mb-6">
                  <div
                    className="w-32 h-32 rounded-full border-blue-500 border overflow-hidden relative"
                  
                  >
                    {userData.avatar ? (
                      <Image
                        src={userData.avatar}
                        alt="Profile Avatar"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-12 h-12 text-#C2E6FF" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center cursor-pointer rounded-full">
                      <Camera className="w-6 h-6 text-white mb-1" />
                      <span className="text-xs text-white font-medium">Change</span>
                    </div>

                    <input
                      type="file"
                      ref={fileref}
                      onChange={handleChange}
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setShowAvatars(!showAvatars)}
                  className="px-6 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center gap-2 border border-#2870BD/50 hover:border-#0090FF"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-white">Choose Avatar</span>
                </button>
              </div>
            </div>

            {showAvatars && (
              <div className="px-8 py-6 ">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-#C2E6FF flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-#0090FF" />
                    Select Avatar
                  </h3>
                  <button
                    onClick={() => setShowAvatars(false)}
                    className="p-1 hover:bg-#104D87/30 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-#C2E6FF" />
                  </button>
                </div>

                <div className="grid grid-cols-6 gap-1 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-#2870BD scrollbar-track-transparent">
                  {avatars.map((avatar, index) => (
                    <button
                      key={index}
                      onClick={() => handleAvatarSelect(avatar)}
                      className="w-16 h-16 rounded-full overflow-hidden border-2 border-transparent hover:border-#0090FF hover:scale-105 transition-all duration-200"
                      style={{
                        boxShadow: '0 4px 12px rgba(0, 144, 255, 0.1)'
                      }}
                    >
                      <Image
                        src={avatar}
                        alt={`Avatar ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="px-8  space-y-6">

                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-full outline-none  shadow-[0_0_1px_0.3px_gray] focus:ring-2 ring-blue-400 transition-all duration-300 text-white placeholder-#C2E6FF/50"
                  style={{
                    background: `linear-gradient(135deg, rgba(16, 77, 135, 0.3) 0%, rgba(32, 93, 158, 0.2) 100%)`,
                    backdropFilter: 'blur(10px)'
                  }}
                />

          
                <div className="relative">
                  <textarea
                    value={userData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    maxLength={200}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg shadow-[0_0_1px_0.3px_gray] outline-none  focus:ring-2 ring-blue-400 transition-all duration-300 resize-none text-white placeholder-#C2E6FF/50"
                    style={{
                      background: `linear-gradient(135deg, rgba(16, 77, 135, 0.3) 0%, rgba(32, 93, 158, 0.2) 100%)`,
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-#C2E6FF/60">
                    {userData.bio.length}/200
                  </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => setuserData({ name: session?.user?.name, avatar: session?.user?.image, bio:session?.user?.bio})}
                  disabled={!isSame &&!isFormValid}
                  className="flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300  text-#C2E6FF hover:bg-#104D87/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset
                </button>

                <button
                  onClick={handleSave}
                  disabled={isSame || !isFormValid || isLoading}
                  className="flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 text-white disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: isFormValid
                      ? `linear-gradient(135deg, #2870BD 0%, #0090FF 50%, #3B9EFF 100%)`
                      : '#104D87',
                    boxShadow: isFormValid
                      ? '0 8px 25px rgba(0, 144, 255, 0.35)'
                      : 'none'
                  }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Profile</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page