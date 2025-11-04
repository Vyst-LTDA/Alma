import React from 'react';
import RequestsManagementTable from '../../Warehouse/components/RequestsManagementTable';

const EducationalWarehouseView: React.FC = () => {
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