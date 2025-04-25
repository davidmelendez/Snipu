"use client";

import { X, Menu } from "lucide-react";
import React, { useState } from 'react';
import Image from 'next/image';
import NavLink from './NavLink';



const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-[#07031299] border-b-[#9339FF1A] text-white w-full font-medium text-sm lg:text-base flex justify-center transition-colors">
      
      <div className="flex flex-col w-[90%] p-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex lg:w-[40%] justify-between">
            <div className='h-10 w-36'>
              <Image src="/images/logo.jpg" className='!relative' alt='logo' fill />
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex space-x-8 items-center justify-between px-2">
              <NavLink href='#dashboard'>Dashboard</NavLink>
              <NavLink href='#templates'> Templates</NavLink>
              <NavLink href='#resources'>Resources</NavLink>
            
            </div>
          </div>
          <div className="hidden md:flex text-white space-x-4">
                <button className='px-4 py-2 rounded-md border-[0.5px] border-white'>
                Connect Wallet
                </button>
                
          </div>

        

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 ml-auto" onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 flex flex-col space-y-4">
            <NavLink href='#dashboard'>Dashboard</NavLink>
            <NavLink href='#templates'> Templates</NavLink>
            <NavLink href='#resources'>Resources</NavLink>
            <div className="flex flex-col md:hidden w-fit text-white space-y-4">
               <button className='px-4 py-2 rounded-md border-[0.5px] border-white'>
                Connect Wallet
                </button>
                
          </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
