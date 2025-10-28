import React, { useState, useEffect } from 'react';
import { Request } from '../../../types';
import ChartContainer from '../../../components/shared/ChartContainer';
import StatusBadge from '../../../components/shared/StatusBadge';

interface WithdrawalHistoryTableProps {
    onNavigate: (view: string) => void;
}

const WithdrawalHistoryTable: React.FC<WithdrawalHistoryTableProps> = ({ onNavigate }) => {
    const [withdrawalHistory, setWithdrawalHistory] = useState<Request[]>([]);

    useEffect(() => {
        // TODO: Implementar a chamada à API para buscar o histórico de retiradas do usuário.
        // Exemplo:
        // const fetchHistory = async () => {
        //     const response = await fetch('/api/user/withdrawal-history');
        //     const data = await response.json();
        //     setWithdrawalHistory(data);
        // };
        // fetchHistory();
    }, []); // O array vazio garante que o efeito rode apenas uma vez, no momento da montagem.

    return (
        <ChartContainer 
            title="Histórico de Retirada de Itens"
            viewMoreLink={{ label: "Ver Todas as Solicitações", onClick: () => onNavigate('requests') }}
        >
            <div className="overflow-x-auto h-full">
                <table className="w-full text-sm text-left text-dark-text">
                    <thead className="text-xs text-light-text uppercase bg-gray-50/50 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">Código</th>
                            <th scope="col" className="px-6 py-3">Item</th>
                            <th scope="col" className="px-6 py-3">Categoria</th>
                            <th scope="col" className="px-6 py-3">Qtd.</th>
                            <th scope="col" className="px-6 py-3">Solicitante</th>
                            <th scope="col" className="px-6 py-3">Data</th>
                            <th scope="col" className="px-6 py-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {withdrawalHistory.length > 0 ? withdrawalHistory.map((req) => (
                            <tr key={req.id} className="bg-white border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-primary">{req.id}</td>
                                <td className="px-6 py-4">{req.item}</td>
                                <td className="px-6 py-4">{req.category || '--'}</td>
                                <td className="px-6 py-4">{req.quantity} {req.unit}</td>
                                <td className="px-6 py-4">{req.requester}</td>
                                <td className="px-6 py-4">{req.requestDate}</td>
                                <td className="px-6 py-4 text-center">
                                    <StatusBadge status={req.status} />
                                </td>
                            </tr>
                        )) : (
                           <tr>
                                <td colSpan={7} className="text-center py-10 text-light-text">
                                    Nenhuma retirada registrada ainda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </ChartContainer>
    );
};

export default WithdrawalHistoryTable;