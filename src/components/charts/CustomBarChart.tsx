import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { UserBarChartData } from '../../utils/getBarChartData';

interface CustomBarChartProps<T> {
  data: T[];
  stackDataKeys: string[];
}

export const CustomBarChart: React.FC<CustomBarChartProps<
  UserBarChartData
>> = ({ data, stackDataKeys }) => {
  return (
    <BarChart
      layout="vertical"
      width={600}
      height={400}
      data={data}
      barSize={20}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" domain={[0, 23]} />
      <YAxis dataKey="name" type="category" />
      <Tooltip />
      <Legend />
      <Bar dataKey={stackDataKeys[0]} stackId="a" fill="#8884d8" />
      <Bar dataKey={stackDataKeys[1]} stackId="a" fill="#82ca9d" />
    </BarChart>
  );
};
