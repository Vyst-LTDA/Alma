/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState, useMemo, useEffect } from 'react';
import { Request, MovementDto } from '../../../types';
import StatusBadge from '../../../components/shared/StatusBadge';
import { SearchIcon, DotsVerticalIcon } from '../../../components/shared/IconComponents';
import { getMovements } from '../../../services/apiService';

const mapMovementDtoToRequest = (dto: MovementDto): Request => {
    const isCheckOut = dto.type === 'CheckOut';
    return {
        id: dto.id,
        item: dto.itemName || 'N/A',
        quantity: dto.quantity,
        requester: dto.userFullName || 'N/A',
        status: isCheckOut ? 'Entregue' : 'Aprovado', // Aprovado = CheckIn, Entregue = CheckOut
        requestDate: new Date(dto.movementDate).toLocaleDateString('pt-BR'),
        type: isCheckOut ? 'Uso Contínuo' : 'Entrada',
        category: 'N/A', // This info isn't in MovementDto
        unit: 'UN' // This info isn't in MovementDto
    };
};


interface RequestsManagementTableProps {
    refreshKey?: number;
    movementType?: 'CheckIn' | 'CheckOut' | 'all';
}

const RequestsManagementTable: React.FC<RequestsManagementTableProps> = ({ refreshKey, movementType = 'all' }) => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<Request['status'] | 'Todos'>('Todos');

    useEffect(() => {
        const fetchMovements = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch a large page to simulate getting all data for client-side filtering by type
                const result = await getMovements({ pageNumber: 1, pageSize: 500, searchTerm: searchTerm });
                let movements = result.items.map(mapMovementDtoToRequest);
                
                if(movementType !== 'all') {
                    const targetType = movementType === 'CheckIn' ? 'Entrada' : 'Uso Contínuo';
                    movements = movements.filter(m => m.type === targetType);
                }

                setRequests(movements);
            } catch (err: any) {
                setError(err.message || 'Falha ao carregar movimentos.');
            } finally {
                setLoading(false);
            }
        };

        const debounceFetch = setTimeout(() => {
            fetchMovements();
        }, 300);

        return () => clearTimeout(debounceFetch);
    }, [searchTerm, refreshKey, movementType]);


    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            const matchesStatus = statusFilter === 'Todos' || req.status === statusFilter;
            return matchesStatus; // Search is handled by API
        }).sort((a, b) => new Date(b.requestDate.split('/').reverse().join('-')).getTime() - new Date(a.requestDate.split('/').reverse().join('-')).getTime());
    }, [requests, statusFilter]);

    return (
        <div className="bg-light-card p-6 rounded-xl border border-gray-200 h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <div className="relative w-full md:w-1/3">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por item, ID ou solicitante..."
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
                        <option value="Aprovado">Entradas Aprovadas</option>
                        <option value="Entregue">Saídas Entregues</option>
                    </select>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto">
                 {loading ? (
                    <div className="flex items-center justify-center h-full text-light-text">Carregando histórico...</div>
                ) : error ? (
                    <div className="flex items-center justify-center h-full text-red-500">{error}</div>
                ) : (
                    <table className="w-full text-sm text-left text-dark-text">
                        <thead className="text-xs text-light-text uppercase bg-gray-50 sticky top-0">
                            <tr>
                                <th scope="col" className="px-6 py-3">Código</th>
                                <th scope="col" className="px-6 py-3">Item</th>
                                <th scope="col" className="px-6 py-3">Qtd.</th>
                                <th scope="col" className="px-6 py-3">Solicitante</th>
                                <th scope="col" className="px-6 py-3">Data</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredRequests.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-primary">{req.id}</td>
                                    <td className="px-6 py-4 font-semibold">{req.item}</td>
                                    <td className="px-6 py-4">{req.quantity} {req.unit}</td>
                                    <td className="px-6 py-4 font-medium">{req.requester}</td>
                                    <td className="px-6 py-4 text-xs text-light-text">{req.requestDate}</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={req.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center">
                                            <button className="p-2 rounded-full hover:bg-gray-100">
                                                <DotsVerticalIcon className="w-5 h-5 text-gray-500" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                 {!loading && !error && filteredRequests.length === 0 && (
                    <div className="text-center py-10 text-light-text">
                        <p>Nenhuma movimentação encontrada com os filtros atuais.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestsManagementTable;