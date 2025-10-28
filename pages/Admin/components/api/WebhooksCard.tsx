import React from 'react';
import { DotsVerticalIcon } from '../../../../components/shared/IconComponents';

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
                        {mockWebhooks.map((hook) => (
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WebhooksCard;