/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useRef, useState, useEffect } from 'react';
import { UserCircleIcon } from '../../../components/shared/IconComponents';
import { UserData } from '../../../types';

interface ProfileSettingsProps {
    userData: UserData;
    onUpdate: (data: Partial<UserData>) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ userData, onUpdate }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [localUserData, setLocalUserData] = useState(userData);

    useEffect(() => {
        setLocalUserData(userData);
    }, [userData]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newAvatar = e.target?.result as string;
                setLocalUserData(prev => ({ ...prev, avatar: newAvatar }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setLocalUserData(prev => ({ ...prev, [id]: value }));
    }

    const handleSave = () => {
        onUpdate(localUserData);
        alert('Alterações salvas com sucesso!');
    };

    return (
        <div>
            <h3 className="text-xl font-bold text-dark-text mb-6">Configurações de Perfil</h3>
            
            <div className="space-y-8">
                {/* Profile Picture */}
                <div className="flex items-center gap-5">
                    <button onClick={handleAvatarClick} className="relative w-24 h-24 rounded-full group">
                        {localUserData.avatar ? (
                            <img src={localUserData.avatar} alt="User Avatar" className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-sm" />
                        ) : (
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm">
                                <UserCircleIcon className="w-16 h-16 text-gray-400" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            Alterar
                        </div>
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/gif" />
                    <div>
                        <button onClick={handleAvatarClick} className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 shadow-sm transition-transform transform hover:scale-105">
                            Alterar Foto
                        </button>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-light-text mb-1">
                            Nome Completo
                        </label>
                        <input type="text" id="name" value={localUserData.name} onChange={handleInputChange} className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-light-text mb-1">
                            E-mail
                        </label>
                        <input type="email" id="email" value={localUserData.email} readOnly className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition cursor-not-allowed" />
                    </div>
                    <div>
                        <label htmlFor="cpf" className="block text-sm font-medium text-light-text mb-1">
                            CPF
                        </label>
                        <input type="text" id="cpf" value={localUserData.cpf} readOnly className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition cursor-not-allowed" />
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 mt-8 pt-6 flex justify-end">
                <button onClick={handleSave} className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 shadow-sm transition-transform transform hover:scale-105">
                    Salvar Alterações
                </button>
            </div>
        </div>
    );
};

export default ProfileSettings;