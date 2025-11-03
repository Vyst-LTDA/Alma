

import React from 'react';
// FIX: Import path for IconComponents was incorrect.
import { DotsHorizontalIcon } from '../shared/IconComponents';

interface ChartContainerProps {
    title: string;
    children: React.ReactNode;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ title, children }) => {
    return (
        <div className="bg-light-card p-6 rounded-xl border border-gray-200 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-dark-text">{title}</h3>
                <button className="p-1 text-light-text hover:bg-gray-100 rounded-full">
                    <DotsHorizontalIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="flex-grow w-full h-full">
                {children}
            </div>
        </div>
    );
};

export default ChartContainer;
