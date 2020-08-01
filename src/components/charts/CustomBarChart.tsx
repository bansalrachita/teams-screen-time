import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { UserBarChartData } from '../../utils/getBarChartData';
import { Flex } from '@fluentui/react-northstar';

interface CustomBarChartProps<T> {
  data: T[];
  stackDataKeys: string[];
}

export const CustomBarChart: React.FC<CustomBarChartProps<
  UserBarChartData
>> = ({ data, stackDataKeys }) => {
  return (
    <Flex fill>
      <BarChart
        layout="vertical"
        width={500}
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
        <XAxis type="number" domain={[0, 10]} />
        <YAxis dataKey="name" type="category" />
        <Tooltip />
        <Legend />
        <Bar dataKey={stackDataKeys[0]} stackId="a" fill="#8884d8" />
        <Bar
          dataKey={stackDataKeys[1]}
          stackId="a"
          fill="rgba(136, 132, 216, 0.3)"
        />
      </BarChart>
    </Flex>
  );
};
