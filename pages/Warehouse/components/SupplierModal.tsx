import React, { useState } from 'react';
import { CreateCustomerCommand } from '../../../types';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customerData: CreateCustomerCommand) => void;
}

const SupplierModal: React.FC<CustomerModalProps> = ({ isOpen, onClose, onSave }) => {
    // This modal now handles Customers, not Suppliers.
    // The API does not support editing customers, so this is a create-only modal.
    const [formData, setFormData] = useState({
        name: '',
        taxId: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Brasil'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const customerData: CreateCustomerCommand = {
            // Using a placeholder/default Tenant ID. In a real multi-tenant app, this would be dynamic.
            tenantId: '00000000-0000-0000-0000-000000000000', 
            name: formData.name,
            taxId: formData.taxId,
            billingAddress: {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
                country: formData.country,
            },
            // Assuming billing and shipping addresses are the same for simplicity
            shippingAddress: {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
                country: formData.country,
            }
        };
        onSave(customerData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-light-card w-full max-w-2xl rounded-xl shadow-xl p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-dark-text mb-4">Registrar Novo Cliente</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-dark-text mb-1">Nome / Razão Social</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                        </div>
                        <div>
                            <label htmlFor="taxId" className="block text-sm font-medium text-dark-text mb-1">CNPJ / CPF</label>
                            <input type="text" id="taxId" name="taxId" value={formData.taxId} onChange={handleChange} required className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="street" className="block text-sm font-medium text-dark-text mb-1">Endereço (Rua, Nº)</label>
                        <input type="text" id="street" name="street" value={formData.street} required className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-dark-text mb-1">Cidade</label>
                            <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                        </div>
                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-dark-text mb-1">Estado</label>
                            <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} required className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                        </div>
                        <div>
                            <label htmlFor="postalCode" className="block text-sm font-medium text-dark-text mb-1">CEP</label>
                            <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} required className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                        </div>
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