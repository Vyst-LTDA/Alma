/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useMemo, useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import { CubeIcon, BoltIcon, DocumentDuplicateIcon, CircleStackIcon, CheckCircleIcon } from '../../../components/shared/IconComponents';
import { UserRole, UserData, MovementDto, ItemDto } from '../../../types';
import DynamicChart from '../../../components/shared/DynamicChart';
import ChartContainer from '../../../components/shared/ChartContainer';
import { generalDashboardCharts, myDashboardCharts } from '../../../data/mockCharts';
import { getMovements, getItems } from '../../../services/apiService';

interface WarehouseDashboardContentProps {
    userRole: UserRole;
    onNavigate: (view: string) => void;
    userData: UserData;
}

const WarehouseDashboardContent: React.FC<WarehouseDashboardContentProps> = ({ userRole, onNavigate, userData }) => {
    const [scope, setScope] = useState<'my' | 'general'>('general');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [movements, setMovements] = useState<MovementDto[]>([]);
    const [items, setItems] = useState<ItemDto[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [movementsResult, itemsResult] = await Promise.all([
                    getMovements({ pageSize: 1000 }), // Fetch a large number to get all data
                    getItems({ pageSize: 1000 })
                ]);
                setMovements(movementsResult.items || []);
                setItems(itemsResult.items || []);
            } catch (err: any) {
                setError("Falha ao carregar dados do painel.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const { dashboardData, chartsToDisplay } = useMemo(() => {
        if (loading) {
             return {
                dashboardData: { totalRequests: '...', lowStockItems: '...', fulfillmentRate: '...', activeLoans: '...' },
                chartsToDisplay: [],
            };
        }

        let processedMovements = movements;
        if (scope === 'my' && userData.name) {
            processedMovements = movements.filter(m => m.userFullName === userData.name);
        }

        const checkoutMovements = processedMovements.filter(m => m.type === 'CheckOut');

        // KPIs
        const totalRequests = checkoutMovements.length;
        const lowStockItems = items.filter(item => item.stockQuantity > 0 && item.stockQuantity <= 10).length;
        const fulfillmentRate = '100%'; // All movements from API are considered completed.
        const activeLoans = checkoutMovements.filter(m => m.observations?.toLowerCase().includes('empréstimo')).length;

        // Chart Data Calculation
        const monthlyData = processedMovements.reduce((acc, mov) => {
            const month = new Date(mov.movementDate).toLocaleString('pt-BR', { month: 'short' });
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const monthlyChartData = Object.entries(monthlyData).map(([name, value]) => ({ name, volume: value }));
        
        const statusData = processedMovements.reduce((acc, mov) => {
            const status = mov.type === 'CheckOut' ? 'Saída' : 'Entrada';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const statusChartData = Object.entries(statusData).map(([name, value]) => ({ name, value }));

        const baseCharts = scope === 'my' ? myDashboardCharts : generalDashboardCharts;
        const displayCharts = baseCharts.map(chartConfig => {
            const newConfig = { ...chartConfig };
            if (newConfig.id.includes('1')) newConfig.data = monthlyChartData;
            if (newConfig.id.includes('2')) newConfig.data = statusChartData;
            // Other charts can be populated here as data becomes available
            return newConfig;
        });

        return {
            dashboardData: {
                totalRequests: String(totalRequests),
                lowStockItems: String(lowStockItems),
                fulfillmentRate,
                activeLoans: String(activeLoans),
            },
            chartsToDisplay: displayCharts,
        };

    }, [userRole, scope, userData.name, movements, items, loading]);
    
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total de Requisições" 
                value={dashboardData.totalRequests} 
                change="" 
                changeType="neutral" 
                icon={<DocumentDuplicateIcon className="w-8 h-8 text-primary" />} 
              />
              <StatCard 
                title="Itens em Estoque Baixo" 
                value={dashboardData.lowStockItems} 
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
                value={dashboardData.activeLoans} 
                change="" 
                changeType="neutral" 
                icon={<CircleStackIcon className="w-8 h-8 text-orange-500" />} 
              />
            </div>

            <div className="space-y-8">
                {loading ? (
                     <div className="text-center py-10 text-light-text">Carregando gráficos...</div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500">{error}</div>
                ) : (
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
                )}
            </div>
        </div>
    );
};

export default WarehouseDashboardContent;