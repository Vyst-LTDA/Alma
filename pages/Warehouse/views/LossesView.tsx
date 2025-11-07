/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState, useEffect } from 'react';
import { UserRole, LossDto } from '../../../types';
import { PlusIcon, TrashIcon } from '../../../components/shared/IconComponents';
import RecordLossModal from '../components/RecordLossModal';
import LossDetailsModal from '../components/LossDetailsModal';
import { getLosses, deleteLoss } from '../../../services/apiService';

interface LossesViewProps {
    userRole: UserRole;
}

const LossesView: React.FC<LossesViewProps> = ({ userRole }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLoss, setSelectedLoss] = useState<LossDto | null>(null);
    const [lossRecords, setLossRecords] = useState<LossDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const fetchLosses = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getLosses();
            setLossRecords(data.sort((a, b) => new Date(b.lossDate).getTime() - new Date(a.lossDate).getTime()));
        } catch (err: any) {
            setError("Falha ao carregar registros de perdas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLosses();
    }, []);

    const handleLossRecorded = () => {
        fetchLosses(); // Re-fetch data after a new loss is recorded
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Tem certeza que deseja excluir o registro de perda para o item "${name}"?`)) {
            try {
                await deleteLoss(id);
                setLossRecords(prev => prev.filter(rec => rec.id !== id));
            } catch (err: any) {
                alert(`Erro ao excluir registro: ${err.message}`);
            }
        }
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
                    {loading ? (
                        <div className="text-center py-10 text-light-text">Carregando registros...</div>
                    ) : error ? (
                        <div className="text-center py-10 text-red-500">{error}</div>
                    ) : (
                        <table className="w-full text-sm text-left text-dark-text">
                            <thead className="text-xs text-light-text uppercase bg-gray-50 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-6 py-3">CÓDIGO DO ITEM</th>
                                    <th scope="col" className="px-6 py-3">Nome do Item</th>
                                    <th scope="col" className="px-6 py-3">Quantidade Perdida</th>
                                    <th scope="col" className="px-6 py-3">Data</th>
                                    <th scope="col" className="px-6 py-3">Registrado por</th>
                                    <th scope="col" className="px-6 py-3 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {lossRecords.length > 0 ? lossRecords.map(record => (
                                    <tr key={record.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono text-primary font-bold">{record.itemCode}</td>
                                        <td className="px-6 py-4 font-semibold">{record.itemName}</td>
                                        <td className="px-6 py-4">{record.quantity}</td>
                                        <td className="px-6 py-4">{new Date(record.lossDate).toLocaleDateString('pt-BR')}</td>
                                        <td className="px-6 py-4 capitalize">{record.recordedBy}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => setSelectedLoss(record)} className="text-primary hover:underline text-xs font-semibold">
                                                    Ver Detalhes
                                                </button>
                                                {userRole === 'admin' && (
                                                    <button onClick={() => handleDelete(record.id, record.itemName)} className="p-1 text-red-500 hover:bg-red-100 rounded-full" title="Excluir Registro">
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={userRole === 'admin' ? 6 : 5} className="text-center py-10 text-light-text">
                                            Nenhum registro de perda encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <RecordLossModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
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