"use client"
import { ThemeProvider } from 'next-themes'


const Themeprovider = ({children}) => {

  return (
    
    <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem    
    disableTransitionOnChange
    >{children}</ThemeProvider>
  )
}

export default Themeprovider