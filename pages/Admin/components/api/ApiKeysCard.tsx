import React, { useState } from 'react';
import { DotsVerticalIcon } from '../../../../components/shared/IconComponents';
import GenerateKeyModal from './GenerateKeyModal';

interface MockKey {
    id: number;
    name: string;
    key: string;
    permissions: string;
    created: string;
    status: 'Ativa' | 'Revogada';
}

const mockKeys: MockKey[] = [];

const ApiKeysCard: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                            <th scope="col" className="px-6 py-3">Chave</th>
                            <th scope="col" className="px-6 py-3">Permissões</th>
                            <th scope="col" className="px-6 py-3">Criada em</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {mockKeys.map((k) => (
                            <tr key={k.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-semibold">{k.name}</td>
                                <td className="px-6 py-4 font-mono">{k.key}</td>
                                <td className="px-6 py-4">{k.permissions}</td>
                                <td className="px-6 py-4">{k.created}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${k.status === 'Ativa' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {k.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button className="p-2 rounded-full hover:bg-gray-200">
                                        <DotsVerticalIcon className="w-5 h-5 text-gray-500" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        <GenerateKeyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default ApiKeysCard;