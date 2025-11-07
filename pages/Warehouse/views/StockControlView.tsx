import React, { useState } from 'react';
import RegisterItemForm from '../components/RegisterItemForm';
import StockItemsTable from '../components/StockItemsTable';
import { PlusIcon, ArchiveIcon, ArrowUturnLeftIcon } from '../../../components/shared/IconComponents';
// FIX: Removed unused 'Request' type.
import { UserRole, UserData, ItemDto } from '../../../types';
import RequestsManagementTable from '../components/RequestsManagementTable';
// FIX: Removed unused 'allRequests' import which was causing an error.
import AddStockEntryModal from '../components/AddStockEntryModal';


// --- New sub-view component defined inside this file ---
interface StockEntriesViewProps {
    userRole: UserRole;
    onBack: () => void;
    userData: UserData;
}

const StockEntriesView: React.FC<StockEntriesViewProps> = ({ userRole, onBack, userData }) => {
    const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleEntryAdded = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <ArrowUturnLeftIcon className="w-6 h-6 text-dark-text" />
                    </button>
                    <h2 className="text-2xl font-bold text-dark-text">Histórico de Entradas no Estoque</h2>
                </div>
                <button 
                    onClick={() => setIsAddEntryModalOpen(true)}
                    className="flex items-center bg-primary text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-primary/90 transition-all"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Adicionar Entrada
                </button>
            </div>
            
            <div className="flex-grow mt-4">
                <RequestsManagementTable 
                    refreshKey={refreshKey}
                    movementType="CheckIn"
                />
            </div>
            
            <AddStockEntryModal 
                isOpen={isAddEntryModalOpen} 
                onClose={() => setIsAddEntryModalOpen(false)}
                userRole={userRole}
                onEntryAdded={handleEntryAdded}
                userData={userData}
            />
        </div>
    )
}
// --- End of new sub-view component ---

interface StockControlViewProps {
    userRole: UserRole;
    userData: UserData;
}

const StockControlView: React.FC<StockControlViewProps> = ({ userRole, userData }) => {
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<ItemDto | null>(null);
    const [currentSubView, setCurrentSubView] = useState<'main' | 'entries'>('main');
    const [refreshKey, setRefreshKey] = useState(0);

    if (currentSubView === 'entries') {
        return <StockEntriesView userRole={userRole} onBack={() => setCurrentSubView('main')} userData={userData} />;
    }
    
    const handleItemRegistered = () => {
      setRefreshKey(prev => prev + 1);
    };

    const handleOpenEditModal = (item: ItemDto) => {
        setItemToEdit(item);
        setIsRegisterModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsRegisterModalOpen(false);
        setItemToEdit(null);
    };


    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-dark-text">Controle de Estoque</h2>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setCurrentSubView('entries')}
                        className="flex items-center bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-all"
                    >
                        <ArchiveIcon className="w-5 h-5 mr-2" />
                        Histórico de Entradas
                    </button>
                    {userRole === 'admin' && (
                        <button 
                            onClick={() => setIsRegisterModalOpen(true)}
                            className="flex items-center bg-primary text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-primary/90 transition-all"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Registrar Novo Item
                        </button>
                    )}
                </div>
            </div>
            
            <div className="flex-grow">
                <StockItemsTable refreshKey={refreshKey} onEditItem={handleOpenEditModal} />
            </div>

            {isRegisterModalOpen && (
              <RegisterItemForm 
                isOpen={isRegisterModalOpen} 
                onClose={handleCloseModal} 
                onItemRegistered={handleItemRegistered} 
                itemToEdit={itemToEdit}
              />
            )}
        </div>
    );
}

export default StockControlView;