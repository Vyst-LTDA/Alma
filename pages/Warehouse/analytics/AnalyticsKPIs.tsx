/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React from 'react';
import { ClockIcon, CheckCircleIcon, BoltIcon, ArchiveIcon } from '../../../components/shared/IconComponents';

interface KpiData {
    totalRequests: number;
    pendingRequests: number;
    lowStockItems: number;
    fulfillmentRate: string;
}

interface AnalyticsKPIsProps {
    kpiData: KpiData;
}

const AnalyticsKPIs: React.FC<AnalyticsKPIsProps> = ({ kpiData }) => {
    const kpis = [
        { 
            title: 'Total de Requisições', 
            value: kpiData.totalRequests, 
            icon: <ArchiveIcon className="w-6 h-6 text-purple-600" />,
            borderColor: 'border-purple-100',
            bgColor: 'bg-purple-50'
        },
        { 
            title: 'Requisições Pendentes', 
            value: kpiData.pendingRequests, 
            icon: <ClockIcon className="w-6 h-6 text-orange-500" />,
            borderColor: 'border-orange-100',
            bgColor: 'bg-orange-50'
        },
        { 
            title: 'Taxa de Atendimento', 
            value: kpiData.fulfillmentRate, 
            icon: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
            borderColor: 'border-green-100',
            bgColor: 'bg-green-50'
        },
        { 
            title: 'Itens com Estoque Baixo', 
            value: kpiData.lowStockItems, 
            icon: <BoltIcon className="w-6 h-6 text-indigo-600" />,
            borderColor: 'border-indigo-100',
            bgColor: 'bg-indigo-50'
        },
    ];
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map(kpi => (
                <div key={kpi.title} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-gray-500">{kpi.title}</span>
                        <div className={`p-2 rounded-full ${kpi.bgColor} ${kpi.borderColor} border`}>
                            {kpi.icon}
                        </div>
                    </div>
                    <div>
                        <span className="text-3xl font-bold text-gray-800">{kpi.value}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AnalyticsKPIs;