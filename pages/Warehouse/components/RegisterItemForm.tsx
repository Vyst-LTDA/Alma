/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState, useMemo, useEffect } from 'react';
import { CustomerDto, CreateItemRequestDto, ItemDto, UpdateItemRequestDto } from '../../../types';
import { createItem, getCustomers, updateItem } from '../../../services/apiService';

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
    itemToEdit?: ItemDto | null;
}

const RegisterItemForm: React.FC<RegisterItemModalProps> = ({ isOpen, onClose, onItemRegistered, itemToEdit }) => {
    const isEditMode = !!itemToEdit;

    const [formData, setFormData] = useState({
        productCode: '',
        productName: '',
        unitOfMeasure: '',
        category: '',
        customer: '',
        deposit: '',
        unitValue: '0',
        quantity: '0',
        observation: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customers, setCustomers] = useState<CustomerDto[]>([]);
    const [loadingCustomers, setLoadingCustomers] = useState(true);

    const categories: string[] = useMemo(() => ['Escritório', 'Eletrônicos', 'Segurança', 'Alimentos', 'Didático', 'Limpeza', 'Manutenção'], []);

    const resetForm = () => {
        setFormData({
            productCode: '', productName: '', unitOfMeasure: '', category: '',
            customer: '', deposit: '', unitValue: '0', quantity: '0', observation: ''
        });
        setError(null);
    };

    useEffect(() => {
        if (isOpen) {
            const fetchCustomers = async () => {
                setLoadingCustomers(true);
                try {
                    const result = await getCustomers({ pageSize: 500 });
                    setCustomers(result.items);
                } catch (error) {
                    console.error("Failed to load customers for modal", error);
                } finally {
                    setLoadingCustomers(false);
                }
            };
            fetchCustomers();

            if (isEditMode && itemToEdit) {
                setFormData({
                    productCode: itemToEdit.sku,
                    productName: itemToEdit.name,
                    unitOfMeasure: itemToEdit.attributes?.unitOfMeasure || '',
                    category: itemToEdit.attributes?.category || '',
                    customer: itemToEdit.attributes?.customerId || '',
                    deposit: itemToEdit.attributes?.depositLocation || '',
                    unitValue: String(itemToEdit.attributes?.unitValue || 0),
                    quantity: String(itemToEdit.stockQuantity),
                    observation: itemToEdit.attributes?.observation || ''
                });
            } else {
                resetForm();
            }
        }
    }, [isOpen, itemToEdit, isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        try {
            if (isEditMode && itemToEdit) {
                const updatedItem: UpdateItemRequestDto = {
                    name: formData.productName,
                    attributes: {
                        category: formData.category,
                        unitOfMeasure: formData.unitOfMeasure,
                        customerId: formData.customer,
                        depositLocation: formData.deposit,
                        unitValue: parseFloat(formData.unitValue) || 0,
                        observation: formData.observation
                    }
                };
                await updateItem(itemToEdit.id, updatedItem);
                alert("Item atualizado com sucesso!");
            } else {
                const newItem: CreateItemRequestDto = {
                    sku: formData.productCode,
                    name: formData.productName,
                    stockQuantity: parseInt(formData.quantity, 10) || 0,
                    attributes: {
                        category: formData.category,
                        unitOfMeasure: formData.unitOfMeasure,
                        customerId: formData.customer,
                        depositLocation: formData.deposit,
                        unitValue: parseFloat(formData.unitValue) || 0,
                        observation: formData.observation
                    }
                };
                await createItem(newItem);
                alert("Item registrado com sucesso!");
            }
            onItemRegistered();
            onClose();
        } catch (err: any) {
            setError(err.message || `Falha ao ${isEditMode ? 'atualizar' : 'registrar'} o item.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-light-card w-full max-w-4xl rounded-xl shadow-xl p-6 relative flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-xl font-bold text-dark-text">{isEditMode ? 'Editar Item do Catálogo' : 'Registrar Novo Item no Catálogo'}</h2>
                </div>

                <form id="register-item-form" onSubmit={handleSubmit} className="space-y-6 flex-grow overflow-y-auto pr-2">
                    {error && <div className="bg-red-100 border border-red-300 text-red-700 text-sm p-3 rounded-lg">{error}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="productCode" className="block text-sm font-bold text-dark-text mb-1">Código do produto</label>
                            <input type="text" id="productCode" name="productCode" required value={formData.productCode} onChange={handleChange} readOnly={isEditMode} className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed" />
                        </div>
                        <div>
                            <label htmlFor="productName" className="block text-sm font-bold text-dark-text mb-1">Nome do Produto</label>
                            <input type="text" id="productName" name="productName" required value={formData.productName} onChange={handleChange} className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label htmlFor="unitOfMeasure" className="block text-sm font-bold text-dark-text mb-1">Unidade de Medida</label>
                            <select id="unitOfMeasure" name="unitOfMeasure" value={formData.unitOfMeasure} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white text-black">
                                <option value="">Selecione a unidade...</option>
                                {unitsOfMeasure.map(unit => (
                                    <option key={unit.abbreviation} value={unit.abbreviation}>{unit.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-bold text-dark-text mb-1">Categoria do Item</label>
                            <select id="category" name="category" value={formData.category} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white text-black">
                                <option value="">Selecione uma categoria...</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="customer" className="block text-sm font-bold text-dark-text mb-1">Cliente</label>
                            <select id="customer" name="customer" value={formData.customer} onChange={handleChange} disabled={loadingCustomers} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white text-black disabled:bg-gray-100 disabled:cursor-not-allowed">
                                <option value="">{loadingCustomers ? 'Carregando clientes...' : 'Selecione um cliente...'}</option>
                                {customers.map(customer => (
                                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="deposit" className="block text-sm font-bold text-dark-text mb-1">Depósito</label>
                            <input type="text" id="deposit" name="deposit" placeholder="Ex: Prateleira A-01" value={formData.deposit} onChange={handleChange} className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label htmlFor="unitValue" className="block text-sm font-bold text-dark-text mb-1">Valor por Unidade (R$)</label>
                            <input type="number" id="unitValue" name="unitValue" step="0.01" value={formData.unitValue} onChange={handleChange} className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-bold text-dark-text mb-1">Quantidade</label>
                            <input type="number" id="quantity" name="quantity" min="0" required value={formData.quantity} onChange={handleChange} readOnly={isEditMode} className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed" />
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-3">
                        <label htmlFor="observation" className="block text-sm font-bold text-dark-text mb-1">Observação (opcional)</label>
                        <textarea id="observation" name="observation" rows={3} value={formData.observation} onChange={handleChange} className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"></textarea>
                    </div>
                </form>

                <div className="flex justify-end items-center pt-4 border-t border-gray-200 mt-6 flex-shrink-0">
                    <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-semibold text-light-text hover:underline">Cancelar</button>
                    <button form="register-item-form" type="submit" disabled={isSubmitting} className="px-8 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 shadow-sm transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-wait">
                        {isSubmitting ? (isEditMode ? 'Salvando...' : 'Registrando...') : (isEditMode ? 'Salvar Alterações' : 'Registrar Item')}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default RegisterItemForm;