"use client"
import React from 'react';
import Chart from './chart';
import Layout from '../components/Layout';

const data = [
  { month: 'Jan', accuracy: 30 },
  { month: 'Feb', accuracy: 35 },
  { month: 'Mar', accuracy: 60 },
  { month: 'Apr', accuracy: 70 },
  { month: 'May', accuracy: 75 },
];

const DataAccuracyDashboard = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md font-Poppins">
        <h1 className="text-3xl font-bold mb-6 text-black ml-40">Data Accuracy</h1>
  
        <h2 className="text-xl font-semibold mb-4 text-black ml-40">
          Accuracy of the Machine Learning Model Over Time
        </h2>
  
        <div className="flex mb-6 gap-16">
          <div className="w-3/4 h-64">
            <Chart data={data} />
          </div>
    
          <div className="w-1/4 flex items-center justify-center">
            <div className="border-4 rounded-lg p-2 text-center h-40 mt-24"
                 style={{ borderColor: '#CA7558', fontWeight: 'bold', transform: 'scale(1.2)', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)' }}>
              <h3 className="text-sm font-bold mb-3 text-black">Model Accuracy</h3>
              <p className="text-sm font-normal">Highest Model Accuracy:</p>
              <p className="text-4xl mt-1" style={{ color: '#CA7558' }}>75%</p>
              <p className="text-sm text-black mt-4"><span className="font-normal text-sm">Month:</span> September</p>
            </div>
          </div>
        </div>
  
        <div className="p-4 rounded-lg border-4 border-teal-500 text-black font-poppins mt-64 leading-relaxed w-104 ml-32">
          <p>
            The chart illustrates the model&#39;s accuracy over a series of months,
            indicating a clear trend in performance improvement. Initially, the model
            may have struggled to make precise predictions. However, as the
            months progress, a steady upward trajectory is observed, reflecting
            enhancements in the model&#39;s training, data quality, and algorithm
            adjustments.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default DataAccuracyDashboard;
