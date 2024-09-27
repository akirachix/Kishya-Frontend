"use client";
import React, { useEffect, useState } from "react";
import ResponseChart from "./chart";
import Layout from '../components/Layout';


const Feedback = () => {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("daily");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`api/feedback?filter=${filter}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        console.log("Fetched data:", result);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [filter]);

  const handleFilterChange = (selectedFilter: string) => {
    setFilter(selectedFilter);
  };

  return (
    <div className="flex flex-col items-center w-full p-8 bg-white">
      <h1 className="text-4xl font-bold mb-8">User Feedback</h1>
      <div className="w-full max-w-6xl">
        <div className="mb-8 mr-24">
          <h2 className="text-2xl font-bold mb-4  font-family: 'Poppins'">Filter metrics by:</h2>
          <div className="flex space-x-4">
            <button
              className={`px-6 py-2 rounded-full text-white font-bold ${
                filter === "daily" ? "bg-[#3e7882]" : "bg-[#CC8C6B]"
              } hover:bg-opacity-75`}
              onClick={() => handleFilterChange("daily")}
            >
              Daily
            </button>
            <button
              className={`px-6 py-2 rounded-full text-white font-bold ${
                filter === "weekly" ? "bg-[#3e7882]" : "bg-[#CC8C6B]"
              } hover:bg-opacity-75`}
              onClick={() => handleFilterChange("weekly")}
            >
              Weekly
            </button>
            <button
              className={`px-6 py-2 rounded-full text-white font-bold ${
                filter === "monthly" ? "bg-[#3e7882]" : "bg-[#CC8C6B]"
              } hover:bg-opacity-75`}
              onClick={() => handleFilterChange("monthly")}
            >
              Monthly
            </button>
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="flex-grow py-8">
            <div className="h-[400px] bg-white border border-gray-200 rounded-lg shadow-md p-4">
              <ResponseChart />
            </div>
          </div>
          <div className="w-64 py-2 flex flex-col space-y-4 ml-28">
          <div className="p-6 border-4 border-[#CC8C6B] rounded-[30px] bg-gray-100 w-full  mx-auto ml-28"> 
  <h4 className="text-xl font-bold mb-4  font-family: 'Poppins'">Legend:</h4>
  <div className="space-y-4">
    <p className="text-base">
      <span className="font-semibold  font-family: 'Poppins'">Question 1: </span>
      Would you recommend our services to friends and family?
    </p>
    <p className="text-base">
      <span className="font-semibold  font-family: 'Poppins'">Question 2: </span>
      Do you think the information you have gotten will help you in making an informed decision?
    </p>
    <p className="text-base">
      <span className="font-semibold  font-family: 'Poppins'">Question 3: </span>
      Did you find LandVista's features and language easy to understand?
    </p>
    <p className="text-base">
      <span className="font-semibold  font-family: 'Poppins'">Question 4: </span>
      Did you encounter any broken links?
    </p>
  </div>
</div>
          </div>
        </div>
        <div>
          {data && (
            <div className="mt-8">
              <h2>Fetched Data:</h2>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
