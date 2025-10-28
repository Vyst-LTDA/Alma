/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import ChartContainer from '../../../components/shared/ChartContainer';

const COLORS = ['#4f46e5', '#7c3aed'];

interface ChartData {
  name: string;
  value: number;
}

interface RequestTypeChartProps {
  data: ChartData[];
}

const RequestTypeChart: React.FC<RequestTypeChartProps> = ({ data }) => {
    return (
    <ChartContainer title="Tipos de Requisição">
      <div className="h-80">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-light-text">
            <p>Sem dados para exibir.</p>
        </div>
      )}
      </div>
    </ChartContainer>
  );
};

export default RequestTypeChart;