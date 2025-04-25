import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-[#1c173f] flex items-center justify-center space-x-6 p-6 '>
        <Link href='#dashboard' className='text-[#868686] hover:text-gray-400 underline'>Dashboard</Link>
        <Link href='#templates' className='text-[#868686]  hover:text-gray-400 underline'> Templates</Link>
        <Link href='#resources' className='text-[#868686]  hover:text-gray-400 underline'>Resources</Link>
    </footer>
  )
}

export default Footer
