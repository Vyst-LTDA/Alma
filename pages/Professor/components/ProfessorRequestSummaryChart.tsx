/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartContainer from '../../../components/shared/ChartContainer';

const data: { name: string, 'Requisições': number }[] = [];

const ProfessorRequestSummaryChart: React.FC = () => {
  return (
    <ChartContainer title="Minhas Requisições por Mês">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
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
          <p>Sem dados de requisições para exibir.</p>
        </div>
      )}
    </ChartContainer>
  );
};

export default ProfessorRequestSummaryChart;