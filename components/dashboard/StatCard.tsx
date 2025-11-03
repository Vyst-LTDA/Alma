

import React from 'react';
import { StatCardType } from '../../types';
// FIX: Import path for IconComponents was incorrect.
import { ArrowUpIcon, ArrowDownIcon } from '../shared/IconComponents';

const StatCard: React.FC<StatCardType> = ({ title, value, change, changeType, icon }) => {
    const changeColor = changeType === 'increase' ? 'text-green-500' : changeType === 'decrease' ? 'text-red-500' : 'text-light-text';
    
    return (
        <div className="bg-light-card p-6 rounded-xl border border-gray-200 flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <p className="text-light-text font-medium">{title}</p>
                    <p className="text-3xl font-bold text-dark-text mt-1">{value}</p>
                </div>
                {icon}
            </div>
            <div className="flex items-center text-sm mt-4">
                <span className={`flex items-center font-semibold ${changeColor}`}>
                    {changeType === 'increase' && <ArrowUpIcon className="w-4 h-4 mr-1" />}
                    {changeType === 'decrease' && <ArrowDownIcon className="w-4 h-4 mr-1" />}
                    {change}
                </span>
                <span className="text-light-text ml-2">no último mês</span>
            </div>
        </div>
    );
};

export default StatCard;
