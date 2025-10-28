import React, { useState } from 'react';
import ApiStatusCard from '../components/api/ApiStatusCard';
import ApiKeysCard from '../components/api/ApiKeysCard';
import WebhooksCard from '../components/api/WebhooksCard';
import RateLimitingCard from '../components/api/RateLimitingCard';
import SwaggerCard from '../components/api/SwaggerCard';
import ScriptingGuide from '../components/api/ScriptingGuide';
import { CodeBracketIcon } from '../../../components/shared/IconComponents';

const ApiManagementView: React.FC = () => {
    const [view, setView] = useState<'main' | 'scripting'>('main');

    if (view === 'scripting') {
        return <ScriptingGuide onBack={() => setView('main')} />;
    }

    return (
        <div className="h-full flex flex-col gap-8">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-dark-text">Gerenciamento da API e Integrações</h2>
                    <p className="text-light-text mt-1">Monitore o status, gerencie chaves de acesso e configure webhooks da API Storia.</p>
                </div>
                <button 
                    onClick={() => setView('scripting')}
                    className="flex items-center bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-gray-800 transition-all text-sm whitespace-nowrap"
                >
                    <CodeBracketIcon className="w-5 h-5 mr-2" />
                    Guia de Scripting
                </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <ApiStatusCard />
                <SwaggerCard />
            </div>

            <ApiKeysCard />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <WebhooksCard />
                <RateLimitingCard />
            </div>
        </div>
    );
};

export default ApiManagementView;