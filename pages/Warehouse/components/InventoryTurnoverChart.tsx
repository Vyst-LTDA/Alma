/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartContainer from '../../../components/shared/ChartContainer';

interface ChartData {
  name: string;
  giro: number;
}

interface InventoryTurnoverChartProps {
  data: ChartData[];
}


const InventoryTurnoverChart: React.FC<InventoryTurnoverChartProps> = ({ data }) => {
  return (
    <ChartContainer title="Giro de Estoque (Mensal)">
      <div className="h-80">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="colorGiro" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
              <Area type="monotone" dataKey="giro" name="Giro" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorGiro)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-light-text">
            <p>Sem dados para exibir o giro de estoque.</p>
          </div>
        )}
      </div>
    </ChartContainer>
  );
};

export default InventoryTurnoverChart;