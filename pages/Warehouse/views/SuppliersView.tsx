import React, { useState } from 'react';
import { Supplier, UserRole } from '../../../types';
import { mockSuppliers } from '../../../data/mockData';
import { PlusIcon, TruckIcon } from '../../../components/shared/IconComponents';
import SupplierModal from '../components/SupplierModal';

const SupplierCard: React.FC<{ supplier: Supplier, onEdit: (supplier: Supplier) => void, userRole: UserRole }> = ({ supplier, onEdit, userRole }) => (
    <div className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between">
        <div>
            <div className="flex justify-between items-start">
                <h3 className="text-md font-bold text-dark-text mb-1">{supplier.name}</h3>
                <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded">{supplier.category}</span>
            </div>
            <p className="text-sm text-light-text font-mono">{supplier.cnpj}</p>
            <div className="mt-4 space-y-2 text-sm">
                <p className="text-dark-text"><strong className="text-light-text">E-mail:</strong> {supplier.email}</p>
                <p className="text-dark-text"><strong className="text-light-text">Telefone:</strong> {supplier.phone}</p>
                <p className="text-dark-text"><strong className="text-light-text">Endereço:</strong> {supplier.address}</p>
            </div>
        </div>
        {userRole === 'admin' &&
            <div className="mt-4 pt-4 border-t border-gray-100 text-right">
                <button onClick={() => onEdit(supplier)} className="text-sm font-semibold text-primary hover:underline">
                    Editar
                </button>
            </div>
        }
    </div>
);


interface SuppliersViewProps {
    userRole: UserRole;
}

const SuppliersView: React.FC<SuppliersViewProps> = ({ userRole }) => {
    const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>(undefined);

    const handleOpenModal = (supplier?: Supplier) => {
        setEditingSupplier(supplier);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSupplier(undefined);
    };

    const handleSaveSupplier = (supplierData: Supplier) => {
        if (editingSupplier) {
            // Edit existing
            setSuppliers(suppliers.map(s => s.id === supplierData.id ? supplierData : s));
        } else {
            // Add new
            setSuppliers([...suppliers, { ...supplierData, id: `sup${Date.now()}` }]);
        }
        handleCloseModal();
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-dark-text">Fornecedores</h2>
                    <p className="text-light-text mt-1">{userRole === 'admin' ? "Cadastre e gerencie os parceiros do almoxarifado." : "Consulte os parceiros cadastrados do almoxarifado."}</p>
                </div>
                {userRole === 'admin' && (
                    <button onClick={() => handleOpenModal()} className="flex items-center bg-primary text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-primary/90 transition-all">
                        <PlusIcon className="w-5 h-5 mr-2"/>
                        Registrar Fornecedor
                    </button>
                )}
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {suppliers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {suppliers.map(supplier => (
                            <SupplierCard key={supplier.id} supplier={supplier} onEdit={handleOpenModal} userRole={userRole} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-light-text bg-gray-50 rounded-lg">
                        <TruckIcon className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="font-semibold text-dark-text">Nenhum fornecedor cadastrado</h3>
                        {userRole === 'admin' && <p>Clique em "Registrar Fornecedor" para começar.</p>}
                    </div>
                )}
            </div>

            {isModalOpen && userRole === 'admin' && (
                <SupplierModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveSupplier}
                    supplier={editingSupplier}
                />
            )}
        </div>
    );
};

export default SuppliersView;