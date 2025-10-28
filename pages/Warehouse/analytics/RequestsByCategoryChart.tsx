/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import ChartContainer from '../../../components/shared/ChartContainer';
import { UserRole } from '../../../types';

const COLORS = ['#4f46e5', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

interface ChartData {
  name: string;
  value: number;
}

interface RequestsByCategoryChartProps {
  userRole: UserRole;
  data: ChartData[];
}

const RequestsByCategoryChart: React.FC<RequestsByCategoryChartProps> = ({ userRole, data }) => {
    const title = userRole === 'professor' ? 'Minhas Requisições por Categoria' : 'Requisições por Categoria';
    return (
    <ChartContainer title={title}>
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
            <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ color: '#1e293b' }} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-light-text">
            <p>Sem dados de categoria para exibir.</p>
        </div>
      )}
      </div>
    </ChartContainer>
  );
};

export default RequestsByCategoryChart;