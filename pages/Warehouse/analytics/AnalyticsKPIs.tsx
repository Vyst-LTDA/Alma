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
        { title: 'Total de Requisições', value: kpiData.totalRequests, icon: <ArchiveIcon className="w-8 h-8 text-primary" /> },
        { title: 'Requisições Pendentes', value: kpiData.pendingRequests, icon: <ClockIcon className="w-8 h-8 text-orange-500" /> },
        { title: 'Taxa de Atendimento', value: kpiData.fulfillmentRate, icon: <CheckCircleIcon className="w-8 h-8 text-green-500" /> },
        { title: 'Itens com Estoque Baixo', value: kpiData.lowStockItems, icon: <BoltIcon className="w-8 h-8 text-secondary" /> },
    ];
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map(kpi => (
                <div key={kpi.title} className="bg-light-card p-6 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <p className="text-light-text font-medium">{kpi.title}</p>
                            <p className="text-3xl font-bold text-dark-text mt-1">{kpi.value}</p>
                        </div>
                        {kpi.icon}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AnalyticsKPIs;