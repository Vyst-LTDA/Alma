/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState, useMemo } from 'react';
import { UserRole, LossRecord } from '../../../types';
import { mockLossRecords } from '../../../data/mockData';
import { PlusIcon } from '../../../components/shared/IconComponents';
import RecordLossModal from '../components/RecordLossModal';
import LossDetailsModal from '../components/LossDetailsModal';

interface LossesViewProps {
    userRole: UserRole;
}

const LossesView: React.FC<LossesViewProps> = ({ userRole }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLoss, setSelectedLoss] = useState<LossRecord | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    
    // FIX: Added 'professor' role and corrected 'warehouse' role name for consistency.
    const roleDisplayNames: Record<UserRole, string> = {
        warehouse: 'Almoxarifado',
        admin: 'Administrador',
        professor: 'Docente',
    };

    const lossRecords = useMemo(() => {
        if (userRole === 'admin') {
            return mockLossRecords;
        }
        return mockLossRecords.filter(record => record.recordedBy === userRole);
    }, [userRole, refreshKey]);

    const handleLossRecorded = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-dark-text">Gerenciamento de Perdas</h2>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center bg-primary text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-primary/90 transition-all"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Registrar Perda
                </button>
            </div>

            <div className="bg-light-card p-6 rounded-xl border border-gray-200 h-full flex flex-col">
                <div className="flex-grow overflow-y-auto">
                    <table className="w-full text-sm text-left text-dark-text">
                        <thead className="text-xs text-light-text uppercase bg-gray-50 sticky top-0">
                            <tr>
                                <th scope="col" className="px-6 py-3">CÓDIGO</th>
                                <th scope="col" className="px-6 py-3">Nome do Item</th>
                                <th scope="col" className="px-6 py-3">Quantidade Perdida</th>
                                <th scope="col" className="px-6 py-3">Data</th>
                                {userRole === 'admin' && <th scope="col" className="px-6 py-3">Registrado por</th>}
                                {userRole === 'admin' && <th scope="col" className="px-6 py-3 text-center">Ações</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {lossRecords.map(record => (
                                <tr key={record.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-primary font-bold">{record.itemCode}</td>
                                    <td className="px-6 py-4 font-semibold">{record.itemName}</td>
                                    <td className="px-6 py-4">{record.quantity}</td>
                                    <td className="px-6 py-4">{record.date}</td>
                                    {userRole === 'admin' && <td className="px-6 py-4 capitalize">{roleDisplayNames[record.recordedBy] || record.recordedBy}</td>}
                                    {userRole === 'admin' && (
                                        <td className="px-6 py-4 text-center">
                                            <button onClick={() => setSelectedLoss(record)} className="text-primary hover:underline text-xs font-semibold">
                                                Ver Detalhes
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {lossRecords.length === 0 && (
                        <div className="text-center py-10 text-light-text">
                            <p>Nenhum registro de perda encontrado.</p>
                        </div>
                    )}
                </div>
            </div>

            <RecordLossModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userRole={userRole}
                onLossRecorded={handleLossRecorded}
            />
            <LossDetailsModal
                isOpen={!!selectedLoss}
                onClose={() => setSelectedLoss(null)}
                lossRecord={selectedLoss}
            />
        </div>
    );
};

export default LossesView;