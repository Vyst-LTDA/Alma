import React, { useState, useMemo, useEffect } from 'react';
import { Supplier } from '../../../types';

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
}

const RegisterItemForm: React.FC<RegisterItemModalProps> = ({ isOpen, onClose }) => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            // TODO: Fetch suppliers and categories from backend API
            // setSuppliers(fetchedSuppliers);
            // setCategories(fetchedCategories);
        }
    }, [isOpen]);

    const filteredSuppliers = useMemo(() => {
        if (!selectedCategory) return [];
        return suppliers.filter(supplier => supplier.category === selectedCategory);
    }, [selectedCategory, suppliers]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Logic to submit new item to backend
        alert("Item registrado com sucesso (simulação)!");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-light-card w-full max-w-4xl rounded-xl shadow-xl p-6 relative flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-xl font-bold text-dark-text">Registrar Novo Item no Catálogo</h2>
                </div>

                <form id="register-item-form" onSubmit={handleSubmit} className="space-y-6 flex-grow overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="productCode" className="block text-sm font-bold text-dark-text mb-1">Código do produto</label>
                            <input type="text" id="productCode" className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label htmlFor="productName" className="block text-sm font-bold text-dark-text mb-1">Nome do Produto</label>
                            <input type="text" id="productName" className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label htmlFor="unitOfMeasure" className="block text-sm font-bold text-dark-text mb-1">Unidade de Medida</label>
                            <select id="unitOfMeasure" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white text-black">
                                <option value="">Selecione a unidade...</option>
                                {unitsOfMeasure.map(unit => (
                                    <option key={unit.abbreviation} value={unit.abbreviation}>{unit.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-bold text-dark-text mb-1">Categoria do Item</label>
                            <select id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white text-black">
                                <option value="">Selecione uma categoria...</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="supplier" className="block text-sm font-bold text-dark-text mb-1">Fornecedor</label>
                            <select id="supplier" disabled={!selectedCategory || filteredSuppliers.length === 0} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white text-black disabled:bg-white disabled:cursor-not-allowed">
                                <option value="">{selectedCategory ? 'Selecione um fornecedor...' : 'Selecione uma categoria primeiro'}</option>
                                {filteredSuppliers.map(sup => (
                                    <option key={sup.id} value={sup.id}>{sup.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="deposit" className="block text-sm font-bold text-dark-text mb-1">Depósito</label>
                            <input type="text" id="deposit" placeholder="Ex: Prateleira A-01" className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label htmlFor="unitValue" className="block text-sm font-bold text-dark-text mb-1">Valor por Unidade (R$)</label>
                            <input type="number" id="unitValue" step="0.01" className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-bold text-dark-text mb-1">Quantidade</label>
                            <input type="number" id="quantity" min="1" className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-3">
                        <label htmlFor="observation" className="block text-sm font-bold text-dark-text mb-1">Observação (opcional)</label>
                        <textarea id="observation" rows={3} className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"></textarea>
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
export default RegisterItemForm;