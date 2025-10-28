/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from '../../../components/shared/IconComponents';

const SecuritySettings: React.FC = () => {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Os campos são controlados, mas não são preenchidos por padrão, aguardando a entrada do usuário.
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <div>
            <h3 className="text-xl font-bold text-dark-text mb-6">Alterar Senha</h3>
            
            <div className="space-y-6 max-w-lg">
                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-light-text mb-1">
                        Senha Atual
                    </label>
                    <div className="relative">
                        <input
                            type={showCurrent ? "text" : "password"}
                            id="currentPassword"
                            className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            aria-label={showCurrent ? "Ocultar senha" : "Mostrar senha"}
                        >
                            {showCurrent ? <EyeOffIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                        </button>
                    </div>
                </div>
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-light-text mb-1">
                        Nova Senha
                    </label>
                    <div className="relative">
                        <input
                            type={showNew ? "text" : "password"}
                            id="newPassword"
                            className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                         <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            aria-label={showNew ? "Ocultar senha" : "Mostrar senha"}
                        >
                            {showNew ? <EyeOffIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                        </button>
                    </div>
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-light-text mb-1">
                        Confirmar Nova Senha
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            id="confirmPassword"
                            className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                         <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
                        >
                            {showConfirm ? <EyeOffIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 mt-8 pt-6 flex justify-end">
                <button className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 shadow-sm transition-transform transform hover:scale-105">
                    Alterar Senha
                </button>
            </div>
        </div>
    );
};

export default SecuritySettings;