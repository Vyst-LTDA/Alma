
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import ChartContainer from './ChartContainer';

const data = [
  { name: 'Aprovado', value: 400 },
  { name: 'Pendente', value: 120 },
  { name: 'Recusado', value: 60 },
  { name: 'Entregue', value: 800 },
];

const COLORS = ['#4f46e5', '#f59e0b', '#ef4444', '#10b981'];

const RequestStatusChart: React.FC = () => {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <ChartContainer title="Status das Requisições">
      <div className="relative w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-dark-text">{total}</span>
            <span className="text-sm text-light-text">Requisições</span>
        </div>
      </div>
      <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 mt-4">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></span>
            <span className="text-sm text-dark-text">{entry.name}</span>
          </div>
        ))}
      </div>
    </ChartContainer>
  );
};

export default RequestStatusChart;
