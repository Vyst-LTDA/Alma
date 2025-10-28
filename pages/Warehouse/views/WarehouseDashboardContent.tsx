import React, { useMemo, useState } from 'react';
import StatCard from '../components/StatCard';
import { CubeIcon, BoltIcon, DocumentDuplicateIcon, CircleStackIcon, CheckCircleIcon } from '../../../components/shared/IconComponents';
import { UserRole, UserData } from '../../../types';
import { allRequests, allEducationalRequests, mockStockItems, mockEducationalStockItems } from '../../../data/mockData';
import TopItemsTable from '../components/TopItemsTable';
import DynamicChart from '../../../components/shared/DynamicChart';
import ChartContainer from '../../../components/shared/ChartContainer';
import { generalDashboardCharts, myDashboardCharts } from '../../../data/mockCharts';


interface WarehouseDashboardContentProps {
    userRole: UserRole;
    onNavigate: (view: string) => void;
    userData: UserData;
}

const WarehouseDashboardContent: React.FC<WarehouseDashboardContentProps> = ({ userRole, onNavigate, userData }) => {
    const [scope, setScope] = useState<'my' | 'general'>('general');
    
    const dashboardData = useMemo(() => {
        let requests;
        let stock;

        if (userRole === 'warehouse') {
            requests = (scope === 'my') ? allEducationalRequests.filter(r => r.requester === userData.name) : allEducationalRequests;
            stock = mockEducationalStockItems;
        } else if (userRole === 'admin') {
             if (scope === 'my') {
                requests = [...allRequests, ...allEducationalRequests].filter(r => r.requester === userData.name);
                stock = mockStockItems;
            } else { // general
                requests = [...allRequests, ...allEducationalRequests];
                stock = [...mockStockItems, ...mockEducationalStockItems];
            }
        } else { // Professor (safeguard)
            requests = allRequests.filter(r => r.requester === userData.name);
            stock = mockStockItems;
        }


        const totalRequests = requests.length;
        const lowStockItems = stock.filter(item => item.status === 'Estoque Baixo').length;
        const fulfilledRequests = requests.filter(r => r.status === 'Entregue').length;
        const fulfillmentRate = totalRequests > 0 ? ((fulfilledRequests / totalRequests) * 100).toFixed(0) + '%' : 'N/A';
        
        const topItems = requests.reduce((acc, req) => {
            acc[req.item] = (acc[req.item] || 0) + req.quantity;
            return acc;
        }, {} as Record<string, number>);
        const topItemsData = Object.entries(topItems)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 5)
            .map(([name, quantity]) => ({ name, quantity }));
        
        return {
            totalRequests,
            lowStockItems,
            fulfillmentRate,
            topItemsData,
        };

    }, [userRole, scope, userData.name]);
    
    const chartsToDisplay = useMemo(() => {
        if (scope === 'my') return myDashboardCharts;
        return generalDashboardCharts;
    }, [scope]);

    const title = scope === 'my' ? 'Meu Resumo' : 'Resumo Geral';

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-dark-text">{title}</h2>
                 {(userRole === 'warehouse' || userRole === 'admin') && (
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
            </div>
            
            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total de Requisições" 
                value={String(dashboardData.totalRequests)} 
                change="" 
                changeType="neutral" 
                icon={<DocumentDuplicateIcon className="w-8 h-8 text-primary" />} 
              />
              <StatCard 
                title="Itens em Estoque Baixo" 
                value={String(dashboardData.lowStockItems)} 
                change="" 
                changeType="neutral" 
                icon={<BoltIcon className="w-8 h-8 text-secondary" />} 
              />
              <StatCard 
                title="Taxa de Atendimento" 
                value={dashboardData.fulfillmentRate} 
                change="" 
                changeType="neutral" 
                icon={<CheckCircleIcon className="w-8 h-8 text-green-500" />} 
              />
              <StatCard 
                title="Empréstimos Ativos" 
                value={String(allRequests.filter(r => r.type === 'Empréstimo' && r.status === 'Aprovado').length)} 
                change="" 
                changeType="neutral" 
                icon={<CircleStackIcon className="w-8 h-8 text-orange-500" />} 
              />
            </div>

             {/* Main Content */}
            <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {chartsToDisplay.slice(0, 4).map(chart => (
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
                {chartsToDisplay[4] && (
                     <ChartContainer title={chartsToDisplay[4].title}>
                        <DynamicChart 
                            type={chartsToDisplay[4].type}
                            data={chartsToDisplay[4].data}
                            dataKey={chartsToDisplay[4].dataKey}
                            nameKey={chartsToDisplay[4].nameKey}
                        />
                    </ChartContainer>
                )}
            </div>
        </div>
    );
};

export default WarehouseDashboardContent;
