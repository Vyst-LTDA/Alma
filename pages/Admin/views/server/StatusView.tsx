import React, { useState } from 'react';
import { ArrowPathIcon, CheckCircleIcon } from '../../../../components/shared/IconComponents';

interface UpdateInfo {
    status: 'checking' | 'updated' | 'available';
    currentVersion: string;
    latestVersion?: string;
}

interface StatusViewProps {
    updateInfo: UpdateInfo;
    onCheckVersion: () => void;
}

const StatusView: React.FC<StatusViewProps> = ({ updateInfo, onCheckVersion }) => {
    const [apiStatus, setApiStatus] = useState<'OPERACIONAL' | 'VERIFICANDO...' | 'FALHA'>('OPERACIONAL');

    const handleCheckApiStatus = () => {
        setApiStatus('VERIFICANDO...');
        setTimeout(() => {
            setApiStatus('OPERACIONAL');
        }, 1500);
    };
    
    const apiStatusInfo = {
        'OPERACIONAL': { text: 'Operacional', color: 'bg-green-500', textColor: 'text-green-600' },
        'VERIFICANDO...': { text: 'Verificando...', color: 'bg-yellow-500', textColor: 'text-yellow-600' },
        'FALHA': { text: 'Fora de Operação', color: 'bg-red-500', textColor: 'text-red-600' },
    };

    return (
        <div className="h-full flex flex-col gap-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* API Status Card */}
                <div className="bg-light-card p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-bold text-dark-text mb-4">Status da API</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-light-text">Status Atual</span>
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${apiStatusInfo[apiStatus].color}`}></div>
                                <span className={`font-bold ${apiStatusInfo[apiStatus].textColor}`}>{apiStatusInfo[apiStatus].text}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-light-text">Versão em Uso</span>
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">Storia API v{updateInfo.currentVersion}</span>
                        </div>
                    </div>
                    <div className="mt-6 border-t pt-4">
                        <button
                            onClick={handleCheckApiStatus}
                            className="w-full px-4 py-2 text-sm font-semibold bg-gray-100 text-dark-text rounded-lg hover:bg-gray-200 transition"
                            disabled={apiStatus === 'VERIFICANDO...'}
                        >
                            {apiStatus === 'VERIFICANDO...' ? 'Verificando...' : 'Verificar Status Novamente'}
                        </button>
                    </div>
                </div>

                 {/* Rate Limiting Card */}
                <div className="bg-light-card p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-bold text-dark-text mb-4">Limites de Taxa (Rate Limiting)</h3>
                    <form className="space-y-3">
                         <div>
                             <label htmlFor="reqPerMinute" className="block text-sm font-medium text-light-text mb-1">Requisições por Minuto</label>
                             <input type="number" id="reqPerMinute" defaultValue="1000" className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                         </div>
                         <div>
                             <label htmlFor="burst" className="block text-sm font-medium text-light-text mb-1">Pico de Requisições (Burst)</label>
                             <input type="number" id="burst" defaultValue="200" className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
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