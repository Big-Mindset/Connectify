"use client"


import { useTheme } from 'next-themes';
import React, { useEffect } from 'react'

const AddsystemTheme = () => {
    let {setTheme} = useTheme()
    useEffect(() => {

        setTheme("system");
      }, []);
  return (
    <div></div>
  )
}

export default AddsystemTheme