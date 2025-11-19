/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React from 'react';
import ChartContainer from '../../../components/shared/ChartContainer';
import { Request } from '../../../types';

type LoanStatus = 'Vencido' | 'Vence Hoje' | 'Em Breve' | 'Em Dia';

const getLoanStatus = (returnDate?: string): LoanStatus => {
    if (!returnDate) return 'Em Dia';
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let due: Date;
    // Handles both DD/MM/YYYY and YYYY-MM-DD to be robust
    if (returnDate.includes('/')) {
        const parts = returnDate.split('/');
        due = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    } else {
        const parts = returnDate.split('-');
        due = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    }

    // This check prevents crashes from invalid date strings.
    if (isNaN(due.getTime())) {
        const fallbackDate = new Date(returnDate); // Try one more time with native parser
        if (isNaN(fallbackDate.getTime())) {
           return 'Em Dia'; // Give up and return safe default
        }
        due = fallbackDate;
    }

    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Vencido';
    if (diffDays === 0) return 'Vence Hoje';
    if (diffDays <= 3) return 'Em Breve';
    return 'Em Dia';
}


const LoanStatusBadge: React.FC<{ status: LoanStatus }> = ({ status }) => {
    const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full inline-block';
    const statusClasses = {
        'Vencido': 'bg-red-100 text-red-700',
        'Vence Hoje': 'bg-yellow-100 text-yellow-700',
        'Em Breve': 'bg-blue-100 text-blue-700',
        'Em Dia': 'bg-green-100 text-green-700',
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

interface ActiveLoansTableProps {
    loans: Request[];
}

const ActiveLoansTable: React.FC<ActiveLoansTableProps> = ({ loans }) => {
    return (
        <ChartContainer title="Meus Empréstimos Ativos">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-dark-text">
                    <thead className="text-xs text-light-text uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID da Requisição</th>
                            <th scope="col" className="px-6 py-3">Item Emprestado</th>
                            <th scope="col" className="px-6 py-3">Data de Retirada</th>
                            <th scope="col" className="px-6 py-3">Data de Devolução</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.length > 0 ? loans.map((loan) => (
                            <tr key={loan.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-primary">{loan.id}</td>
                                <td className="px-6 py-4">{loan.item}</td>
                                <td className="px-6 py-4">{loan.requestDate}</td>
                                <td className="px-6 py-4 font-medium text-dark-text">{loan.returnDate}</td>
                                <td className="px-6 py-4">
                                    <LoanStatusBadge status={getLoanStatus(loan.returnDate)} />
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-light-text">
                                    Nenhum empréstimo ativo encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </ChartContainer>
    );
};

export default ActiveLoansTable;