import React, { useMemo } from 'react';
import { allRequests, mockUsers } from '../../../data/mockData';
import RequestsManagementTable from '../../Warehouse/components/RequestsManagementTable';
import { Request } from '../../../types';

const EducationalWarehouseView: React.FC = () => {
    // This assumes there's only one warehouse user in mock data for this logic.
    const warehouseUser = useMemo(() => mockUsers.find(u => u.role === 'warehouse'), []);

    // Since allRequests is a mutable global, this will re-filter on every render.
    // In a real app, this would come from a state management solution or API call.
    const warehouseRequests = useMemo(() => {
        if (!warehouseUser) return [];
        // A simple way to trigger re-evaluation is to depend on the length of allRequests.
        // This is a workaround for not having a proper state management solution.
        return allRequests.filter(req => req.requester === warehouseUser.name);
    }, [warehouseUser, allRequests.length]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-dark-text">Requisições do Almoxarifado Educacional</h2>
            </div>
            <p className="text-light-text mb-6">
                Gerencie as solicitações de itens feitas pela equipe do almoxarifado para fins educacionais ou uso interno.
            </p>
            
            <div className="flex-grow">
                {/* FIX: The 'requests' prop is not valid for this component. It fetches its own data. This prop has been removed. */}
                <RequestsManagementTable 
                />
            </div>
        </div>
    );
};

export default EducationalWarehouseView;
