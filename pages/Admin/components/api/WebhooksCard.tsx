import React, { useState, useEffect } from 'react';
import { DotsVerticalIcon } from '../../../../components/shared/IconComponents';
import { WebhookSubscriptionDto } from '../../../../types';
import { getWebhooks, createWebhook, deleteWebhook } from '../../../../services/apiService';
import AddWebhookModal from './AddWebhookModal';

const WebhooksCard: React.FC = () => {
    const [webhooks, setWebhooks] = useState<WebhookSubscriptionDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchWebhooks = async () => {
        setLoading(true);
        try {
            const data = await getWebhooks();
            setWebhooks(data);
        } catch (error) {
            console.error("Failed to fetch webhooks", error);
            alert("Falha ao carregar webhooks.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWebhooks();
    }, []);
    
    const handleAdd = async (data: { eventType: string, targetUrl: string }) => {
        try {
            await createWebhook(data);
            setIsModalOpen(false);
            await fetchWebhooks();
        } catch (error: any) {
            alert(`Falha ao criar webhook: ${error.message}`);
        }
    };
    
    const handleDelete = async (id: string) => {
        if(window.confirm("Tem certeza que deseja excluir este webhook?")) {
            try {
                await deleteWebhook(id);
                await fetchWebhooks();
            } catch (error: any) {
                alert(`Falha ao excluir webhook: ${error.message}`);
            }
        }
    };


    return (
        <>
        <div className="bg-light-card p-6 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-dark-text">Webhooks</h3>
                <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90">
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
                        {loading ? (
                            <tr><td colSpan={4} className="text-center py-8 text-light-text">Carregando webhooks...</td></tr>
                        ) : webhooks.length > 0 ? webhooks.map((hook) => (
                            <tr key={hook.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-mono text-sm">{hook.targetUrl}</td>
                                <td className="px-6 py-4 text-xs">
                                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded mr-1 mb-1 inline-block">{hook.eventType}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${hook.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {hook.isActive ? 'Ativo' : 'Inativo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => handleDelete(hook.id)} className="p-2 rounded-full hover:bg-gray-200">
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
        <AddWebhookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAdd} />
        </>
    );
};

export default WebhooksCard;
