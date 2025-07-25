import  { useEffect, useState } from 'react'

const useDebounce = (delay , input) => {
    const [searchValue, setsearchValue] = useState("")
    useEffect(() => {
        let timeout = setTimeout(()=>{
            setsearchValue(input)
           
        },delay)
        return () => clearTimeout(timeout)
    }, [input,delay])
    return searchValue
}

export default useDebounce