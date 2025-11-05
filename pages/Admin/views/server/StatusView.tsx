import React, { useState, useEffect } from 'react';
import { getSystemVersion } from '../../../../services/apiService';
import ApiStatusCard from '../../components/api/ApiStatusCard';

interface UpdateInfo {
    status: 'checking' | 'updated' | 'available' | 'error';
    currentVersion: string;
    latestVersion?: string;
}

interface StatusViewProps {
    updateInfo: UpdateInfo;
    onCheckVersion: () => void;
}

const StatusView: React.FC<StatusViewProps> = ({ updateInfo, onCheckVersion }) => {
    const [apiStatus, setApiStatus] = useState<'OPERACIONAL' | 'VERIFICANDO...' | 'FALHA'>('VERIFICANDO...');

    const handleCheckApiStatus = async () => {
        setApiStatus('VERIFICANDO...');
        try {
            await getSystemVersion();
            setApiStatus('OPERACIONAL');
        } catch (error) {
            console.error("API status check failed:", error);
            setApiStatus('FALHA');
        }
    };

    useEffect(() => {
        handleCheckApiStatus();
    }, []);

    return (
        <div className="h-full flex flex-col gap-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ApiStatusCard 
                    status={apiStatus}
                    version={apiStatus === 'FALHA' ? 'Erro' : updateInfo.currentVersion}
                    onCheckStatus={handleCheckApiStatus}
                />

                <div className="bg-light-card p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-bold text-dark-text mb-4">Limites de Taxa (Rate Limiting)</h3>
                    <p className="text-sm text-light-text mb-6">Configure os limites de requisições para proteger a API contra abuso e garantir a estabilidade.</p>
                    <form className="space-y-4">
                         <div>
                             <label htmlFor="reqPerMinute" className="block text-sm font-medium text-dark-text mb-1">Requisições por Minuto</label>
                             <input type="number" id="reqPerMinute" defaultValue="1000" className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                         </div>
                         <div>
                             <label htmlFor="burst" className="block text-sm font-medium text-dark-text mb-1">Pico de Requisições (Burst)</label>
                             <input type="number" id="burst" defaultValue="200" className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                         </div>
                         <div className="flex justify-end pt-4">
                            <button type="submit" className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90">
                                Salvar Alterações
                            </button>
                         </div>
                    </form>
                </div>
            </div>
            <div className="bg-light-card p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-bold text-dark-text mb-4">Manutenção e Logs</h3>
                 <p className="text-sm text-light-text">Acesse os logs do servidor, agende manutenções ou reinicie os serviços da API.</p>
                 <div className="mt-6 flex flex-wrap gap-4">
                     <button className="px-4 py-2 text-sm font-semibold bg-gray-100 text-dark-text rounded-lg hover:bg-gray-200 transition">Ver Logs de Atividade</button>
                     <button className="px-4 py-2 text-sm font-semibold bg-gray-100 text-dark-text rounded-lg hover:bg-gray-200 transition">Ver Logs de Erro</button>
                     <button className="px-4 py-2 text-sm font-semibold bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">Reiniciar Servidor</button>
                 </div>
            </div>
        </div>
    );
};

export default StatusView;