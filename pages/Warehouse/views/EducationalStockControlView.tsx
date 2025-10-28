/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState, useMemo } from 'react';
import EducationalRegisterItemForm from '../components/EducationalRegisterItemForm';
import EducationalStockItemsTable from '../components/EducationalStockItemsTable';
import { PlusIcon, ArchiveIcon, ArrowUturnLeftIcon } from '../../../components/shared/IconComponents';
import { UserRole, Request } from '../../../types';
import RequestsManagementTable from '../components/RequestsManagementTable';
import { allEducationalRequests } from '../../../data/mockData';
import EducationalAddStockEntryModal from '../components/EducationalAddStockEntryModal';

interface StockEntriesViewProps {
    userRole: UserRole;
    onBack: () => void;
}

const StockEntriesView: React.FC<StockEntriesViewProps> = ({ userRole, onBack }) => {
    const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const incomingRequests = useMemo(() => 
        allEducationalRequests.filter(req => req.status === 'Pendente' || req.status === 'Aprovado'), 
    [refreshKey]);
    
    const handleEntryAdded = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <ArrowUturnLeftIcon className="w-6 h-6 text-dark-text" />
                    </button>
                    <h2 className="text-2xl font-bold text-dark-text">Gerenciar Entradas de Estoque</h2>
                </div>
                <button 
                    onClick={() => setIsAddEntryModalOpen(true)}
                    className="flex items-center bg-primary text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-primary/90 transition-all"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Adicionar item ao estoque
                </button>
            </div>
            
            <div className="flex-grow mt-4">
                <RequestsManagementTable 
                    key={refreshKey}
                    requests={incomingRequests} 
                />
            </div>
            
            <EducationalAddStockEntryModal 
                isOpen={isAddEntryModalOpen} 
                onClose={() => setIsAddEntryModalOpen(false)}
                userRole={userRole}
                onEntryAdded={handleEntryAdded}
            />
        </div>
    )
}

interface EducationalStockControlViewProps {
    userRole: UserRole;
}

const EducationalStockControlView: React.FC<EducationalStockControlViewProps> = ({ userRole }) => {
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [currentSubView, setCurrentSubView] = useState<'main' | 'entries'>('main');
    const [refreshKey, setRefreshKey] = useState(0);

    if (currentSubView === 'entries') {
        return <StockEntriesView userRole={userRole} onBack={() => setCurrentSubView('main')} />;
    }

    const handleItemRegistered = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-dark-text">Controle de Estoque (Almoxarifado)</h2>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setCurrentSubView('entries')}
                        className="flex items-center bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-all"
                    >
                        <ArchiveIcon className="w-5 h-5 mr-2" />
                        Gerenciar Entrada de Itens
                    </button>
                    <button 
                        onClick={() => setIsRegisterModalOpen(true)}
                        className="flex items-center bg-primary text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-primary/90 transition-all"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Registrar Novo Item
                    </button>
                </div>
            </div>
            
            <div className="flex-grow">
                <EducationalStockItemsTable key={refreshKey} />
            </div>

            {isRegisterModalOpen && <EducationalRegisterItemForm isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} onItemRegistered={handleItemRegistered} />}
        </div>
    );
}

export default EducationalStockControlView;
