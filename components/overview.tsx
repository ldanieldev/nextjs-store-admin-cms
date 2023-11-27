'use client';

import { priceFormatter } from '@/lib/utils';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

type props = {
  data: any[];
};

export default function Overview({ data }: props) {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => priceFormatter.format(value)}
        />
        <Bar dataKey='total' fill='#3498db' radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
