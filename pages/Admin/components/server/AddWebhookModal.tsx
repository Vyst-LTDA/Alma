import React, { useState } from 'react';

interface AddWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: { eventType: string, targetUrl: string }) => void;
}

const AddWebhookModal: React.FC<AddWebhookModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [targetUrl, setTargetUrl] = useState('');
    const [eventType, setEventType] = useState('ItemCreated');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({ eventType, targetUrl });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-light-card w-full max-w-lg rounded-xl shadow-xl p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-dark-text mb-4">Adicionar Novo Webhook</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="targetUrl" className="block text-sm font-medium text-dark-text mb-1">URL do Endpoint</label>
                        <input
                            type="url"
                            id="targetUrl"
                            value={targetUrl}
                            onChange={e => setTargetUrl(e.target.value)}
                            required
                            placeholder="https://meuservico.com/webhook"
                            className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="eventType" className="block text-sm font-medium text-dark-text mb-1">Tipo de Evento</label>
                        <select
                            id="eventType"
                            value={eventType}
                            onChange={e => setEventType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white text-black"
                        >
                            <option value="ItemCreated">Item Criado</option>
                            <option value="ItemUpdated">Item Atualizado</option>
                            <option value="StockLevelChanged">Nível de Estoque Alterado</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-dark-text font-semibold rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90">Adicionar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddWebhookModal;