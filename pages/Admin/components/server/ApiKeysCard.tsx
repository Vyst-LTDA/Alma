import React, { useState, useEffect, useRef } from 'react';
import { DotsVerticalIcon, TrashIcon } from '../../../../components/shared/IconComponents';
import GenerateKeyModal from './GenerateKeyModal';
import { ApiKeyDto } from '../../../../types';
import { getApiKeys, deleteApiKey } from '../../../../services/apiService';

const ActionMenu: React.FC<{ apiKey: ApiKeyDto, onDelete: (id: string) => void }> = ({ apiKey, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDelete = () => {
        if (window.confirm(`Tem certeza que deseja revogar a chave "${apiKey.name}"? Esta ação é irreversível.`)) {
            onDelete(apiKey.id);
        }
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-gray-200">
                <DotsVerticalIcon className="w-5 h-5 text-gray-500" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <ul className="py-1">
                        <li>
                            <button onClick={handleDelete} className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                <TrashIcon className="w-4 h-4" />
                                Revogar
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

const ApiKeysCard: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [apiKeys, setApiKeys] = useState<ApiKeyDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);

    const fetchKeys = async () => {
        setLoading(true);
        setError(null);
        try {
            const keys = await getApiKeys();
            setApiKeys(keys);
        } catch (err: any) {
            setError('Falha ao carregar chaves de API.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchKeys();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteApiKey(id);
            setApiKeys(prev => prev.filter(key => key.id !== id));
        } catch (err: any) {
            alert(`Falha ao revogar chave: ${err.message}`);
        }
    };
    
    return (
        <>
            <div className="bg-light-card p-6 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-dark-text">Chaves de API</h3>
                    <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90">
                        Gerar Nova Chave
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-dark-text">
                        <thead className="text-xs text-light-text uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nome</th>
                                <th scope="col" className="px-6 py-3">Prefixo da Chave</th>
                                <th scope="col" className="px-6 py-3">Permissões</th>
                                <th scope="col" className="px-6 py-3">Criada em</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading && (
                                <tr><td colSpan={6} className="text-center py-8 text-light-text">Carregando chaves...</td></tr>
                            )}
                            {error && (
                                 <tr><td colSpan={6} className="text-center py-8 text-red-500">{error}</td></tr>
                            )}
                            {!loading && !error && (
                                apiKeys.length > 0 ? apiKeys.map((k) => (
                                    <tr key={k.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-semibold">{k.name}</td>
                                        <td className="px-6 py-4 font-mono">{k.keyPrefix}...</td>
                                        <td className="px-6 py-4">{k.permissions === 'read-write' ? 'Leitura & Escrita' : 'Somente Leitura'}</td>
                                        <td className="px-6 py-4">{new Date(k.createdAt).toLocaleDateString('pt-BR')}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${k.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {k.isActive ? 'Ativa' : 'Revogada'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {k.isActive && <ActionMenu apiKey={k} onDelete={handleDelete} />}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={6} className="text-center py-8 text-light-text">Nenhuma chave de API gerada.</td></tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <GenerateKeyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onKeyAdded={fetchKeys} />
        </>
    );
};

export default ApiKeysCard;