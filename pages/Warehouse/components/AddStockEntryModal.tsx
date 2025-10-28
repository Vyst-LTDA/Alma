/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState, useEffect } from 'react';
import { allRequests, mockInventoryItems } from '../../../data/mockData';
import { Request, UserRole } from '../../../types';
import { generateDailyId } from '../../../utils/idGenerator';

interface AddStockEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  onEntryAdded: () => void;
}

const AddStockEntryModal: React.FC<AddStockEntryModalProps> = ({ isOpen, onClose, userRole, onEntryAdded }) => {
    const [selectedItem, setSelectedItem] = useState('');
    const [quantity, setQuantity] = useState(1);

    const inventoryItems = mockInventoryItems;

    useEffect(() => {
        if (isOpen) {
            setSelectedItem('');
            setQuantity(1);
        }
    }, [isOpen]);

    if (!isOpen) return null;
    
    const handleConfirm = () => {
        if (!selectedItem || quantity <= 0) {
            alert("Por favor, selecione um item e insira uma quantidade válida.");
            return;
        }

        const itemDetails = inventoryItems.find(i => i.id === selectedItem);
        if(!itemDetails) {
             alert("Item inválido selecionado.");
             return;
        }

        const newEntryRequest: Request = {
            id: generateDailyId('REQ', allRequests),
            item: itemDetails.name,
            category: itemDetails.category,
            quantity: quantity,
            requester: userRole === 'admin' ? 'Admin (Entrada Direta)' : 'Usuário comum',
            status: userRole === 'admin' ? 'Aprovado' : 'Pendente',
            requestDate: new Date().toLocaleDateString('pt-BR'),
            type: 'Uso Contínuo', // This type is overloaded to mean 'Stock Entry' in this context
            unit: 'un', // Placeholder
        };

        allRequests.unshift(newEntryRequest);
        onEntryAdded();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-light-card w-full max-w-md rounded-xl shadow-xl p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-dark-text mb-4">Adicionar Entrada de Estoque</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="itemName" className="block text-sm font-medium text-light-text mb-1">Nome do Item</label>
                        <select 
                            id="itemName" 
                            value={selectedItem}
                            onChange={e => setSelectedItem(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white text-black"
                        >
                            <option value="" disabled>Selecione um item...</option>
                            {inventoryItems.map(item => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                         <label htmlFor="entryQuantity" className="block text-sm font-medium text-light-text mb-1">Quantidade</label>
                         <input 
                            type="number" 
                            id="entryQuantity" 
                            value={quantity}
                            onChange={e => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                            min="1" 
                            className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" 
                        />
                    </div>
                </div>
                 <div className="flex justify-end gap-3 pt-6 mt-2 border-t">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-dark-text font-semibold rounded-lg hover:bg-gray-300">
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90"
                    >
                        Salvar Entrada
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddStockEntryModal;