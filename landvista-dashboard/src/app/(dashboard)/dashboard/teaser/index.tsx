"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const SplashScreen = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setShowSplash(false);
      }, 1000); 
    }, 2000); 
    return () => clearTimeout(timer);
  }, []);
  if (!showSplash) return null;
  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-white transition-opacity duration-1000 ease-in-out ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative w-full h-full">
        <div className="absolute top-0 left-0 w-full h-1/3">
          <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="h-full w-full">
            <path
              d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,0.00 L0.00,0.00 Z"
              className="fill-[#008080]"
            ></path>
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 transform rotate-180">
          <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="h-full w-full">
            <path
              d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,0.00 L0.00,0.00 Z"
              className="fill-[#008080]"
            ></path>
          </svg>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-[78px] font-bold text-[#CB6A43] mb-10 font-poppins">LandVista Dashboard</h1>
          <div className="relative w-48 h-48"> 
          <Image
           src="/media/landvista-logo copy.png"
           alt="LandVista Logo"
           layout="fill"
           objectFit="contain"
           />
</div>
        </div>
      </div>
    </div>
  );
};
export default SplashScreen;