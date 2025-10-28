
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import ChartContainer from './ChartContainer';

const data = [
  { name: 'Sem 1', giro: 4.5 },
  { name: 'Sem 2', giro: 5.2 },
  { name: 'Sem 3', giro: 4.8 },
  { name: 'Sem 4', giro: 6.0 },
  { name: 'Sem 5', giro: 5.5 },
  { name: 'Sem 6', giro: 7.0 },
  { name: 'Sem 7', giro: 6.5 },
  { name: 'Sem 8', giro: 8.0 },
];

const InventoryTurnoverChart: React.FC = () => {
  return (
    <ChartContainer title="Giro de Estoque (Mensal)">
      <div className="h-80">
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
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
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
      </div>
    </ChartContainer>
  );
};

export default InventoryTurnoverChart;
