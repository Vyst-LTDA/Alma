
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartContainer from './ChartContainer';

const data = [
  { name: 'Jan', Empréstimo: 400, "Uso Contínuo": 240 },
  { name: 'Fev', Empréstimo: 300, "Uso Contínuo": 139 },
  { name: 'Mar', Empréstimo: 200, "Uso Contínuo": 980 },
  { name: 'Abr', Empréstimo: 278, "Uso Contínuo": 390 },
  { name: 'Mai', Empréstimo: 189, "Uso Contínuo": 480 },
  { name: 'Jun', Empréstimo: 239, "Uso Contínuo": 380 },
  { name: 'Jul', Empréstimo: 349, "Uso Contínuo": 430 },
];

const RequestSummaryChart: React.FC = () => {
  return (
    <ChartContainer title="Resumo Anual de Requisições">
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
          <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip 
             contentStyle={{ 
                 backgroundColor: '#ffffff', 
                 border: '1px solid #e2e8f0',
                 borderRadius: '0.5rem'
             }}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} />
          <Bar dataKey="Empréstimo" name="Empréstimo" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Uso Contínuo" name="Uso Contínuo" fill="#7c3aed" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default RequestSummaryChart;
