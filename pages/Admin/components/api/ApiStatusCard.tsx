import React from 'react';

type ApiStatus = 'OPERACIONAL' | 'VERIFICANDO...' | 'FALHA';

interface ApiStatusCardProps {
    status: ApiStatus;
    version: string;
    onCheckStatus: () => void;
}

const ApiStatusCard: React.FC<ApiStatusCardProps> = ({ status, version, onCheckStatus }) => {
    const statusInfo = {
        'OPERACIONAL': { text: 'Operacional', color: 'bg-green-500', textColor: 'text-green-600' },
        'VERIFICANDO...': { text: 'Verificando...', color: 'bg-yellow-500', textColor: 'text-yellow-600' },
        'FALHA': { text: 'Fora de Operação', color: 'bg-red-500', textColor: 'text-red-600' },
    };

    return (
        <div className="bg-light-card p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold text-dark-text mb-4">Status da API</h3>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="font-semibold text-light-text">Status Atual</span>
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${statusInfo[status].color}`}></div>
                        <span className={`font-bold ${statusInfo[status].textColor}`}>{statusInfo[status].text}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span className="font-semibold text-light-text">Versão em Uso</span>
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">Storia API v{version}</span>
                </div>
            </div>
            <div className="mt-6 border-t pt-4">
                <button
                    onClick={onCheckStatus}
                    className="w-full px-4 py-2 text-sm font-semibold bg-gray-100 text-dark-text rounded-lg hover:bg-gray-200 transition"
                    disabled={status === 'VERIFICANDO...'}
                >
                    {status === 'VERIFICANDO...' ? 'Verificando...' : 'Verificar Status Novamente'}
                </button>
            </div>
        </div>
    );
};

export default ApiStatusCard;