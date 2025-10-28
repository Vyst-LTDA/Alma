/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useMemo, useState } from 'react';
import StatCard from '../../Warehouse/components/StatCard';
import { ClockIcon, CheckCircleIcon, FileTextIcon } from '../../../components/shared/IconComponents';
import { allRequests } from '../../../data/mockData';
import { UserData } from '../../../types';
import DynamicChart from '../../../components/shared/DynamicChart';
import ChartContainer from '../../../components/shared/ChartContainer';
import { professorDashboardCharts } from '../../../data/mockCharts';

interface ProfessorDashboardProps {
    onNewRequest: () => void;
    userData: UserData;
}

const ProfessorDashboard: React.FC<ProfessorDashboardProps> = ({ onNewRequest, userData }) => {
    const currentUserName = userData.name;

    const myData = useMemo(() => {
        const requests = allRequests.filter(r => r.requester === currentUserName);
        
        const pendingRequests = requests.filter(r => r.status === 'Pendente').length;
        
        const requestsThisMonth = requests.filter(r => {
            try {
                const [day, month, year] = r.requestDate.split('/');
                return new Date().getMonth() + 1 === parseInt(month, 10);
            } catch(e) { return false; }
        }).length;
        
        return { pendingRequests, requestsThisMonth };
    }, [currentUserName]);

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
                    value={String(myData.pendingRequests)} 
                    change="" 
                    changeType="neutral" 
                    icon={<ClockIcon className="w-8 h-8 text-primary" />} 
                />
                <StatCard 
                    title="Requisições no Mês" 
                    value={String(myData.requestsThisMonth)} 
                    change="" 
                    changeType="neutral" 
                    icon={<CheckCircleIcon className="w-8 h-8 text-green-500" />} 
                />
            </div>

            {/* Charts */}
            <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {professorDashboardCharts.map(chart => (
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
        </>
    );
};

export default ProfessorDashboard;