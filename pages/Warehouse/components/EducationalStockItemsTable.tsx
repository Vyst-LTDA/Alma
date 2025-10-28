/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState, useMemo } from 'react';
import { StockItem } from '../../../types';
import { mockEducationalStockItems } from '../../../data/mockData';
import { SearchIcon, ArchiveIcon } from '../../../components/shared/IconComponents';

const StockStatusBadge: React.FC<{ status: StockItem['status'] }> = ({ status }) => {
    const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full inline-block';
    const statusClasses = {
        'Disponível': 'bg-green-100 text-green-700',
        'Estoque Baixo': 'bg-yellow-100 text-yellow-700',
        'Indisponível': 'bg-red-100 text-red-700',
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const EducationalStockItemsTable: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    
    // Direct usage of mock data to ensure it's always up-to-date on re-renders
    const stockItems = mockEducationalStockItems;

    const filteredItems = useMemo(() => {
        return stockItems.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [stockItems, searchTerm]);

    return (
        <div className="bg-light-card p-6 rounded-xl border border-gray-200 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div className="relative w-full md:w-1/3">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por código, nome ou categoria..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                    />
                </div>
            </div>

            <div className="flex-grow overflow-y-auto">
                <table className="w-full text-sm text-left text-dark-text">
                    <thead className="text-xs text-light-text uppercase bg-gray-50 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">Código</th>
                            <th scope="col" className="px-6 py-3">Item</th>
                            <th scope="col" className="px-6 py-3">Categoria</th>
                            <th scope="col" className="px-6 py-3 text-center">Quantidade</th>
                            <th scope="col" className="px-6 py-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredItems.length > 0 ? filteredItems.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-primary font-bold">{item.code}</td>
                                <td className="px-6 py-4 font-semibold">{item.name}</td>
                                <td className="px-6 py-4">{item.category}</td>
                                <td className="px-6 py-4 text-center font-semibold">{item.quantity}</td>
                                <td className="px-6 py-4 text-center">
                                    <StockStatusBadge status={item.status} />
                                </td>
                            </tr>
                        )) : (
                           <tr>
                                <td colSpan={5}>
                                    <div className="flex flex-col items-center justify-center text-center text-light-text py-16">
                                        <ArchiveIcon className="w-16 h-16 text-gray-300 mb-4" />
                                        <h3 className="font-semibold text-dark-text">Nenhum item no estoque do almoxarifado</h3>
                                        <p>Itens registrados e com entradas aparecerão aqui.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EducationalStockItemsTable;
