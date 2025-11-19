/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useMemo, useState, useEffect } from 'react';
import StatCard from '../../Warehouse/components/StatCard';
import { ClockIcon, CheckCircleIcon, FileTextIcon, ExclamationTriangleIcon, ArchiveIcon, CircleStackIcon } from '../../../components/shared/IconComponents';
import { UserData, ChartConfig, Request } from '../../../types';
import DynamicChart from '../../../components/shared/DynamicChart';
import ChartContainer from '../../../components/shared/ChartContainer';
import { getMovementsByUser, getItems } from '../../../services/apiService';
import ActiveLoansTable from './ActiveLoansTable';

interface ProfessorDashboardProps {
    onNewRequest: () => void;
    userData: UserData;
    refreshKey: number;
}

const parseDateString = (dateString: string | undefined): Date | null => {
    if (!dateString) return null;
    let date: Date | null = null;
    
    const ptMatch = dateString.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
    if (ptMatch) {
        date = new Date(Date.UTC(Number(ptMatch[3]), Number(ptMatch[2]) - 1, Number(ptMatch[1])));
    } else {
        const isoMatch = dateString.match(/^(\d{4})[-/](\d{2})[-/](\d{2})$/);
        if (isoMatch) {
            date = new Date(Date.UTC(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3])));
        } else {
            const d = new Date(dateString);
            if (!isNaN(d.getTime())) {
                date = d;
            }
        }
    }
    return (date && !isNaN(date.getTime())) ? date : null;
};

const parseAndFormatDate = (dateString: string | undefined): string | undefined => {
    if (!dateString) return undefined;
    const date = parseDateString(dateString);
    if (date) {
        return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    }
    return dateString;
};


const ProfessorDashboard: React.FC<ProfessorDashboardProps> = ({ onNewRequest, userData, refreshKey }) => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        approvedLastMonth: 0,
        pending: 0,
        deniedLastMonth: 0,
        overdue: 0,
        activeLoans: 0
    });
    const [myCharts, setMyCharts] = useState<ChartConfig[]>([]);
    const [activeLoansList, setActiveLoansList] = useState<Request[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            if (!userData.id) return;
            setLoading(true);
            try {
                const [movements, itemsResult] = await Promise.all([
                    getMovementsByUser(userData.id),
                    getItems({ pageSize: 1000 })
                ]);

                // Helpers for dates
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const currentMonth = today.getMonth();
                const currentYear = today.getFullYear();
                
                const lastMonthDate = new Date();
                lastMonthDate.setMonth(currentMonth - 1);
                const lastMonth = lastMonthDate.getMonth();
                const lastMonthYear = lastMonthDate.getFullYear();

                const itemCategoryMap = new Map(itemsResult.items.map(i => [i.id, i.attributes?.category || 'Não categorizado']));
                const userCheckouts = movements.filter(m => m.type === 'CheckOut');

                // 1. Requisições Aprovadas (Último Mês)
                // Considerando CheckOut como "Aprovado/Entregue"
                const approvedLastMonth = userCheckouts.filter(m => {
                    const d = new Date(m.movementDate);
                    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
                }).length;

                // 2. Requisições em Espera (Dados Atuais)
                // API limita isso, mas vamos simular ou usar dados se disponíveis. 
                // Como a API retorna 'movements' (ações concluídas), assumimos 0 ou dados mockados para visualização se não houver endpoint de "Pedidos"
                const pending = 0; 

                // 3. Requisições Negadas (Último Mês)
                // Mesma limitação da API de movimentos.
                const deniedLastMonth = 0;

                // Process Loans for Overdue and Active
                let overdueCount = 0;
                let activeLoansCount = 0;
                const loans: Request[] = [];

                userCheckouts.forEach(mov => {
                    const obs = mov.observations || '';
                    const isLoan = obs.includes('Tipo: Empréstimo');
                    
                    if (isLoan) {
                       const returnDateMatch = obs.match(/Devolução: ([\d/-]+)\./);
                       const returnDateStr = returnDateMatch ? returnDateMatch[1] : undefined;
                       const returnDateObj = parseDateString(returnDateStr);

                       if (returnDateObj) {
                           // Remove time part for comparison
                           returnDateObj.setHours(0,0,0,0);

                           // Active Loan Logic: If return date is today or future
                           if (returnDateObj >= today) {
                               activeLoansCount++;
                               loans.push({
                                   id: mov.id,
                                   item: mov.itemName || 'N/A',
                                   quantity: mov.quantity,
                                   requester: mov.userFullName || 'N/A',
                                   status: 'Aprovado',
                                   requestDate: new Date(mov.movementDate).toLocaleDateString('pt-BR'),
                                   type: 'Empréstimo',
                                   category: itemCategoryMap.get(mov.itemId) || 'N/A',
                                   unit: 'UN',
                                   returnDate: parseAndFormatDate(returnDateStr)
                               });
                           } 
                           // Overdue Logic: If return date is in the past
                           else if (returnDateObj < today) {
                               overdueCount++;
                               // We can optionally add overdue loans to the table or keep them separate
                               // For now, let's add them to the table so the user sees what is overdue
                               loans.push({
                                   id: mov.id,
                                   item: mov.itemName || 'N/A',
                                   quantity: mov.quantity,
                                   requester: mov.userFullName || 'N/A',
                                   status: 'Aprovado', // Technical status
                                   requestDate: new Date(mov.movementDate).toLocaleDateString('pt-BR'),
                                   type: 'Empréstimo',
                                   category: itemCategoryMap.get(mov.itemId) || 'N/A',
                                   unit: 'UN',
                                   returnDate: parseAndFormatDate(returnDateStr)
                               });
                           }
                       }
                    }
                });

                setStats({
                    approvedLastMonth,
                    pending,
                    deniedLastMonth,
                    overdue: overdueCount,
                    activeLoans: activeLoansCount
                });
                
                setActiveLoansList(loans);

                // Charts Data
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

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-dark-text">Dashboard</h2>
                </div>
            </div>

            {/* Stat Cards - 5 Requested Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <StatCard 
                    title="Aprovadas (Mês Anterior)" 
                    value={loading ? '...' : String(stats.approvedLastMonth)} 
                    change="" 
                    changeType="neutral" 
                    icon={<CheckCircleIcon className="w-8 h-8 text-green-500" />} 
                />
                <StatCard 
                    title="Em espera (Atual)" 
                    value={loading ? '...' : String(stats.pending)} 
                    change="" 
                    changeType="neutral" 
                    icon={<ClockIcon className="w-8 h-8 text-yellow-500" />} 
                />
                <StatCard 
                    title="Negadas (Mês Anterior)" 
                    value={loading ? '...' : String(stats.deniedLastMonth)} 
                    change="" 
                    changeType="neutral" 
                    icon={<ExclamationTriangleIcon className="w-8 h-8 text-red-500" />} 
                />
                 <StatCard 
                    title="Prazos Esgotados" 
                    value={loading ? '...' : String(stats.overdue)} 
                    change="" 
                    changeType="neutral" 
                    icon={<ExclamationTriangleIcon className="w-8 h-8 text-orange-600" />} 
                />
                <StatCard 
                    title="Empréstimos Ativos" 
                    value={loading ? '...' : String(stats.activeLoans)} 
                    change="" 
                    changeType="neutral" 
                    icon={<CircleStackIcon className="w-8 h-8 text-blue-500" />} 
                />
            </div>

            {/* Charts & Table */}
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
                           <ActiveLoansTable loans={activeLoansList} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default ProfessorDashboard;