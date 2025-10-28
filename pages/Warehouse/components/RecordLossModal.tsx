/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState } from 'react';
import { mockStockItems, mockLossRecords } from '../../../data/mockData';
import { LossRecord, UserRole } from '../../../types';
import { generateDailyId } from '../../../utils/idGenerator';

interface RecordLossModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  onLossRecorded: () => void;
}

const RecordLossModal: React.FC<RecordLossModalProps> = ({ isOpen, onClose, userRole, onLossRecorded }) => {
    const [selectedItemCode, setSelectedItemCode] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [wasInStock, setWasInStock] = useState(false);
    const [report, setReport] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedItem = mockStockItems.find(item => item.code === selectedItemCode);

        if (!selectedItem) {
            alert('Por favor, selecione um item válido.');
            return;
        }

        if (wasInStock && selectedItem.quantity < quantity) {
            alert(`Não é possível registrar a perda de ${quantity} unidade(s), pois há apenas ${selectedItem.quantity} em estoque.`);
            return;
        }

        // Create new loss record
        const newLossRecord: LossRecord = {
            id: generateDailyId('LOSS', mockLossRecords),
            itemCode: selectedItem.code,
            itemName: selectedItem.name,
            quantity,
            report,
            wasInStock,
            recordedBy: userRole,
            date: new Date().toLocaleDateString('pt-BR'),
        };
        mockLossRecords.unshift(newLossRecord);

        // Deduct from stock if necessary
        if (wasInStock) {
            const itemIndex = mockStockItems.findIndex(item => item.code === selectedItemCode);
            if (itemIndex > -1) {
                mockStockItems[itemIndex].quantity -= quantity;
                // Update status if needed
                if (mockStockItems[itemIndex].quantity === 0) {
                    mockStockItems[itemIndex].status = 'Indisponível';
                } else if (mockStockItems[itemIndex].quantity < 10) { // Example threshold
                    mockStockItems[itemIndex].status = 'Estoque Baixo';
                }
            }
        }

        onLossRecorded();
        onClose();
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
                            value={selectedItemCode} 
                            onChange={e => setSelectedItemCode(e.target.value)} 
                            required 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white text-black"
                        >
                            <option value="" disabled>Selecione um item...</option>
                            {mockStockItems.map(item => (
                                <option key={item.code} value={item.code}>{item.name} ({item.code})</option>
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
                        <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90">Confirmar Registro</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecordLossModal;