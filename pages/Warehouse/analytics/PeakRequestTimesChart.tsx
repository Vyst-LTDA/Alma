/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartContainer from '../../../components/shared/ChartContainer';
import { UserRole } from '../../../types';

interface ChartData {
  name: string;
  'Requisições': number;
}

interface PeakRequestTimesChartProps {
  userRole: UserRole;
  data: ChartData[];
}

const PeakRequestTimesChart: React.FC<PeakRequestTimesChartProps> = ({ userRole, data }) => {
  const title = userRole === 'professor' ? 'Meu Volume de Requisições por Dia' : 'Volume de Requisições por Dia';

  return (
    <ChartContainer title={title}>
      <div className="h-80">
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#1e293b', fontSize: 12 }} />
            <YAxis tick={{ fill: '#1e293b', fontSize: 12 }} />
            <Tooltip 
               contentStyle={{ 
                   backgroundColor: '#ffffff', 
                   border: '1px solid #e2e8f0',
                   borderRadius: '0.5rem'
               }}
            />
            <Line type="monotone" dataKey="Requisições" stroke="#7c3aed" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-light-text">
            <p>Sem dados de volume para exibir.</p>
        </div>
      )}
      </div>
    </ChartContainer>
  );
};

export default PeakRequestTimesChart;