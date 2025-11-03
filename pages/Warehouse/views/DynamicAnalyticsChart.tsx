import React, { useState, useEffect } from 'react';
import RequestStatusChart from '../components/RequestStatusChart';
import RequestSummaryChart from '../components/RequestSummaryChart';
import InventoryTurnoverChart from '../components/InventoryTurnoverChart';

// FIX: Add mock data for charts to consume
const summaryData = [
    { name: 'Jan', 'Requisições': 450 },
    { name: 'Fev', 'Requisições': 320 },
    { name: 'Mar', 'Requisições': 550 },
    { name: 'Abr', 'Requisições': 480 },
    { name: 'Mai', 'Requisições': 600 },
    { name: 'Jun', 'Requisições': 520 },
];
const statusData = [
  { name: 'Aprovado', value: 400 },
  { name: 'Pendente', value: 120 },
  { name: 'Recusado', value: 60 },
  { name: 'Entregue', value: 800 },
];
const turnoverData = [
  { name: 'Sem 1', giro: 4.5 },
  { name: 'Sem 2', giro: 5.2 },
  { name: 'Sem 3', giro: 4.8 },
  { name: 'Sem 4', giro: 6.0 },
  { name: 'Sem 5', giro: 5.5 },
];


const chartComponents = [
    { Component: RequestSummaryChart, key: 'summary', data: summaryData },
    { Component: RequestStatusChart, key: 'status', data: statusData },
    { Component: InventoryTurnoverChart, key: 'turnover', data: turnoverData },
];

const DynamicAnalyticsChart: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prevIndex => (prevIndex + 1) % chartComponents.length);
        }, 60000); // 60000 ms = 1 minute

        return () => clearInterval(interval);
    }, []);

    const { Component, data } = chartComponents[activeIndex];

    return (
        <div className="w-full h-full">
            {/* FIX: The 'Component' variable has a union type of multiple components with different `data` prop shapes. Cast `data` to `any` to resolve the type mismatch. */}
            <Component data={data as any} />
        </div>
    );
};

export default DynamicAnalyticsChart;