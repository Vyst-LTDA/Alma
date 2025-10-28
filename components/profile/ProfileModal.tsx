import React from 'react';
import { UserRole } from '../../types';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userRole: UserRole;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, userRole }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-light-card p-6 rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-dark-text">Perfil do Usuário</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                <div>
                    <p>Aqui seriam exibidas as informações do perfil do usuário.</p>
                    <p className="mt-2"><strong>Role:</strong> <span className="capitalize">{userRole}</span></p>
                </div>
                <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-dark-text font-semibold rounded-lg hover:bg-gray-300">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
