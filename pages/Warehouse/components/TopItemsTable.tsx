import React from 'react';
import ChartContainer from '../../../components/shared/ChartContainer';

interface TopItemsTableProps {
    data: { name: string, quantity: number }[];
}

const TopItemsTable: React.FC<TopItemsTableProps> = ({ data }) => {
    return (
        <ChartContainer title="Top 5 Itens Mais Requisitados">
            <div className="overflow-x-auto h-full">
                <table className="w-full text-sm text-left text-dark-text">
                    <thead className="text-xs text-light-text uppercase bg-gray-50/50">
                        <tr>
                            <th scope="col" className="px-6 py-3 w-12 text-center">#</th>
                            <th scope="col" className="px-6 py-3">Item</th>
                            <th scope="col" className="px-6 py-3 text-right">Quantidade Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? data.map((item, index) => (
                            <tr key={item.name} className="bg-white border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-center font-bold text-primary">{index + 1}</td>
                                <td className="px-6 py-4 font-semibold">{item.name}</td>
                                <td className="px-6 py-4 text-right font-medium">{item.quantity}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={3} className="text-center py-10 text-light-text">
                                    Nenhum item requisitado ainda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </ChartContainer>
    );
};

export default TopItemsTable;
