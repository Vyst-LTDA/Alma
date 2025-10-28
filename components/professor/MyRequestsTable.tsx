
import React from 'react';
import { Request } from '../../types';
import ChartContainer from '../dashboard/ChartContainer';

const requests: Request[] = [
    { id: 'REQ-015', item: 'Canetões (Caixa)', quantity: 2, requester: 'Você', status: 'Entregue', requestDate: '20/10/2023', type: 'Uso Contínuo' },
    { id: 'REQ-018', item: 'Projetor Multimídia', quantity: 1, requester: 'Você', status: 'Aprovado', requestDate: '22/10/2023', type: 'Empréstimo' },
    { id: 'REQ-021', item: 'Livro: Logística Reversa', quantity: 5, requester: 'Você', status: 'Recusado', requestDate: '23/10/2023', type: 'Empréstimo' },
    { id: 'REQ-022', item: 'Kit de EPIs', quantity: 15, requester: 'Você', status: 'Pendente', requestDate: '24/10/2023', type: 'Uso Contínuo' },
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

const MyRequestsTable: React.FC = () => {
    return (
        <div className="bg-light-card p-6 rounded-xl border border-gray-200">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-dark-text">
                    <thead className="text-xs text-light-text uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Item Solicitado</th>
                            <th scope="col" className="px-6 py-3">Quantidade</th>
                            <th scope="col" className="px-6 py-3">Data</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req) => (
                            <tr key={req.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{req.id}</td>
                                <td className="px-6 py-4">{req.item}</td>
                                <td className="px-6 py-4">{req.quantity}</td>
                                <td className="px-6 py-4">{req.requestDate}</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={req.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyRequestsTable;
