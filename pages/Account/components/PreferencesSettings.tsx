/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React from 'react';

const PreferencesSettings: React.FC = () => {
    return (
        <div>
            <h3 className="text-xl font-bold text-dark-text mb-6">Preferências</h3>
            
            <div className="space-y-6">
                <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 text-center">
                    <p className="text-light-text">
                        Não há preferências de conta configuráveis disponíveis no momento.
                    </p>
                </div>
            </div>

             <div className="border-t border-gray-200 mt-8 pt-6 flex justify-end">
                <button 
                    className="px-6 py-2.5 bg-gray-300 text-white font-semibold rounded-lg cursor-not-allowed" disabled>
                    Salvar Preferências
                </button>
            </div>
        </div>
    );
};

export default PreferencesSettings;