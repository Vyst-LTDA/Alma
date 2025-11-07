/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState, useEffect } from 'react';
import { LossDto, UserRole, ItemDto, CreateLossDto } from '../../../types';
import { getItems, createLoss } from '../../../services/apiService';

interface RecordLossModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLossRecorded: () => void;
}

const RecordLossModal: React.FC<RecordLossModalProps> = ({ isOpen, onClose, onLossRecorded }) => {
    const [selectedItemId, setSelectedItemId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [wasInStock, setWasInStock] = useState(false);
    const [report, setReport] = useState('');
    const [inventoryItems, setInventoryItems] = useState<ItemDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Reset form state on open
            setSelectedItemId('');
            setQuantity(1);
            setWasInStock(false);
            setReport('');
            
            const fetchItems = async () => {
                setLoading(true);
                try {
                    const result = await getItems({ pageSize: 500 });
                    setInventoryItems(result.items);
                } catch (error) {
                    console.error("Failed to load items for modal", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchItems();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const selectedItem = inventoryItems.find(item => item.id === selectedItemId);

        if (!selectedItem) {
            alert('Por favor, selecione um item válido.');
            return;
        }

        if (wasInStock && selectedItem.stockQuantity < quantity) {
            alert(`Não é possível registrar a perda de ${quantity} unidade(s), pois há apenas ${selectedItem.stockQuantity} em estoque.`);
            return;
        }

        setSubmitting(true);
        try {
            const newLossData: CreateLossDto = {
                itemId: selectedItemId,
                quantity,
                reason: report,
                wasInStock
            };

            await createLoss(newLossData);
            
            onLossRecorded();
            onClose();
        } catch (err: any) {
            alert(`Erro ao registrar perda: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-light-card w-full max-w-lg rounded-xl shadow-xl p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-dark-text mb-4">Registrar Perda de Item</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="item" className="block text-sm font-medium text-dark-text mb-1">Item perdido</label>
                        <select 
                            id="item" 
                            value={selectedItemId} 
                            onChange={e => setSelectedItemId(e.target.value)} 
                            required 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white text-black"
                            disabled={loading}
                        >
                            <option value="" disabled>{loading ? 'Carregando itens...' : 'Selecione um item...'}</option>
                            {inventoryItems.map(item => (
                                <option key={item.id} value={item.id}>{item.name} ({item.sku})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-dark-text mb-1">Quantidade Perdida</label>
                        <input 
                            type="number" 
                            id="quantity" 
                            value={quantity} 
                            onChange={e => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))} 
                            min="1" 
                            required 
                            className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" 
                        />
                    </div>
                    <div>
                        <label htmlFor="report" className="block text-sm font-medium text-dark-text mb-1">Relatório da Perda</label>
                        <textarea 
                            id="report" 
                            rows={4} 
                            value={report}
                            onChange={e => setReport(e.target.value)}
                            required 
                            className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                            placeholder="Descreva o motivo e as circunstâncias da perda do item."
                        ></textarea>
                    </div>
                    <div className="flex items-center">
                        <input
                            id="wasInStock"
                            type="checkbox"
                            checked={wasInStock}
                            onChange={e => setWasInStock(e.target.checked)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor="wasInStock" className="ml-2 block text-sm text-dark-text">
                            O item já estava no estoque? (Marque para dar baixa)
                        </label>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-dark-text font-semibold rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:bg-gray-400">
                            {submitting ? 'Registrando...' : 'Confirmar Registro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecordLossModal;