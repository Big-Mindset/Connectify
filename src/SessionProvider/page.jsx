"use client"

import React, { useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import { authStore } from '@/zustand/store'
const Session = ({children,session}) => {
  let {setsession} = authStore()
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