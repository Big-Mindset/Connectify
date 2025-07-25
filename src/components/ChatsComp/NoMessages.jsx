import images from '@/image'
import Image from 'next/image'
import React from 'react'

const NoMessages = () => {
  return (
    <div className='flex-1 flex flex-col mt-48   backdrop-blur-lg'>
        <div className='flex-1 flex flex-col items-center justify-center'>
          <div className='flex flex-col items-center gap-4'>
            <Image src={images.properLogo} alt='Logo' width={300} height={100} className='filter brightness-125' />
            <div className='flex gap-3.5 items-center'>
              <h1 className='text-indigo-400 text-4xl font-bold'>No Chats</h1>
              <Image src={images.Sad} alt='Frown' width={45} height={35} className='filter invert-[0.7]' />
            </div>
          </div>
        </div>
        <div className='p-4 text-center'>
          <div className='flex gap-2 items-center justify-center'>
            <span className='text-indigo-400/80 text-sm'>Your privacy is end to end encrypted</span>
            <Image src={images.Tick} alt='Secure' width={20} height={20} className='filter invert-[0.7]' />
          </div>
        </div>
      </div>
  )
}

export default NoMessages