"use client";
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import {
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   ResponsiveContainer,
   LabelList,
} from 'recharts';


const DATA = [
   { location: 'Mathare', percentage: 55 },
   { location: 'Dandora', percentage: 45 },
   { location: 'Karen', percentage: 35 },
   { location: 'Kileleshwa', percentage: 30 },
   { location: 'Kilimani', percentage: 25 }
];


interface MetricCardProps {
   value: string;
   label: string;
}


const Card: React.FC<React.PropsWithChildren> = ({ children }) => (
   <div className="inline-flex border-2 border-teal-600 rounded-lg overflow-hidden">
       {children}
   </div>
);


const MetricCard: React.FC<MetricCardProps> = ({ value, label }) => (
   <Card>
       <div className="p-1">
           <div className="text-lg font-bold text-center whitespace-nowrap">{value}</div>
           <div className="text-xs text-gray-500 text-center whitespace-nowrap">{label}</div>
       </div>
   </Card>
);


const Dashboard = () => {
   const [data, setData] = useState(DATA);
   const [loading, setLoading] = useState(false);


   return (
       <Layout>
           <div className="flex-1 p-8 bg-gray-100 ml-56">
               <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                   <div className="lg:col-span-2">
                       <div className="bg-white p-4 rounded-lg shadow-lg">
                           <h3 className="text-xl font-bold mb-4">Wards with the leading floods probability in Nairobi</h3>
                           <ResponsiveContainer width="100%" height={400}>
                               <BarChart data={data} margin={{ top: 20, right: 30, left: 60, bottom: 50 }}>
                                   <CartesianGrid strokeDasharray="3 3" />
                                   <XAxis
                                       dataKey="location"
                                       axisLine={false}
                                       tickLine={false}
                                       label={{ value: 'Location', position: 'insideBottom', offset: -10, fill: 'black' }}
                                       tick={false}
                                   />
                                   <YAxis
                                       domain={[0, 60]}
                                       label={{ value: 'Risk Percentage', angle: -90, position: 'insideLeft', fill: 'black' }}
                                   />
                                   <Bar dataKey="percentage" fill="#3b82f6">
                                       <LabelList
                                           dataKey="percentage"
                                           position="top"
                                           fill="#3b82f6"
                                           formatter={(value: number) => `${value}%`}
                                       />
                                       <LabelList
                                           dataKey="location"
                                           position="center"
                                           fill="white"
                                           angle={-90}
                                           offset={0}
                                           style={{ fontSize: '12px' }}
                                       />
                                   </Bar>
                               </BarChart>
                           </ResponsiveContainer>
                       </div>
                   </div>
                   <div className="bg-white p-4 rounded-[30px] shadow border-2 border-custom-orange w-full sm:w-[300px] xl:h-[500px] font-poppins">
                       <h2 className="font-bold mb-2 text-black text-xl">Overview</h2>
                       <p className="text-lg text-black leading-snug pb-4 nesthubmax:text-sm nesthubmax:pb-5 nesthubmax:w-[500px]">
                           The dashboard offers a clear view of key metrics: total downloads,
                           reflecting the application's adoption rate; shares, indicating how often
                           users recommend or distribute the app; and user feedback, summarized
                           through ratings and comments.
                       </p>
                   </div>
               </div>
               <div className="mt-6 flex justify-center lg:justify-start ml-8">
                   <button className="bg-custom-orange text-white px-4 py-2 rounded-lg mr-4">Daily</button>
                   <button className="bg-custom-orange text-white px-4 py-2 rounded-lg">Monthly</button>
               </div>
               <div className="flex flex-wrap gap-4 ml-1 p-4">
                   <MetricCard value="10" label="Downloads" />
                   <MetricCard value="12" label="Search Success Rate" />
               </div>
           </div>
       </Layout>
   );
};


export default Dashboard;