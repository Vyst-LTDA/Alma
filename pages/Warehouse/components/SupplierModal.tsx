import React, { useState, useEffect } from 'react';
import { Supplier } from '../../../types';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplier: Supplier) => void;
  supplier?: Supplier;
}

const SupplierModal: React.FC<SupplierModalProps> = ({ isOpen, onClose, onSave, supplier }) => {
    const [formData, setFormData] = useState<Omit<Supplier, 'id'>>({
        name: '',
        cnpj: '',
        phone: '',
        email: '',
        address: '',
        category: ''
    });

    useEffect(() => {
        if (supplier) {
            setFormData(supplier);
        } else {
             setFormData({ name: '', cnpj: '', phone: '', email: '', address: '', category: '' });
        }
    }, [supplier, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: supplier?.id || '', // ID is handled by parent
            ...formData
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-light-card w-full max-w-lg rounded-xl shadow-xl p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-dark-text mb-4">{supplier ? 'Editar Fornecedor' : 'Registrar Novo Fornecedor'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-dark-text mb-1">Nome</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                        </div>
                        <div>
                            <label htmlFor="cnpj" className="block text-sm font-medium text-dark-text mb-1">CNPJ</label>
                            <input type="text" id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleChange} required className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                        </div>
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-dark-text mb-1">E-mail</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-dark-text mb-1">Telefone</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-dark-text mb-1">Endereço</label>
                        <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-dark-text mb-1">Categoria Principal</label>
                        <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white text-black">
                             <option value="" disabled>Nenhuma categoria disponível</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-dark-text font-semibold rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SupplierModal;