"use client"

import React, { useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import { authstore } from '@/zustand/store'
import { addsession, getsession } from '@/database/indexdb'

const Session = ({children,session}) => {
  
  let setsession =  authstore.use.setsession()
  let getsessionfunc = async ()=>{
    let isCatched = await getsession()
    if (isCatched && isCatched?.user) {
      setsession(isCatched)
     return
    }
    if (session !== null){
      setsession(session)
      await addsession(session)
    }
  }
  useEffect(() => {
    getsessionfunc()
  }, [session])
  return (
    <SessionProvider>
        {children}
    </SessionProvider>
  )
}

export default Session