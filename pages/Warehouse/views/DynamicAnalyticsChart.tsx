import React, { useState, useEffect } from 'react';
import RequestStatusChart from '../components/RequestStatusChart';
import RequestSummaryChart from '../components/RequestSummaryChart';
import InventoryTurnoverChart from '../components/InventoryTurnoverChart';

const chartComponents = [
    { Component: RequestSummaryChart, key: 'summary' },
    { Component: RequestStatusChart, key: 'status' },
    { Component: InventoryTurnoverChart, key: 'turnover' },
];

const DynamicAnalyticsChart: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex(prevIndex => (prevIndex + 1) % chartComponents.length);
        }, 60000); // 60000 ms = 1 minute

        return () => clearInterval(interval);
    }, []);

    const { Component } = chartComponents[activeIndex];

    return (
        <div className="w-full h-full">
            <Component />
        </div>
    );
};

export default DynamicAnalyticsChart;
