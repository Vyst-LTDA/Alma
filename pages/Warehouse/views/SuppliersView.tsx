import React, { useState, useEffect } from 'react';
import { UserRole, CustomerDto, CreateCustomerCommand } from '../../../types';
import { PlusIcon, TruckIcon } from '../../../components/shared/IconComponents';
import CustomerModal from '../components/SupplierModal'; // Stays the same filename
import { getCustomers, createCustomer } from '../../../services/apiService';

const CustomerCard: React.FC<{ customer: CustomerDto }> = ({ customer }) => {
    const address = customer.billingAddress;
    const fullAddress = [address.street, address.city, address.state, address.postalCode].filter(Boolean).join(', ');
    return (
        <div className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-md font-bold text-dark-text mb-1">{customer.name}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${customer.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {customer.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                </div>
                <p className="text-sm text-light-text font-mono">{customer.taxId}</p>
                <div className="mt-4 space-y-2 text-sm">
                    <p className="text-dark-text"><strong className="text-light-text">Endereço:</strong> {fullAddress || 'Não informado'}</p>
                </div>
            </div>
        </div>
    );
};

interface CustomersViewProps {
    userRole: UserRole;
}

const CustomersView: React.FC<CustomersViewProps> = ({ userRole }) => {
    // This view now handles Customers, not Suppliers.
    const [customers, setCustomers] = useState<CustomerDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchCustomers = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getCustomers({ pageSize: 100 });
            setCustomers(result.items);
        } catch (err: any) {
            setError('Falha ao carregar clientes.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveCustomer = async (customerData: CreateCustomerCommand) => {
        try {
            await createCustomer(customerData);
            handleCloseModal();
            fetchCustomers(); // Refresh list after adding
        } catch (err: any) {
            alert(`Erro ao salvar cliente: ${err.message}`);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-dark-text">Clientes</h2>
                    <p className="text-light-text mt-1">{userRole === 'admin' ? "Cadastre e gerencie os clientes do sistema." : "Consulte os clientes cadastrados."}</p>
                </div>
                {userRole === 'admin' && (
                    <button onClick={handleOpenModal} className="flex items-center bg-primary text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-primary/90 transition-all">
                        <PlusIcon className="w-5 h-5 mr-2"/>
                        Registrar Cliente
                    </button>
                )}
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {loading ? (
                    <div className="text-center py-10 text-light-text">Carregando clientes...</div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500">{error}</div>
                ) : customers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {customers.map(customer => (
                            <CustomerCard key={customer.id} customer={customer} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-light-text bg-gray-50 rounded-lg">
                        <TruckIcon className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="font-semibold text-dark-text">Nenhum cliente cadastrado</h3>
                        {userRole === 'admin' && <p>Clique em "Registrar Cliente" para começar.</p>}
                    </div>
                )}
            </div>

            {isModalOpen && userRole === 'admin' && (
                <CustomerModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveCustomer}
                />
            )}
        </div>
    );
};

export default CustomersView;