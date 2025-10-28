/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React from 'react';
import {
    ResponsiveContainer,
    BarChart, Bar,
    PieChart, Pie, Cell,
    LineChart, Line,
    AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

interface DynamicChartProps {
    type: 'bar' | 'pie' | 'line' | 'area' | 'verticalBar';
    data: any[];
    dataKey: string;
    nameKey: string;
}

const COLORS = ['#4f46e5', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

const DynamicChart: React.FC<DynamicChartProps> = ({ type, data, dataKey, nameKey }) => {
    const renderChart = () => {
        switch (type) {
            case 'bar':
                return (
                    <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey={nameKey} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} />
                        <Legend iconType="circle" iconSize={8} />
                        <Bar dataKey={dataKey} fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                );
            case 'verticalBar':
                 return (
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" tick={{ fill: '#1e293b', fontSize: 12 }} />
                        <YAxis dataKey={nameKey} type="category" width={100} tick={{ fill: '#1e293b', fontSize: 12 }} interval={0} />
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} />
                        <Bar dataKey={dataKey} fill="#7c3aed" radius={[0, 4, 4, 0]} />
                    </BarChart>
                );
            case 'pie':
                return (
                    <PieChart>
                        <Pie data={data} dataKey={dataKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} />
                        <Legend iconType="circle" />
                    </PieChart>
                );
            case 'line':
                 return (
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey={nameKey} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} />
                        <Line type="monotone" dataKey={dataKey} stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                );
            case 'area':
                 return (
                    <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                         <defs>
                            <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey={nameKey} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }} />
                        <Area type="monotone" dataKey={dataKey} name="Valor" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorArea)" />
                    </AreaChart>
                 )
            default:
                return null;
        }
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            {renderChart()}
        </ResponsiveContainer>
    );
};

export default DynamicChart;
