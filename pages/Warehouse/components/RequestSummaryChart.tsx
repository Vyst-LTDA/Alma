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

interface RequestSummaryChartProps {
  data: ChartData[];
  title?: string;
}

const RequestSummaryChart: React.FC<RequestSummaryChartProps> = ({ data, title = "Resumo Anual de Requisições" }) => {
  return (
    <ChartContainer title={title}>
      <div className="h-80">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#1e293b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#1e293b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
               contentStyle={{ 
                   backgroundColor: '#ffffff', 
                   border: '1px solid #e2e8f0',
                   borderRadius: '0.5rem'
               }}
            />
            <Bar dataKey="Requisições" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-light-text">
            <p>Sem dados para exibir o resumo.</p>
        </div>
      )}
      </div>
    </ChartContainer>
  );
};

export default RequestSummaryChart;
