/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState, useMemo } from 'react';
import { Request } from '../../../types';
import StatusBadge from '../../../components/shared/StatusBadge';
import { SearchIcon, DotsVerticalIcon } from '../../../components/shared/IconComponents';

const ActionMenu: React.FC<{ request: Request }> = ({ request }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-gray-200">
                <DotsVerticalIcon className="w-5 h-5 text-gray-500" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <ul className="py-1">
                        <li><a href="#" className="block px-4 py-2 text-sm text-dark-text hover:bg-gray-100">Ver Detalhes</a></li>
                    </ul>
                </div>
            )}
        </div>
    )
}

interface MyRequestsTableProps {
    requests: Request[];
}

const MyRequestsTable: React.FC<MyRequestsTableProps> = ({ requests }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<Request['status'] | 'Todos'>('Todos');

    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            const matchesSearch = req.item.toLowerCase().includes(searchTerm.toLowerCase()) || req.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'Todos' || req.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [requests, searchTerm, statusFilter]);

    return (
        <div className="bg-light-card p-6 rounded-xl border border-gray-200">
            {/* Header com Filtros */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <div className="relative w-full md:w-1/3">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por item ou código..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                    />
                </div>
                <div className="w-full md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as any)}
                        className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition bg-white text-black"
                    >
                        <option value="Todos">Todos os Status</option>
                        <option value="Pendente">Pendente</option>
                        <option value="Aprovado">Aprovado</option>
                        <option value="Entregue">Entregue</option>
                        <option value="Recusado">Recusado</option>
                    </select>
                </div>
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-dark-text">
                    <thead className="text-xs text-light-text uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Código</th>
                            <th scope="col" className="px-6 py-3">Item Solicitado</th>
                            <th scope="col" className="px-6 py-3">Categoria</th>
                            <th scope="col" className="px-6 py-3">Quantidade</th>
                            <th scope="col" className="px-6 py-3">Data</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.length > 0 ? filteredRequests.map((req) => (
                            <tr key={req.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-primary">{req.id}</td>
                                <td className="px-6 py-4 font-semibold">{req.item}</td>
                                <td className="px-6 py-4">{req.category || '--'}</td>
                                <td className="px-6 py-4">{req.quantity} {req.unit}</td>
                                <td className="px-6 py-4">{req.requestDate}</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={req.status} />
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <ActionMenu request={req} />
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={7} className="text-center py-10 text-light-text">
                                    Nenhuma requisição encontrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyRequestsTable;