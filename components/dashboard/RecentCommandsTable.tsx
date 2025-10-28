
import React from 'react';
import { Request } from '../../types';
import ChartContainer from './ChartContainer';

const requests: Request[] = [
    { id: 'REQ-001', item: 'Canetões (Caixa)', quantity: 2, requester: 'Prof. Ana', status: 'Entregue', requestDate: '20/10/2023', type: 'Uso Contínuo' },
    { id: 'REQ-002', item: 'Projetor Multimídia', quantity: 1, requester: 'Prof. Carlos', status: 'Aprovado', requestDate: '20/10/2023', type: 'Empréstimo' },
    { id: 'REQ-003', item: 'Livro: Logística Reversa', quantity: 5, requester: 'Prof. Beatriz', status: 'Recusado', requestDate: '19/10/2023', type: 'Empréstimo' },
    { id: 'REQ-004', item: 'Kit de EPIs', quantity: 15, requester: 'Prof. Davi', status: 'Pendente', requestDate: '19/10/2023', type: 'Uso Contínuo' },
    { id: 'REQ-005', item: 'Farinha de Trigo (5kg)', quantity: 3, requester: 'Prof. Elisa', status: 'Entregue', requestDate: '18/10/2023', type: 'Uso Contínuo' },
];

const StatusBadge: React.FC<{ status: Request['status'] }> = ({ status }) => {
    const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full';
    const statusClasses = {
        Aprovado: 'bg-blue-100 text-blue-700',
        Pendente: 'bg-yellow-100 text-yellow-700',
        Recusado: 'bg-red-100 text-red-700',
        Entregue: 'bg-green-100 text-green-700',
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const RecentRequestsTable: React.FC = () => {
    return (
        <ChartContainer title="Requisições Recentes">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-dark-text">
                    <thead className="text-xs text-light-text uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Item</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Data</th>
                            <th scope="col" className="px-6 py-3">Tipo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req) => (
                            <tr key={req.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{req.id}</td>
                                <td className="px-6 py-4">{req.item} (x{req.quantity})</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={req.status} />
                                </td>
                                <td className="px-6 py-4">{req.requestDate}</td>
                                <td className="px-6 py-4">{req.type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </ChartContainer>
    );
};

export default RecentRequestsTable;
