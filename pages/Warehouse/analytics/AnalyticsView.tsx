/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useMemo } from 'react';
import { ChartPieIcon } from '../../../components/shared/IconComponents';
import AnalyticsKPIs from '../analytics/AnalyticsKPIs';
import ItemPopularityChart from '../analytics/ItemPopularityChart';
import PeakRequestTimesChart from '../analytics/PeakRequestTimesChart';
import RequestsByCategoryChart from '../analytics/RequestsByCategoryChart';
import { UserRole } from '../../../types';
import { allRequests, allEducationalRequests } from '../../../data/mockData';
import InventoryTurnoverChart from '../components/InventoryTurnoverChart';


interface AnalyticsViewProps {
    userRole: UserRole;
    onNavigate?: (view: string) => void;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ userRole, onNavigate }) => {

     const analyticsData = useMemo(() => {
        let requests = allRequests;
        if (userRole === 'warehouse') {
            requests = allEducationalRequests;
        } else if (userRole === 'professor') {
            // Hardcoded for 'Ana Pereira' as per professor dashboard context
            requests = allRequests.filter(r => r.requester === 'Ana Pereira');
        }

        const itemPopularity = requests.reduce((acc, req) => {
            acc[req.item] = (acc[req.item] || 0) + req.quantity;
            return acc;
        }, {} as Record<string, number>);
        const itemPopularityData = Object.entries(itemPopularity)
            .sort(([,a],[,b]) => b - a)
            .slice(0, 7)
            .map(([name, quantity]) => ({ name, Quantidade: quantity }));

        const peakTimes = requests.reduce((acc, req) => {
            const day = req.requestDate.slice(0, 5); // DD/MM
            acc[day] = (acc[day] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const peakTimesData = Object.entries(peakTimes)
            .map(([name, value]) => ({ name, 'Requisições': value }))
            .slice(-30); // Last 30 days with activity

        const byCategory = requests.reduce((acc, req) => {
            const category = req.category || 'Não categorizado';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const byCategoryData = Object.entries(byCategory).map(([name, value]) => ({ name, value }));

        const turnoverData = [
            { name: 'Jan', giro: 1.2 }, { name: 'Fev', giro: 1.5 },
            { name: 'Mar', giro: 1.4 }, { name: 'Abr', giro: 1.8 },
            { name: 'Mai', giro: 2.1 }, { name: 'Jun', giro: 2.5 },
        ];
        
        return { itemPopularityData, peakTimesData, byCategoryData, turnoverData };
    }, [userRole]);

    const title = (userRole === 'professor' || userRole === 'warehouse') ? 'Minhas Análises' : 'Análises e BI';
    const subtitle = (userRole === 'professor' || userRole === 'warehouse')
        ? 'Explore os dados e métricas de suas atividades no almoxarifado.' 
        : 'Explore os dados e métricas do almoxarifado.';

    return (
        <>
            <div className="h-full flex flex-col gap-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-dark-text">
                            {title}
                        </h2>
                        <p className="text-light-text mt-1">
                           {subtitle}
                        </p>
                    </div>
                     <div className="flex items-center gap-4 mt-4 md:mt-0">
                        {userRole === 'admin' && onNavigate && (
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
                
                {/* KPIs */}
                <AnalyticsKPIs userRole={userRole} />

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ItemPopularityChart userRole={userRole} data={analyticsData.itemPopularityData} />
                    <PeakRequestTimesChart userRole={userRole} data={analyticsData.peakTimesData} />
                    <div className="lg:col-span-2">
                        <RequestsByCategoryChart userRole={userRole} data={analyticsData.byCategoryData} />
                    </div>
                     <div className="lg:col-span-2">
                        <InventoryTurnoverChart data={analyticsData.turnoverData} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AnalyticsView;
