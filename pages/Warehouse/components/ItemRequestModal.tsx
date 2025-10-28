import React, { useState, useRef } from 'react';
import { mockMasterItems, allRequests } from '../../../data/mockData';
import { PlusIcon, TrashIcon } from '../../../components/shared/IconComponents';
import { UserData, Request } from '../../../types';
import { generateDailyId } from '../../../utils/idGenerator';

interface ItemRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData;
}

interface RequestItem {
    id: number;
    code: string;
    name: string;
    category: string;
    quantity: number;
}

const ItemRequestModal: React.FC<ItemRequestModalProps> = ({ isOpen, onClose, userData }) => {
    const [items, setItems] = useState<RequestItem[]>([{ id: Date.now(), code: '', name: '', category: '', quantity: 1 }]);
    const [requestType, setRequestType] = useState<'Uso Contínuo' | 'Empréstimo'>('Uso Contínuo');
    const [returnDate, setReturnDate] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState<'Retirada' | 'Entrega'>('Retirada');
    const [deliveryLocation, setDeliveryLocation] = useState('');

    const handleAddItem = () => {
        setItems(prev => [...prev, { id: Date.now(), code: '', name: '', category: '', quantity: 1 }]);
    };
    
    const handleRemoveItem = (id: number) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const handleItemChange = (id: number, field: keyof RequestItem, value: string | number) => {
        const updatedItems = items.map(item => {
            if (item.id === id) {
                if (field === 'name') {
                    const masterItem = mockMasterItems.find(i => i.name === value);
                    return {
                        ...item,
                        name: masterItem ? masterItem.name : '',
                        code: masterItem ? masterItem.code : '',
                        category: masterItem ? masterItem.category : '',
                    };
                }
                return { ...item, [field]: value };
            }
            return item;
        });
        setItems(updatedItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const validItems = items.filter(item => item.code && item.quantity > 0);
        if (validItems.length === 0) {
            alert('Por favor, adicione pelo menos um item válido com quantidade maior que zero.');
            return;
        }

        validItems.forEach(item => {
            const newRequest: Request = {
                id: generateDailyId('REQ', allRequests),
                item: item.name,
                category: item.category,
                quantity: item.quantity,
                requester: userData.name || 'Usuário',
                status: 'Entregue', // Saída registrada é considerada entregue
                requestDate: new Date().toLocaleDateString('pt-BR'),
                type: requestType,
                deliveryMethod: deliveryMethod,
                deliveryLocation: deliveryMethod === 'Entrega' ? deliveryLocation : undefined,
                returnDate: requestType === 'Empréstimo' ? returnDate : undefined,
            };
            allRequests.unshift(newRequest);
        });

        alert(`Solicitações de ${validItems.length} item(ns) registradas com sucesso! (Simulação)`);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-light-card w-full max-w-4xl rounded-xl shadow-xl p-6 relative flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-dark-text mb-4">Registrar Novas Solicitações de Itens</h2>
                
                <form id="item-request-form" onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-6">
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <label className="block text-sm font-bold text-dark-text mb-1">Solicitante</label>
                        <p className="text-dark-text">{userData.name || 'Usuário Atual'}</p>
                    </div>

                    <div>
                         <h3 className="text-md font-bold text-dark-text mb-2">Itens</h3>
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="w-full text-sm">
                                <thead className="text-left text-light-text bg-gray-50">
                                    <tr>
                                        <th className="px-2 py-2">Item</th>
                                        <th className="px-2 py-2 w-1/4">Código</th>
                                        <th className="px-2 py-2 w-1/4">Categoria</th>
                                        <th className="px-2 py-2 w-24">Qtd.</th>
                                        <th className="px-2 py-2 w-12"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item.id} className="border-t">
                                            <td className="p-2">
                                                <select value={item.name} onChange={e => handleItemChange(item.id, 'name', e.target.value)} className="w-full px-2 py-1.5 bg-white text-black border border-gray-300 rounded">
                                                    <option value="">Selecione um item...</option>
                                                    {mockMasterItems.map(master => <option key={master.code} value={master.name}>{master.name}</option>)}
                                                </select>
                                            </td>
                                            <td className="p-2 font-mono text-primary">{item.code || '-'}</td>
                                            <td className="p-2">{item.category || '-'}</td>
                                            <td className="p-2">
                                                <input type="number" value={item.quantity} min="1" onChange={e => handleItemChange(item.id, 'quantity', parseInt(e.target.value, 10) || 1)} className="w-full px-2 py-1.5 bg-white text-black border border-gray-300 rounded" />
                                            </td>
                                            <td className="p-2 text-center">
                                                {items.length > 1 && (
                                                    <button type="button" onClick={() => handleRemoveItem(item.id)} className="p-1 text-red-500 hover:bg-red-100 rounded">
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button type="button" onClick={handleAddItem} className="mt-2 flex items-center text-sm font-semibold text-primary hover:underline">
                            <PlusIcon className="w-4 h-4 mr-1" />
                            Adicionar outro item
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-bold text-dark-text mb-2">Método de Requisição</label>
                            <div className="flex gap-2">
                                <label className={`flex-1 p-3 border rounded-lg cursor-pointer transition-colors text-center ${requestType === 'Uso Contínuo' ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'}`}>
                                    <input type="radio" name="requestType" value="Uso Contínuo" checked={requestType === 'Uso Contínuo'} onChange={() => setRequestType('Uso Contínuo')} className="sr-only" /> Uso Contínuo
                                </label>
                                <label className={`flex-1 p-3 border rounded-lg cursor-pointer transition-colors text-center ${requestType === 'Empréstimo' ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'}`}>
                                    <input type="radio" name="requestType" value="Empréstimo" checked={requestType === 'Empréstimo'} onChange={() => setRequestType('Empréstimo')} className="sr-only" /> Empréstimo
                                </label>
                            </div>
                            {requestType === 'Empréstimo' && (
                                <div className="mt-3">
                                    <label htmlFor="returnDate" className="block text-sm font-medium text-light-text mb-1">Data de Devolução</label>
                                    <input type="date" id="returnDate" value={returnDate} onChange={e => setReturnDate(e.target.value)} required className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-dark-text mb-2">Método de Entrega</label>
                            <div className="flex gap-2">
                                <label className={`flex-1 p-3 border rounded-lg cursor-pointer transition-colors text-center ${deliveryMethod === 'Retirada' ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'}`}>
                                    <input type="radio" name="deliveryMethod" value="Retirada" checked={deliveryMethod === 'Retirada'} onChange={() => setDeliveryMethod('Retirada')} className="sr-only" /> Retirar no Almoxarifado
                                </label>
                                <label className={`flex-1 p-3 border rounded-lg cursor-pointer transition-colors text-center ${deliveryMethod === 'Entrega' ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'}`}>
                                    <input type="radio" name="deliveryMethod" value="Entrega" checked={deliveryMethod === 'Entrega'} onChange={() => setDeliveryMethod('Entrega')} className="sr-only" /> Solicitar Entrega
                                </label>
                            </div>
                            {deliveryMethod === 'Entrega' && (
                                <div className="mt-3">
                                    <label htmlFor="deliveryLocation" className="block text-sm font-medium text-light-text mb-1">Local de Entrega</label>
                                    <input type="text" id="deliveryLocation" value={deliveryLocation} onChange={e => setDeliveryLocation(e.target.value)} placeholder="Ex: Sala A-201" required className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                                </div>
                            )}
                        </div>
                    </div>
                </form>

                <div className="flex justify-end gap-3 pt-6 mt-4 border-t flex-shrink-0">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-dark-text font-semibold rounded-lg hover:bg-gray-300">
                        Cancelar
                    </button>
                    <button type="submit" form="item-request-form" className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90">
                        Registrar Solicitações
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ItemRequestModal;