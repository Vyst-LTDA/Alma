/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState, useMemo, useEffect } from 'react';
import { ChartPieIcon } from '../../../components/shared/IconComponents';
import AnalyticsKPIs from '../analytics/AnalyticsKPIs';
import { UserRole, UserData, ItemDto, MovementDto } from '../../../types';
import DynamicChart from '../../../components/shared/DynamicChart';
import ChartContainer from '../../../components/shared/ChartContainer';
import { generalAnalyticsCharts, myAnalyticsCharts } from '../../../data/mockCharts';
import { getItems, getMovements, getMovementsByUser } from '../../../services/apiService';

interface AnalyticsViewProps {
    userRole: UserRole;
    userData: UserData;
    onNavigate?: (view: string) => void;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ userRole, userData, onNavigate }) => {
    const isProfessor = userRole === 'professor';
    const [scope, setScope] = useState<'my' | 'general'>(isProfessor ? 'my' : 'general');
    
    const [items, setItems] = useState<ItemDto[]>([]);
    const [movements, setMovements] = useState<MovementDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const itemsPromise = getItems({ pageSize: 1000 });
                
                const movementsPromise = (userRole === 'professor' && userData.id) 
                    ? getMovementsByUser(userData.id) 
                    : getMovements({ pageSize: 1000 });

                const [itemsResult, movementsData] = await Promise.all([itemsPromise, movementsPromise]);
                
                setItems(itemsResult.items || []);
                setMovements(Array.isArray(movementsData) ? movementsData : (movementsData.items || []));

            } catch (err: any) {
                setError('Falha ao carregar dados de análise.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userRole, userData.id]);

    const analyticsData = useMemo(() => {
        const itemCategoryMap = new Map(items.map(i => [i.id, i.attributes?.category || 'Não categorizado']));

        let processedMovements = movements;
        if (userRole === 'warehouse' && scope === 'my' && userData.name) {
            processedMovements = movements.filter(m => m.userFullName === userData.name);
        }

        const totalRequests = processedMovements.length;
        const lowStockItems = items.filter(item => item.stockQuantity > 0 && item.stockQuantity <= 10).length;
        // Mocking fulfillment rate logic as API only returns completed movements usually
        const fulfillmentRate = totalRequests > 0 ? '98%' : 'N/A'; 
        const pendingRequests = 0; // API placeholder
        
        const kpiData = { totalRequests, pendingRequests, lowStockItems, fulfillmentRate };
        
        const chartsData = {
             itemPopularityData: Object.entries(processedMovements.reduce<Record<string, number>>((acc, mov) => {
                if (mov.type === 'CheckOut' && mov.itemName) {
                    acc[mov.itemName] = (acc[mov.itemName] || 0) + mov.quantity;
                }
                return acc;
            }, {}))
            .sort((a, b) => Number(b[1]) - Number(a[1])).slice(0, 7)
            .map(([name, quantity]) => ({ name, requisições: quantity })),

            peakTimesData: Object.entries(processedMovements.reduce<Record<string, number>>((acc, mov) => {
                const day = new Date(mov.movementDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit'});
                acc[day] = (acc[day] || 0) + 1;
                return acc;
            }, {}))
            .map(([name, value]) => ({ name, [scope === 'my' ? 'requisições' : 'entradas']: value }))
            .slice(-30),

            byCategoryData: Object.entries(processedMovements.reduce<Record<string, number>>((acc, mov) => {
                const category = String(itemCategoryMap.get(mov.itemId) || 'Não categorizado');
                acc[category] = (acc[category] || 0) + 1;
                return acc;
            }, {})).map(([name, value]) => ({ name, value })),
        };

        return { kpiData, chartsData };

    }, [userRole, scope, userData.name, items, movements]);
    
    const chartsToDisplay = useMemo(() => {
        if (!analyticsData.chartsData) return [];
        
        const { itemPopularityData, peakTimesData, byCategoryData } = analyticsData.chartsData;
        const baseCharts = scope === 'my' ? myAnalyticsCharts : generalAnalyticsCharts;
        
        return baseCharts.map(chartConfig => {
            const newConfig = {...chartConfig};
            if (chartConfig.id.includes('1')) newConfig.data = byCategoryData;
            if (chartConfig.id.includes('2')) newConfig.data = itemPopularityData;
            if (chartConfig.id.includes('3')) newConfig.data = peakTimesData;
            return newConfig;
        });
        
    }, [scope, userRole, analyticsData]);

    const title = scope === 'my' ? 'Minhas Análises' : 'Análises e BI';
    const subtitle = scope === 'my'
        ? 'Explore os dados e métricas de suas atividades.' 
        : 'Explore os dados e métricas do almoxarifado.';
    
    if (loading) {
        return <div className="flex items-center justify-center h-full text-light-text">Carregando dados de análise...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
    }

    return (
        <div className="h-full flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-0 rounded-none border-none shadow-none">
                <div>
                    <h2 className="text-2xl font-bold text-dark-text">{title}</h2>
                    <p className="text-light-text mt-1 text-sm">{subtitle}</p>
                </div>
                 <div className="flex flex-wrap items-center gap-4">
                    {!isProfessor && (
                        <div className="flex items-center p-1 bg-gray-100 rounded-lg border border-gray-200">
                            <button 
                                onClick={() => setScope('general')}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 ${scope === 'general' ? 'bg-white text-primary shadow-sm' : 'text-light-text hover:text-dark-text'}`}
                            >
                                Informações Gerais
                            </button>
                            <button 
                                onClick={() => setScope('my')}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 ${scope === 'my' ? 'bg-white text-primary shadow-sm' : 'text-light-text hover:text-dark-text'}`}
                            >
                                Minhas Informações
                            </button>
                        </div>
                    )}
                    {onNavigate && (userRole === 'admin' || userRole === 'professor') && (
                         <button 
                            onClick={() => onNavigate('custom-analytics')}
                            className="flex items-center bg-purple-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md hover:bg-purple-800 transition-all duration-300 transform hover:scale-105"
                        >
                            <ChartPieIcon className="w-5 h-5 mr-2" />
                            Gerar Gráfico Personalizado
                        </button>
                    )}
                </div>
            </div>
            
            {/* KPI Cards */}
            <AnalyticsKPIs kpiData={analyticsData.kpiData} />

            {/* Charts Grid */}
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
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