"use client"

import React, { useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import { authstore } from '@/zustand/store'
const Session = ({children,session}) => {
  let setsession =  authstore.use.setsession()
  useEffect(() => {
    setsession(session)
  }, [session])
  return (
    <SessionProvider>
        {children}
    </SessionProvider>
  )
}

export default Session