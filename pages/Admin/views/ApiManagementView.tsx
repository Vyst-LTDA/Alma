/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState, useEffect } from 'react';
import ApiStatusCard from '../components/api/ApiStatusCard';
import ApiKeysCard from '../components/api/ApiKeysCard';
import WebhooksCard from '../components/api/WebhooksCard';
import RateLimitingCard from '../components/api/RateLimitingCard';
import SwaggerCard from '../components/api/SwaggerCard';
import ScriptingGuide from '../components/api/ScriptingGuide';
import { CodeBracketIcon } from '../../../components/shared/IconComponents';
import { getSystemVersion } from '../../../services/apiService';

const ApiManagementView: React.FC = () => {
    const [view, setView] = useState<'main' | 'scripting'>('main');

    // FIX: Add state and logic to fetch API status and version for ApiStatusCard.
    const [apiStatus, setApiStatus] = useState<'OPERACIONAL' | 'VERIFICANDO...' | 'FALHA'>('VERIFICANDO...');
    const [apiVersion, setApiVersion] = useState('...');

    const handleCheckApiStatus = async () => {
        setApiStatus('VERIFICANDO...');
        try {
            const versionInfo = await getSystemVersion();
            setApiStatus('OPERACIONAL');
            setApiVersion(versionInfo.version || 'N/A');
        } catch (error) {
            console.error("API status check failed:", error);
            setApiStatus('FALHA');
            setApiVersion('Erro');
        }
    };

    useEffect(() => {
        handleCheckApiStatus();
    }, []);

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
                <ApiStatusCard 
                    status={apiStatus}
                    version={apiVersion}
                    onCheckStatus={handleCheckApiStatus}
                />
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