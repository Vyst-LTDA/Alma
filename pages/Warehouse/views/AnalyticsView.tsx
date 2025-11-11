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
            // Filter movements made by the current warehouse user
            processedMovements = movements.filter(m => m.userFullName === userData.name);
        }

        const totalRequests = processedMovements.length;
        const lowStockItems = items.filter(item => item.stockQuantity > 0 && item.stockQuantity <= 10).length;
        // In the API, a movement is a completed action, so fulfillment is 100% of recorded movements.
        const fulfillmentRate = totalRequests > 0 ? '100%' : 'N/A';
        // The API does not have a "pending" status for movements.
        const kpiData = { totalRequests, pendingRequests: 0, lowStockItems, fulfillmentRate };
        
        const chartsData = {
            // FIX: Use generic type argument on reduce to ensure correct type inference for `acc` and sort variables.
             itemPopularityData: Object.entries(processedMovements.reduce<Record<string, number>>((acc, mov) => {
                if (mov.type === 'CheckOut' && mov.itemName) {
                    acc[mov.itemName] = (acc[mov.itemName] || 0) + mov.quantity;
                }
                return acc;
            }, {}))
            // FIX: Refactor sort to be more explicit with array indices to prevent type errors.
            // FIX: Explicitly cast array values to numbers before subtraction to resolve TypeScript error.
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
                // FIX: Cast category to string to use as an index type
                const category = String(itemCategoryMap.get(mov.itemId) || 'Não categorizado');
                acc[category] = (acc[category] || 0) + 1;
                return acc;
            }, {})).map(([name, value]) => ({ name, value })),
            
            // Turnover is complex and cannot be calculated from API data. Keep mock.
            turnoverData: [
                { name: 'Jan', giro: 1.2 }, { name: 'Fev', giro: 1.5 },
                { name: 'Mar', giro: 1.4 }, { name: 'Abr', giro: 1.8 },
                { name: 'Mai', giro: 2.1 }, { name: 'Jun', giro: 2.5 },
            ],
        };

        return { kpiData, chartsData };

    }, [userRole, scope, userData.name, items, movements]);
    
    const chartsToDisplay = useMemo(() => {
        if (!analyticsData.chartsData) return [];
        
        const { itemPopularityData, peakTimesData, byCategoryData } = analyticsData.chartsData;
        const baseCharts = scope === 'my' ? myAnalyticsCharts : generalAnalyticsCharts;
        
        // Create new chart configs with live data to avoid mutating the imported mock data.
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
        ? 'Explore os dados e métricas de suas atividades no almoxarifado.' 
        : 'Explore os dados e métricas do almoxarifado.';
    
    if (loading) {
        return <div className="flex items-center justify-center h-full">Carregando dados de análise...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
    }

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
                            Gerar Gráfico
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