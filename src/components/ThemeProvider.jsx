"use client"
import { ThemeProvider } from 'next-themes'
import { useEffect } from 'react'


const Themeprovider = ({children}) => {
  let theme ;
  useEffect(()=>{
    if (window !== undefined){

       theme = localStorage.getItem("theme")
    }
  })
  return (
    
    <ThemeProvider
    attribute="class"
    defaultTheme={theme ? theme : "dark"}
    enableSystem    
    disableTransitionOnChange
    >{children}</ThemeProvider>
  )
}

export default Themeprovider