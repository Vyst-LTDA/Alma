import React, { useState, useEffect } from 'react';
import { getAuditLogs } from '../../../services/apiService';
import { AuditLogDto, AuditLogDtoPagedResult } from '../../../types';

const AuditLogView: React.FC = () => {
    const [auditData, setAuditData] = useState<AuditLogDtoPagedResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [filters, setFilters] = useState({
        pageNumber: 1,
        pageSize: 15,
        startDate: '',
        endDate: '',
        userId: '',
        eventType: ''
    });

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = {
                    pageNumber: filters.pageNumber,
                    pageSize: filters.pageSize,
                    ...(filters.startDate && { startDate: new Date(filters.startDate).toISOString() }),
                    ...(filters.endDate && { endDate: new Date(filters.endDate).toISOString() }),
                    ...(filters.userId && { userId: filters.userId }),
                    ...(filters.eventType && { eventType: filters.eventType }),
                };
                const data = await getAuditLogs(params);
                setAuditData(data);
            } catch (err: any) {
                setError(`Falha ao carregar logs de auditoria. O endpoint pode não estar implementado ainda. (${err.message})`);
                setAuditData(null); // Clear data on error
            } finally {
                setLoading(false);
            }
        };

        const debounceFetch = setTimeout(fetchLogs, 300);
        return () => clearTimeout(debounceFetch);

    }, [filters]);
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, pageNumber: 1, [e.target.name]: e.target.value }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({ ...prev, pageNumber: newPage }));
    };

    const renderPagination = () => {
        if (!auditData || auditData.totalPages <= 1) return null;
        
        const pageButtons = [];
        for (let i = 1; i <= auditData.totalPages; i++) {
            pageButtons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 text-sm font-semibold rounded-md ${filters.pageNumber === i ? 'bg-primary text-white' : 'bg-gray-200 text-dark-text hover:bg-gray-300'}`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex items-center justify-center gap-2 mt-4">
                 <button onClick={() => handlePageChange(filters.pageNumber - 1)} disabled={!auditData.hasPreviousPage} className="px-3 py-1 text-sm font-semibold rounded-md bg-gray-200 text-dark-text hover:bg-gray-300 disabled:opacity-50">Anterior</button>
                 {pageButtons}
                 <button onClick={() => handlePageChange(filters.pageNumber + 1)} disabled={!auditData.hasNextPage} className="px-3 py-1 text-sm font-semibold rounded-md bg-gray-200 text-dark-text hover:bg-gray-300 disabled:opacity-50">Próxima</button>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-2xl font-bold text-dark-text mb-6">Logs de Auditoria</h2>
            
            <div className="bg-light-card p-6 rounded-xl border border-gray-200 h-full flex flex-col">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                    <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                    <input type="text" name="userId" placeholder="Filtrar por ID do Usuário..." value={filters.userId} onChange={handleFilterChange} className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                    <input type="text" name="eventType" placeholder="Filtrar por Evento..." value={filters.eventType} onChange={handleFilterChange} className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                </div>

                {/* Table */}
                <div className="flex-grow overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-light-text">Carregando logs...</div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full text-red-500">{error}</div>
                    ) : (
                        <table className="w-full text-sm text-left text-dark-text">
                            <thead className="text-xs text-light-text uppercase bg-gray-50 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Data/Hora</th>
                                    <th scope="col" className="px-6 py-3">Usuário</th>
                                    <th scope="col" className="px-6 py-3">Tipo de Evento</th>
                                    <th scope="col" className="px-6 py-3">Detalhes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {auditData?.items && auditData.items.length > 0 ? auditData.items.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(log.timestamp).toLocaleString('pt-BR')}</td>
                                        <td className="px-6 py-4">
                                            <div>{log.userFullName || 'Sistema'}</div>
                                            <div className="text-xs text-light-text font-mono">{log.userId}</div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold">{log.eventType}</td>
                                        <td className="px-6 py-4 text-xs">{log.details}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-10 text-light-text">Nenhum log encontrado com os filtros atuais.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
                {renderPagination()}
            </div>
        </div>
    );
};

export default AuditLogView;