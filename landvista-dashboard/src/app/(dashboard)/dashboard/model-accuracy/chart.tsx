import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataPoint {
  month: string;
  accuracy: number;
}

interface ChartProps {
  data: DataPoint[];
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={490} minWidth={300} minHeight={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 190, bottom: 5 }}>
        <XAxis dataKey="month" />
        <YAxis label={{ value: 'Accuracy in Percentage', angle: -90, position: 'insideLeft' , bottom: 10}} />
        <Tooltip />
        <Legend />
        <Bar dataKey="accuracy" fill="#008080" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;
