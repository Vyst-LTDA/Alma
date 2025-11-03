import React, { useState, useMemo, useEffect } from 'react';
import { Supplier, CreateItemRequestDto } from '../../../types';
import { mockSuppliers } from '../../../data/mockData';
import { createItemApi } from '../../../data/mockData';

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

const RegisterItemForm: React.FC<RegisterItemModalProps> = ({ isOpen, onClose, onItemRegistered }) => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const suppliers: Supplier[] = mockSuppliers;
    const categories: string[] = useMemo(() => [...new Set(suppliers.map(s => s.category))], [suppliers]);

    const filteredSuppliers = useMemo(() => {
        if (!selectedCategory) return [];
        return suppliers.filter(supplier => supplier.category === selectedCategory);
    }, [selectedCategory, suppliers]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        
        const newItem: CreateItemRequestDto = {
            sku: formData.get('productCode') as string,
            name: formData.get('productName') as string,
            stockQuantity: parseInt(formData.get('quantity') as string, 10) || 0,
            attributes: {
                category: formData.get('category') as string,
                unitOfMeasure: formData.get('unitOfMeasure') as string,
                supplierId: formData.get('supplier') as string,
                depositLocation: formData.get('deposit') as string,
                unitValue: parseFloat(formData.get('unitValue') as string) || 0,
                observation: formData.get('observation') as string
            }
        };

        try {
            await createItemApi(newItem);
            alert("Item registrado com sucesso!");
            onItemRegistered();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Falha ao registrar o item.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-light-card w-full max-w-4xl rounded-xl shadow-xl p-6 relative flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-xl font-bold text-dark-text">Registrar Novo Item no Catálogo</h2>
                </div>

                <form id="register-item-form" onSubmit={handleSubmit} className="space-y-6 flex-grow overflow-y-auto pr-2">
                    {error && <div className="bg-red-100 border border-red-300 text-red-700 text-sm p-3 rounded-lg">{error}</div>}
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
                                <option value="">{selectedCategory ? 'Selecione um fornecedor...' : 'Selecione uma categoria primeiro'}</option>
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
                            <label htmlFor="quantity" className="block text-sm font-bold text-dark-text mb-1">Quantidade</label>
                            <input type="number" id="quantity" name="quantity" min="0" required defaultValue="0" className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-3">
                        <label htmlFor="observation" className="block text-sm font-bold text-dark-text mb-1">Observação (opcional)</label>
                        <textarea id="observation" name="observation" rows={3} className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"></textarea>
                    </div>
                </form>

                <div className="flex justify-end items-center pt-4 border-t border-gray-200 mt-6 flex-shrink-0">
                    <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-semibold text-light-text hover:underline">Cancelar</button>
                    <button form="register-item-form" type="submit" disabled={isSubmitting} className="px-8 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 shadow-sm transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-wait">
                        {isSubmitting ? 'Registrando...' : 'Registrar Item'}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default RegisterItemForm;
