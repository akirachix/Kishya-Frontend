"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { FaTachometerAlt, FaBullseye, FaThumbsUp, FaUserCircle } from 'react-icons/fa';
import Image from 'next/image';


const SidebarNav = () => {
 const router = useRouter();


 const SidebarItem = ({ Icon, label, path, isActive }: { Icon: React.ElementType, label: string, path: string, isActive: boolean }) => (
   <li
     onClick={() => router.push(path)}
     className={`flex items-center p-2 rounded-lg cursor-pointer ${isActive ? 'text-[#CB6A43] font-bold' : 'text-white hover:text-[#CB6A43] transition-colors duration-200'} text-lg`}
   >
     <Icon className="mr-3" size={24} />
     <span className="font-bold text-lg">{label}</span>
   </li>
 );


 return (
   <div className="w-64 h-screen bg-[#006E6D] text-white p-6 flex flex-col justify-between">
     <div>
       <div className="flex flex-col items-center mb-8">
         <Image src="/media/landvista-logo.png" alt="LandVista Logo" width={100} height={100} className="h-auto" />
         <span className="mt-2 text-2xl font-bold">LANDVISTA</span>
       </div>


       <nav>
         <ul className="space-y-6">
           <SidebarItem Icon={FaTachometerAlt} label="Dashboard" path="/" isActive={true} />
           <SidebarItem Icon={FaBullseye} label="Data Accuracy" path="/data-accuracy" isActive={false} />
           <SidebarItem Icon={FaThumbsUp} label="User Feedback" path="/user-feedback" isActive={false} />
         </ul>
       </nav>
     </div>


     <div>
       <ul className="space-y-6">
         <SidebarItem Icon={FaUserCircle} label="Profile" path="/profile" isActive={false} />
       </ul>
     </div>
   </div>
 );
};


export default SidebarNav;


