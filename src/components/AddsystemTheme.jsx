"use client"


import { useTheme } from 'next-themes';
import React, { useEffect } from 'react'

const AddsystemTheme = () => {
    let {setTheme} = useTheme()
    useEffect(() => {
      let theme = localStorage.getItem("theme")
      

        setTheme(theme ? theme : "dark");
      
      }, []);
  return (
    <div></div>
  )
}

export default AddsystemTheme