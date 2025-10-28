import React, { useState } from 'react';
import { DotsVerticalIcon } from '../../../../components/shared/IconComponents';
import GenerateKeyModal from '../../components/server/GenerateKeyModal';

// --- API Keys Component ---
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
                        {mockKeys.length > 0 ? mockKeys.map((k) => (
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
                        )) : (
                            <tr><td colSpan={6} className="text-center py-8 text-light-text">Nenhuma chave de API gerada.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        <GenerateKeyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

// --- Webhooks Component ---
interface MockWebhook {
    id: number;
    url: string;
    events: string;
    status: 'Ativo' | 'Falhou';
}
const mockWebhooks: MockWebhook[] = [];

const WebhooksCard: React.FC = () => {
    return (
        <div className="bg-light-card p-6 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-dark-text">Webhooks</h3>
                <button className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90">
                    Adicionar Webhook
                </button>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-dark-text">
                    <thead className="text-xs text-light-text uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">URL do Endpoint</th>
                            <th scope="col" className="px-6 py-3">Eventos</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {mockWebhooks.length > 0 ? mockWebhooks.map((hook) => (
                            <tr key={hook.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono text-sm">{hook.url}</td>
                                <td className="px-6 py-4 text-xs">
                                    {hook.events.split(',').map(e => <span key={e} className="bg-gray-100 text-gray-700 px-2 py-1 rounded mr-1 mb-1 inline-block">{e.trim()}</span>)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${hook.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {hook.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button className="p-2 rounded-full hover:bg-gray-200">
                                        <DotsVerticalIcon className="w-5 h-5 text-gray-500" />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                             <tr><td colSpan={4} className="text-center py-8 text-light-text">Nenhum webhook configurado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Swagger Component ---
const SwaggerCard: React.FC = () => {
    const handleAccessSwagger = () => {
        alert("Em um ambiente real, você seria redirecionado para a documentação interativa da API no Swagger UI.");
    };

    return (
        <div className="bg-light-card p-6 rounded-xl border border-gray-200 flex flex-col md:flex-row md:items-center justify-between">
            <div>
                <h3 className="text-lg font-bold text-dark-text mb-2">Documentação Interativa da API</h3>
                <p className="text-sm text-light-text">
                    Explore e teste os endpoints da API usando a interface do Swagger.
                </p>
            </div>
            <button
                onClick={handleAccessSwagger}
                className="w-full md:w-auto mt-4 md:mt-0 px-4 py-2 font-semibold bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition whitespace-nowrap"
            >
                Acessar Swagger UI
            </button>
        </div>
    );
};


// --- Main View ---
const IntegrationsView: React.FC = () => {
    return (
        <div className="h-full flex flex-col gap-8">
            <SwaggerCard />
            <ApiKeysCard />
            <WebhooksCard />
        </div>
    );
};

export default IntegrationsView;