/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React from 'react';
import { Request } from '../../../types';
import StatusBadge from '../../../components/shared/StatusBadge';

const requests: Request[] = [];

const RecentRequestsTable: React.FC = () => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-dark-text">
                <thead className="text-xs text-light-text uppercase bg-gray-50/50">
                    <tr>
                        <th scope="col" className="px-6 py-3">ID</th>
                        <th scope="col" className="px-6 py-3">Item</th>
                        <th scope="col" className="px-6 py-3">Solicitante</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.length > 0 ? requests.map((req) => (
                        <tr key={req.id} className="bg-white border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-primary">{req.id}</td>
                            <td className="px-6 py-4">
                                <div>{req.item}</div>
                                <div className="text-xs text-light-text">Qtd: {req.quantity}</div>
                            </td>
                            <td className="px-6 py-4">{req.requester}</td>
                            <td className="px-6 py-4">
                                <StatusBadge status={req.status} />
                            </td>
                        </tr>
                    )) : (
                         <tr>
                            <td colSpan={4} className="text-center py-10 text-light-text">
                                Nenhuma requisição recente encontrada.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RecentRequestsTable;