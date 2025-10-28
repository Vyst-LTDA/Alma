/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState, useMemo } from 'react';
import { UserRole, Request, UserData } from '../../../types';
import RequestsManagementTable from '../components/RequestsManagementTable';
import { allRequests } from '../../../data/mockData';
import { FileTextIcon } from '../../../components/shared/IconComponents';
import RequestModal from '../../../components/shared/RequestModal';

interface RequestsViewProps {
    userRole: UserRole;
    userData: UserData;
}

const RequestsView: React.FC<RequestsViewProps> = ({ userRole, userData }) => {
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [key, setKey] = useState(0); // To force re-render of child

    const handleNewRequest = (newRequest: Request) => {
        allRequests.unshift(newRequest);
        setKey(prev => prev + 1); // Update key to trigger re-render and re-filter
    };

    const outgoingRequests = useMemo(() => 
        allRequests.filter(req => req.status === 'Entregue' || req.status === 'Recusado'), 
    [key]);

    return (
        <div className="h-full flex flex-col">
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-dark-text">Gerenciamento de Solicitações</h2>
                <button 
                    onClick={() => setIsRequestModalOpen(true)}
                    className="flex items-center bg-primary text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
                >
                    <FileTextIcon className="w-5 h-5 mr-2" />
                    Nova Requisição
                </button>
            </div>
            
            <div className="flex-grow mt-4">
                <RequestsManagementTable 
                    requests={outgoingRequests} 
                />
            </div>

            {isRequestModalOpen && (
              <RequestModal 
                isOpen={isRequestModalOpen} 
                onClose={() => setIsRequestModalOpen(false)} 
                userData={userData}
                onNewRequest={handleNewRequest}
              />
            )}
        </div>
    )
}

export default RequestsView;