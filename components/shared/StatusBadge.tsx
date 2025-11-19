/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React from 'react';
import { Request } from '../../types';

interface StatusBadgeProps {
    status: Request['status'];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full inline-block';
    const statusClasses = {
        Aprovado: 'bg-blue-100 text-blue-700',
        Pendente: 'bg-yellow-100 text-yellow-700',
        Recusado: 'bg-red-100 text-red-700',
        Entregue: 'bg-green-100 text-green-700',
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

export default StatusBadge;