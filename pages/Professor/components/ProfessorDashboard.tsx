/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useMemo, useState, useEffect } from 'react';
import StatCard from '../../Warehouse/components/StatCard';
import { ClockIcon, CheckCircleIcon, FileTextIcon } from '../../../components/shared/IconComponents';
import { UserData, ChartConfig, MovementDto, ItemDto, Request } from '../../../types';
import DynamicChart from '../../../components/shared/DynamicChart';
import ChartContainer from '../../../components/shared/ChartContainer';
import { getMovementsByUser, getItems } from '../../../services/apiService';
import ActiveLoansTable from './ActiveLoansTable';

interface ProfessorDashboardProps {
    onNewRequest: () => void;
    userData: UserData;
    refreshKey: number;
}

const ProfessorDashboard: React.FC<ProfessorDashboardProps> = ({ onNewRequest, userData, refreshKey }) => {
    const [loading, setLoading] = useState(true);
    const [myData, setMyData] = useState({ pendingRequests: 0, requestsThisMonth: 0 });
    const [myCharts, setMyCharts] = useState<ChartConfig[]>([]);
    const [activeLoans, setActiveLoans] = useState<Request[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            if (!userData.id) return;
            setLoading(true);
            try {
                const [movements, itemsResult] = await Promise.all([
                    getMovementsByUser(userData.id),
                    getItems({ pageSize: 1000 })
                ]);

                const userCheckouts = movements.filter(m => m.type === 'CheckOut');

                const now = new Date();
                const requestsThisMonth = userCheckouts.filter(m => {
                    const movementDate = new Date(m.movementDate);
                    return movementDate.getMonth() === now.getMonth() && movementDate.getFullYear() === now.getFullYear();
                }).length;

                setMyData({ pendingRequests: 0, requestsThisMonth });

                const itemCategoryMap = new Map(itemsResult.items.map(i => [i.id, i.attributes?.category || 'Não categorizado']));

                const loans = userCheckouts
                   .map(mov => {
                       const obs = mov.observations || '';
                       const isLoan = obs.includes('Tipo: Empréstimo');
                       if (!isLoan) return null;

                       const returnDateMatch = obs.match(/Devolução: ([\d-]+)\./);
                       const returnDateStr = returnDateMatch ? returnDateMatch[1] : undefined;

                       const request: Request = {
                           id: mov.id,
                           item: mov.itemName || 'N/A',
                           quantity: mov.quantity,
                           requester: mov.userFullName || 'N/A',
                           status: 'Aprovado',
                           requestDate: new Date(mov.movementDate).toLocaleDateString('pt-BR'),
                           type: 'Empréstimo',
                           category: itemCategoryMap.get(mov.itemId) || 'N/A',
                           unit: 'UN', // Mock data
                           returnDate: returnDateStr ? new Date(returnDateStr.replace(/-/g, '\/')).toLocaleDateString('pt-BR') : undefined
                       };
                       
                       if (returnDateStr) {
                           const today = new Date();
                           today.setHours(0, 0, 0, 0);
                           const [year, month, day] = returnDateStr.split('-');
                           const due = new Date(Number(year), Number(month) - 1, Number(day));
                           due.setHours(0, 0, 0, 0);
                           if (due >= today) {
                               return request;
                           }
                       }
                       return null;
                   })
                   .filter((r): r is Request => r !== null);
               
                setActiveLoans(loans);

                const monthlyData = userCheckouts.reduce((acc, mov) => {
                    const month = new Date(mov.movementDate).toLocaleString('pt-BR', { month: 'short' });
                    acc[month] = (acc[month] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>);
                const monthlyChartData = Object.entries(monthlyData).map(([name, value]) => ({ name, 'requisições': value }));

                const byCategoryData = userCheckouts.reduce((acc, mov) => {
                    const category = itemCategoryMap.get(mov.itemId) || 'Não categorizado';
                    acc[category] = (acc[category] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>);
                const categoryChartData = Object.entries(byCategoryData).map(([name, value]) => ({ name, value }));

                setMyCharts([
                    { id: 'pd2', title: 'Histórico Mensal de Requisições', type: 'bar', data: monthlyChartData, dataKey: 'requisições', nameKey: 'name' },
                    { id: 'pd4', title: 'Requisições por Categoria', type: 'pie', data: categoryChartData, dataKey: 'value', nameKey: 'name' }
                ]);

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userData.id, refreshKey]);

    const title = 'Meu Painel';

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-dark-text">{title}</h2>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                      onClick={onNewRequest}
                      className="flex items-center bg-primary text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
                    >
                        <FileTextIcon className="w-5 h-5 mr-2" />
                        Nova Requisição
                    </button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <StatCard 
                    title="Requisições Pendentes" 
                    value={loading ? '...' : String(myData.pendingRequests)} 
                    change="" 
                    changeType="neutral" 
                    icon={<ClockIcon className="w-8 h-8 text-primary" />} 
                />
                <StatCard 
                    title="Requisições no Mês" 
                    value={loading ? '...' : String(myData.requestsThisMonth)} 
                    change="" 
                    changeType="neutral" 
                    icon={<CheckCircleIcon className="w-8 h-8 text-green-500" />} 
                />
            </div>

            {/* Charts */}
            <div className="space-y-8">
                {loading ? (
                    <div className="text-center py-10 text-light-text">Carregando dados...</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {myCharts.map(chart => (
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
                        <div className="mt-8">
                           <ActiveLoansTable loans={activeLoans} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default ProfessorDashboard;
