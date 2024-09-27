"use client"
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { fetchFeedback } from '@/app/utils/fetchfeedback';  
import { string } from 'prop-types';
import Feedback from './page';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Response {
  question: string;
  positive: number;
  negative: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

const SurveyChart = () => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        backgroundColor: '',
        borderColor: '',
        borderWidth: 0,
      },
    ],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [, setHasData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchFeedback(); 
        console.log("Fetched Data:", response);
  
        const dataObject = response;
        const dataArray = Object.keys(dataObject).map(key => ({
          question: dataObject[key].question,
          positive: dataObject[key].positive,
          negative: dataObject[key].negative,
        }));
  
        console.log("Transformed Data Array:", dataArray);
  
        if (dataArray && dataArray.length > 0) {
          const processedData = processChartData(dataArray);
          setChartData(processedData);
          setHasData(true);
        } else {
          setChartData(getDefaultChartData());
          setHasData(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setChartData(getDefaultChartData());
        setHasData(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const processChartData = (data: Response[]) => {
    const questionNumbers = data.map((_, index) => `Question ${index + 1}`);
    const yesCounts = data.map(record => record.positive);
    const noCounts = data.map(record => record.negative);
  
    const processedData = {
      labels: questionNumbers,
      datasets: [
        {
          label: 'Yes Responses',
          data: yesCounts,
          backgroundColor: '#00A6FB',
          borderColor: '#00A6FB',
          borderWidth: 1,
        },
        {
          label: 'No Responses',
          data: noCounts,
          backgroundColor: '#FFB600',
          borderColor: '#FFB600',
          borderWidth: 1,
        },
      ],
    };
  
    console.log("Processed Chart Data:", processedData);  
  
    return processedData;
  };

  const getDefaultChartData = () => {
    const defaultQuestions = ['Question 1', 'Question 2', 'Question 3'];
    return {
      labels: defaultQuestions,
      datasets: [
        {
          label: 'Yes Responses',
          data: [0, 0, 0],
          backgroundColor: '#00A6FB',
          borderColor: '#00A6FB',
          borderWidth: 1,
        },
        {
          label: 'No Responses',
          data: [0, 0, 0],
          backgroundColor: '#FFB600',
          borderColor: '#FFB600',
          borderWidth: 1,
        },
      ],
    };
  };

  const options: ChartOptions<'bar'> = {
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        font: {
          size: 24,
        },
        color: 'black',
      },
      tooltip: {
        bodyFont: {
          size: 18,  
        },
        callbacks: {
          title: (context) => {
            const dataIndex = context[0].dataIndex;
            const questionLabel = chartData.labels[dataIndex] || "Question not available";
            return questionLabel;
          },
        },
      },
      
    },
    scales: {
      x: {
        title: {
          display: true,
          color:'black',
          text: 'Question Number',
          font: {
            size: 24,
          },
        },
        ticks: {
          font: {
            size: 24,
          },
        },
      },
      y: {
        title: {
          display: true,
          color:'black',
          text: 'Number of Responses',
          font: {
            size: 24,
          },
        },
        ticks: {
          font: {
            size: 24,
          },
        },
        beginAtZero: true,
      },
    },
  };
  

  const renderLegend = () => (
    <div className="mb-4 ml-48">
      <div className="flex gap-2 ml-48">
        <span className="inline-block w-4 h-4 bg-[#00A6FB] "></span>
        <span className='text-lg'>Yes Responses</span>
      </div>
      <div className="flex gap-2 ml-38">
        <span className="inline-block w-4 h-4 bg-[#FFB600] ml-48"></span>
        <span  className='text-lg'>No Responses</span>
      </div>
    </div>
  );

  if (isLoading) {
    return <div>Loading chart...</div>;
  }
  
  console.log("Chart Data in Render:", chartData); 
  
  return (
    <div className="bg-white shadow rounded-lg p-8 w-[900px] h-[600px] mr-8">
      {renderLegend()}
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default SurveyChart;
