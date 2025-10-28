/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartContainer from '../../../components/shared/ChartContainer';

interface ChartData {
  name: string;
  'Requisições': number;
}

interface RequestsByRequesterChartProps {
  data: ChartData[];
}

const RequestsByRequesterChart: React.FC<RequestsByRequesterChartProps> = ({ data }) => {
  return (
    <ChartContainer title="Top 5 Solicitantes">
      <div className="h-80">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: -10, bottom: 5, }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#1e293b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#1e293b', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip 
               contentStyle={{ 
                   backgroundColor: '#ffffff', 
                   border: '1px solid #e2e8f0',
                   borderRadius: '0.5rem'
               }}
            />
            <Bar dataKey="Requisições" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-light-text">
            <p>Sem dados de solicitantes para exibir.</p>
        </div>
      )}
      </div>
    </ChartContainer>
  );
};

export default RequestsByRequesterChart;