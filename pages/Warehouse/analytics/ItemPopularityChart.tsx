/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartContainer from '../../../components/shared/ChartContainer';
import { UserRole } from '../../../types';

interface ChartData {
  name: string;
  Quantidade: number;
}

interface ItemPopularityChartProps {
  userRole: UserRole;
  data: ChartData[];
}

const ItemPopularityChart: React.FC<ItemPopularityChartProps> = ({ userRole, data }) => {
  const title = userRole === 'professor' ? 'Meus Itens Mais Requisitados' : 'Itens Mais Requisitados';
  
  return (
    <ChartContainer title={`${title} (por quantidade)`}>
      <div className="h-80">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#1e293b', fontSize: 12 }} />
            <YAxis dataKey="name" type="category" width={150} tick={{ fill: '#1e293b', fontSize: 12 }} interval={0} />
            <Tooltip 
               contentStyle={{ 
                   backgroundColor: '#ffffff', 
                   border: '1px solid #e2e8f0',
                   borderRadius: '0.5rem'
               }}
            />
            <Bar dataKey="Quantidade" fill="#4f46e5" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-light-text">
            <p>Nenhum dado de requisição para exibir.</p>
        </div>
      )}
      </div>
    </ChartContainer>
  );
};

export default ItemPopularityChart;