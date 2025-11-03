/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState, useEffect } from 'react';
// FIX: Import UserData type to resolve type error.
import { UserRole, ItemDto, RegisterMovementRequestDto, UserData } from '../../../types';
import { getItems, createCheckinMovement } from '../../../services/apiService';

interface AddStockEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  onEntryAdded: () => void;
  userData: UserData;
}

const AddStockEntryModal: React.FC<AddStockEntryModalProps> = ({ isOpen, onClose, userRole, onEntryAdded, userData }) => {
    const [selectedItem, setSelectedItem] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [inventoryItems, setInventoryItems] = useState<ItemDto[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSelectedItem('');
            setQuantity(1);
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
    
    const handleConfirm = async () => {
        if (!selectedItem || quantity <= 0) {
            alert("Por favor, selecione um item e insira uma quantidade válida.");
            return;
        }

        const itemDetails = inventoryItems.find(i => i.id === selectedItem);
        if(!itemDetails) {
             alert("Item inválido selecionado.");
             return;
        }

        const newEntryRequest: RegisterMovementRequestDto = {
            itemId: itemDetails.id,
            userId: userData.id,
            quantity: quantity,
            observations: `Entrada de estoque registrada por ${userData.name}`
        };
        
        try {
            await createCheckinMovement(newEntryRequest);
            onEntryAdded();
            onClose();
        } catch (error: any) {
            alert(`Falha ao registrar entrada: ${error.message}`);
        }
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
                            disabled={loading}
                        >
                            <option value="" disabled>{loading ? 'Carregando...' : 'Selecione um item...'}</option>
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