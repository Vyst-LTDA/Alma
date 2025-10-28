/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState, useMemo } from 'react';
import { ChartPieIcon } from '../../../components/shared/IconComponents';
import AnalyticsKPIs from '../analytics/AnalyticsKPIs';
import { UserRole, UserData } from '../../../types';
import { allRequests, allEducationalRequests, mockLossRecords, mockStockItems, mockEducationalStockItems } from '../../../data/mockData';
import DynamicChart from '../../../components/shared/DynamicChart';
import ChartContainer from '../../../components/shared/ChartContainer';
import { generalAnalyticsCharts, myAnalyticsCharts } from '../../../data/mockCharts';

interface AnalyticsViewProps {
    userRole: UserRole;
    userData: UserData;
    onNavigate?: (view: string) => void;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ userRole, userData, onNavigate }) => {
    const isProfessor = userRole === 'professor';
    const [scope, setScope] = useState<'my' | 'general'>(isProfessor ? 'my' : 'general');

    const analyticsData = useMemo(() => {
        let baseRequests;
        let baseStock;
        let baseLosses = mockLossRecords;

        if (userRole === 'warehouse') {
            baseRequests = allEducationalRequests;
            baseStock = mockEducationalStockItems;
        } else if (userRole === 'admin') {
            baseRequests = [...allRequests, ...allEducationalRequests];
            baseStock = [...mockStockItems, ...mockEducationalStockItems];
        } else { // professor
            baseRequests = allRequests;
            baseStock = mockStockItems;
        }

        let requests = baseRequests;
        let stock = baseStock;
        let losses = baseLosses;

        if (scope === 'my') {
            requests = baseRequests.filter(r => r.requester === userData.name);
            losses = baseLosses.filter(l => l.recordedBy === userRole);
            if (userRole === 'admin' || userRole === 'professor') {
                stock = mockStockItems;
            }
        }
        
        const totalRequests = requests.length;
        const pendingRequests = requests.filter(r => r.status === 'Pendente').length;
        const lowStockItems = stock.filter(item => item.status === 'Estoque Baixo').length;
        const fulfilledRequests = requests.filter(r => r.status === 'Entregue').length;
        const fulfillmentRate = totalRequests > 0 ? ((fulfilledRequests / totalRequests) * 100).toFixed(0) + '%' : 'N/A';
        const kpiData = { totalRequests, pendingRequests, lowStockItems, fulfillmentRate };
        
        return { kpiData };

    }, [userRole, scope, userData.name]);
    
    const chartsToDisplay = useMemo(() => {
        if (scope === 'my') return myAnalyticsCharts;
        return generalAnalyticsCharts;
    }, [scope, userRole]);

    const title = scope === 'my' ? 'Minhas Análises' : 'Análises e BI';
    const subtitle = scope === 'my'
        ? 'Explore os dados e métricas de suas atividades no almoxarifado.' 
        : 'Explore os dados e métricas do almoxarifado.';

    return (
        <div className="h-full flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-dark-text">{title}</h2>
                    <p className="text-light-text mt-1">{subtitle}</p>
                </div>
                 <div className="flex items-center gap-4 mt-4 md:mt-0">
                    {!isProfessor && (
                        <div className="flex items-center p-1 bg-gray-200 rounded-lg">
                            <button 
                                onClick={() => setScope('general')}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${scope === 'general' ? 'bg-white text-primary shadow' : 'text-light-text hover:bg-gray-300/50'}`}
                            >
                                Informações Gerais
                            </button>
                            <button 
                                onClick={() => setScope('my')}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${scope === 'my' ? 'bg-white text-primary shadow' : 'text-light-text hover:bg-gray-300/50'}`}
                            >
                                Minhas Informações
                            </button>
                        </div>
                    )}
                    {onNavigate && (userRole === 'admin' || userRole === 'professor') && (
                         <button 
                            onClick={() => onNavigate('custom-analytics')}
                            className="flex items-center bg-primary text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
                        >
                            <ChartPieIcon className="w-5 h-5 mr-2" />
                            Gerar Gráfico Personalizado
                        </button>
                    )}
                </div>
            </div>
            
            <AnalyticsKPIs kpiData={analyticsData.kpiData} />

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-y-auto pr-2 -mr-2">
                {chartsToDisplay.map(chart => (
                    <ChartContainer key={chart.id} title={chart.title}>
                        <DynamicChart 
                            type={chart.type}
                            data={chart.data}
                            dataKey={chart.dataKey}
                            nameKey={chart.nameKey}
                        />
                    </ChartContainer>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsView;