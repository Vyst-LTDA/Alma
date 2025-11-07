import React, { useState, useEffect, useRef } from 'react';
import { ItemDto } from '../../../types';
import { SearchIcon, ArchiveIcon, DotsVerticalIcon } from '../../../components/shared/IconComponents';
import { getItems, deleteItem } from '../../../services/apiService';

type StockStatus = 'Disponível' | 'Estoque Baixo' | 'Indisponível';

const getStockStatus = (quantity: number): StockStatus => {
    if (quantity <= 0) return 'Indisponível';
    if (quantity <= 10) return 'Estoque Baixo';
    return 'Disponível';
};

const StockStatusBadge: React.FC<{ status: StockStatus }> = ({ status }) => {
    const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full inline-block';
    const statusClasses = {
        'Disponível': 'bg-green-100 text-green-700',
        'Estoque Baixo': 'bg-yellow-100 text-yellow-700',
        'Indisponível': 'bg-red-100 text-red-700',
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const ActionMenu: React.FC<{ item: ItemDto, onEdit: (item: ItemDto) => void, onDelete: (item: ItemDto) => void }> = ({ item, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-gray-200">
                <DotsVerticalIcon className="w-5 h-5 text-gray-500" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <ul className="py-1">
                        <li><button onClick={() => { onEdit(item); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-dark-text hover:bg-gray-100">Editar</button></li>
                        <li><button onClick={() => { onDelete(item); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Excluir</button></li>
                    </ul>
                </div>
            )}
        </div>
    )
}


const StockItemsTable: React.FC<{ refreshKey: number; onEditItem: (item: ItemDto) => void; }> = ({ refreshKey, onEditItem }) => {
    const [items, setItems] = useState<ItemDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getItems({ pageNumber: 1, pageSize: 200, searchTerm: searchTerm });
                setItems(result.items);
            } catch (err: any) {
                setError(err.message || 'Falha ao buscar itens do estoque.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        // Debounce API calls while user is typing in search bar
        const debounceFetch = setTimeout(() => {
            fetchItems();
        }, 300);

        return () => clearTimeout(debounceFetch);
    }, [refreshKey, searchTerm]);

    const handleDeleteItem = async (item: ItemDto) => {
        if (window.confirm(`Tem certeza que deseja excluir o item "${item.name}"? Esta ação não pode ser desfeita.`)) {
            try {
                await deleteItem(item.id);
                setItems(prevItems => prevItems.filter(i => i.id !== item.id));
                alert("Item excluído com sucesso.");
            } catch (err: any) {
                alert(`Erro ao excluir item: ${err.message}`);
            }
        }
    };

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
                {loading ? (
                    <div className="flex items-center justify-center h-full text-light-text">Carregando itens...</div>
                ) : error ? (
                    <div className="flex items-center justify-center h-full text-red-500">{error}</div>
                ) : (
                    <table className="w-full text-sm text-left text-dark-text">
                        <thead className="text-xs text-light-text uppercase bg-gray-50 sticky top-0">
                            <tr>
                                <th scope="col" className="px-6 py-3">Código</th>
                                <th scope="col" className="px-6 py-3">Item</th>
                                <th scope="col" className="px-6 py-3">Categoria</th>
                                <th scope="col" className="px-6 py-3 text-center">Quantidade</th>
                                <th scope="col" className="px-6 py-3 text-center">Status</th>
                                <th scope="col" className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {items.length > 0 ? items.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-primary font-bold">{item.sku}</td>
                                    <td className="px-6 py-4 font-semibold">{item.name}</td>
                                    <td className="px-6 py-4">{item.attributes?.category || '--'}</td>
                                    <td className="px-6 py-4 text-center font-semibold">{item.stockQuantity}</td>
                                    <td className="px-6 py-4 text-center">
                                        <StockStatusBadge status={getStockStatus(item.stockQuantity)} />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <ActionMenu item={item} onEdit={onEditItem} onDelete={handleDeleteItem} />
                                    </td>
                                </tr>
                            )) : (
                               <tr>
                                    <td colSpan={6}>
                                        <div className="flex flex-col items-center justify-center text-center text-light-text py-16">
                                            <ArchiveIcon className="w-16 h-16 text-gray-300 mb-4" />
                                            <h3 className="font-semibold text-dark-text">Nenhum item encontrado</h3>
                                            <p>Tente ajustar sua busca ou registrar um novo item no catálogo.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default StockItemsTable;