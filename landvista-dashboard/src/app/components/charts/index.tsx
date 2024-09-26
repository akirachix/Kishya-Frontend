"use client";
import React, { useEffect, useState } from "react";
import ResponseChart from "./charts";

const Feedback = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("api/responses", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        console.log("Response status:", response.status);
        if (!response.ok) {
        }
        const result = await response.json();
        console.log("Fetched data:", result);
        setData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center w-full p-8 bg-white">
      <h1 className="text-4xl font-bold mb-8">User Feedback</h1>
      <div className="w-full max-w-6xl">
  
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Filter metrics by:</h2>
          <div className="flex space-x-4">
            <button className="bg-[#CC8C6B] text-white px-8 py-2 rounded-full text-lg hover:bg-[#3e7882] transition">
              Daily
            </button>
            <button className="bg-[#CC8C6B] text-white px-8 py-2 rounded-full text-lg hover:bg-[#3e7882] transition">
              Weekly
            </button>
            <button className="bg-[#CC8C6B] text-white px-8 py-2 rounded-full text-lg hover:bg-[#3e7882] transition">
              Monthly
            </button>
          </div>
        </div>
        <div className="flex space-x-8">
          
          <div className="flex-grow py-8">
            <div className="h-[400px] bg-white border border-gray-200 rounded-lg shadow-md p-4">
              <ResponseChart />
            </div>
          </div>


          <div className="w-64 py-36">
            <div className="p-8 border-4 border-[#CC8C6B] rounded-[20px] bg-gray-100 ml-24 w-full">
              <h3 className="text-2xl font-bold mb-4">Overview</h3>
              <p className="text-[#1D9CB4] text-lg font-semibold mb-2">
                Top issues identified
              </p>
              <p className="text-[#CC8C6B] text-lg mb-1">Slow response time</p>
              <p className="text-[#D86464] text-lg">Difficult UI</p>
            </div>
          </div>
        </div>
        {data && (
          <div className="mt-8">
            <h2>Fetched Data:</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
