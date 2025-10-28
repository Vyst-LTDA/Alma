/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState, useMemo, useEffect } from 'react';
import { Supplier, StockItem } from '../../../types';
import { mockEducationalMasterItems, mockEducationalStockItems, mockSuppliers } from '../../../data/mockData';

const unitsOfMeasure = [
    { abbreviation: 'PC', name: 'Peça' },
    { abbreviation: 'M', name: 'Metro' },
    { abbreviation: 'KG', name: 'Kilograma' },
    { abbreviation: 'UN', name: 'Unidade' },
    { abbreviation: 'CX', name: 'Caixa' },
    { abbreviation: 'RL', name: 'Rolo' },
    { abbreviation: 'LT', name: 'Litro' },
    { abbreviation: 'GL', name: 'Galão' },
    { abbreviation: 'par', name: 'Par' },
];

interface RegisterItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onItemRegistered: () => void;
}

const EducationalRegisterItemForm: React.FC<RegisterItemModalProps> = ({ isOpen, onClose, onItemRegistered }) => {
    const [selectedCategory, setSelectedCategory] = useState('');
    
    // In a real app, these would be fetched. For this separate stock, we can define them or share them.
    // For simplicity, we'll share the suppliers but manage categories locally or fetch them.
    const suppliers = mockSuppliers;
    const categories = useMemo(() => [...new Set(suppliers.map(s => s.category))], [suppliers]);

    const filteredSuppliers = useMemo(() => {
        if (!selectedCategory) return [];
        return suppliers.filter(supplier => supplier.category === selectedCategory);
    }, [selectedCategory, suppliers]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const newItemCode = formData.get('productCode') as string;
        const quantity = parseInt(formData.get('quantity') as string, 10) || 0;

        if (mockEducationalMasterItems.some(item => item.code === newItemCode)) {
            alert("Erro: Já existe um item com este código no estoque do Almoxarifado.");
            return;
        }

        const newItem = {
            code: newItemCode,
            name: formData.get('productName') as string,
            category: formData.get('category') as string,
        };
        mockEducationalMasterItems.push(newItem);

        const newStockItem: StockItem = {
            id: `edu-stock-${Date.now()}`,
            code: newItem.code,
            name: newItem.name,
            category: newItem.category,
            quantity: quantity,
            status: quantity > 10 ? 'Disponível' : quantity > 0 ? 'Estoque Baixo' : 'Indisponível',
        };
        mockEducationalStockItems.push(newStockItem);
        
        alert("Item registrado com sucesso no estoque do Almoxarifado!");
        onItemRegistered();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-light-card w-full max-w-4xl rounded-xl shadow-xl p-6 relative flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-xl font-bold text-dark-text">Registrar Novo Item no Catálogo (Almoxarifado)</h2>
                </div>

                <form id="register-item-form" onSubmit={handleSubmit} className="space-y-6 flex-grow overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="productCode" className="block text-sm font-bold text-dark-text mb-1">Código do produto</label>
                            <input type="text" id="productCode" name="productCode" required className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label htmlFor="productName" className="block text-sm font-bold text-dark-text mb-1">Nome do Produto</label>
                            <input type="text" id="productName" name="productName" required className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label htmlFor="unitOfMeasure" className="block text-sm font-bold text-dark-text mb-1">Unidade de Medida</label>
                            <select id="unitOfMeasure" name="unitOfMeasure" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white text-black">
                                <option value="">Selecione a unidade...</option>
                                {unitsOfMeasure.map(unit => (
                                    <option key={unit.abbreviation} value={unit.abbreviation}>{unit.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-bold text-dark-text mb-1">Categoria do Item</label>
                            <select id="category" name="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white text-black">
                                <option value="">Selecione uma categoria...</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="supplier" className="block text-sm font-bold text-dark-text mb-1">Fornecedor</label>
                            <select id="supplier" name="supplier" disabled={!selectedCategory || filteredSuppliers.length === 0} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed">
                                <option value="">{selectedCategory ? 'Selecione um fornecedor...' : 'Selecione uma categoria'}</option>
                                {filteredSuppliers.map(sup => (
                                    <option key={sup.id} value={sup.id}>{sup.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="deposit" className="block text-sm font-bold text-dark-text mb-1">Depósito</label>
                            <input type="text" id="deposit" name="deposit" placeholder="Ex: Prateleira A-01" className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label htmlFor="unitValue" className="block text-sm font-bold text-dark-text mb-1">Valor por Unidade (R$)</label>
                            <input type="number" id="unitValue" name="unitValue" step="0.01" className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-bold text-dark-text mb-1">Quantidade Inicial</label>
                            <input type="number" id="quantity" name="quantity" min="0" defaultValue="0" required className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-3">
                        <label htmlFor="observation" className="block text-sm font-bold text-dark-text mb-1">Observação (opcional)</label>
                        <textarea id="observation" name="observation" rows={3} className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"></textarea>
                    </div>
                </form>

                <div className="flex justify-end items-center pt-4 border-t border-gray-200 mt-6 flex-shrink-0">
                    <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-semibold text-light-text hover:underline">Cancelar</button>
                    <button form="register-item-form" type="submit" className="px-8 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 shadow-sm transition-transform transform hover:scale-105">
                        Registrar Item
                    </button>
                </div>
            </div>
        </div>
    );
};
export default EducationalRegisterItemForm;
