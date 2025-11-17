import React, { useState, useEffect } from 'react';

const ToggleSwitch: React.FC<{ isEnabled: boolean; onToggle: () => void }> = ({ isEnabled, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                isEnabled ? 'bg-primary' : 'bg-gray-300'
            }`}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );
};

const PreferencesSettings: React.FC = () => {
    const [earlyAccess, setEarlyAccess] = useState(false);
    const [showRefreshMessage, setShowRefreshMessage] = useState(false);

    useEffect(() => {
        const isEnabled = localStorage.getItem('earlyAccess') === 'true';
        setEarlyAccess(isEnabled);
    }, []);

    const handleToggleEarlyAccess = () => {
        const newValue = !earlyAccess;
        setEarlyAccess(newValue);
        localStorage.setItem('earlyAccess', String(newValue));
        setShowRefreshMessage(true);
    };


    return (
        <div>
            <h3 className="text-xl font-bold text-dark-text mb-6">Preferências</h3>
            
            <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                        <h4 className="font-semibold text-dark-text">Programa de Acesso Antecipado</h4>
                        <p className="text-sm text-light-text mt-1">
                            Experimente novos recursos do Alma antes de todo mundo.
                        </p>
                    </div>
                    <ToggleSwitch isEnabled={earlyAccess} onToggle={handleToggleEarlyAccess} />
                </div>
                 {showRefreshMessage && (
                    <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm">
                        <p><strong>Preferência salva!</strong> Para que as alterações tenham efeito, por favor, <strong>atualize a página</strong> (F5 ou Ctrl+R).</p>
                    </div>
                 )}
                 {earlyAccess && !showRefreshMessage && (
                    <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm">
                        <p><strong>Acesso Antecipado Ativo!</strong> Fique de olho em novos recursos que podem aparecer no sistema.</p>
                    </div>
                 )}
            </div>

             <div className="border-t border-gray-200 mt-8 pt-6 flex justify-end">
                <button 
                    onClick={() => alert("Preferências salvas!")}
                    className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 shadow-sm transition-transform transform hover:scale-105 disabled:bg-gray-400">
                    Salvar Preferências
                </button>
            </div>
        </div>
    );
};

export default PreferencesSettings;