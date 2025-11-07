import React, { useState, useEffect } from 'react';
import { UserDto, UserRole, UpdateUserRequestDto } from '../../../../types';
import { updateUser } from '../../../../services/apiService';

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserDto;
    onSave: () => void;
    manageableRoles: UserRole[];
}

const roleNames: { [key: string]: string } = {
    professor: 'Docente',
    warehouse: 'Almoxarifado',
    admin: 'Administrador',
};

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, onSave, manageableRoles }) => {
    const [formData, setFormData] = useState({
        fullName: user.fullName || '',
        role: user.role?.toLowerCase() || '',
        isActive: user.isActive,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setFormData({
            fullName: user.fullName || '',
            role: user.role?.toLowerCase() || '',
            isActive: user.isActive,
        });
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        const updateData: UpdateUserRequestDto = {
            fullName: formData.fullName,
            role: formData.role,
            isActive: formData.isActive,
        };

        try {
            await updateUser(user.id, updateData);
            onSave();
        } catch (err: any) {
            setError(err.message || 'Falha ao atualizar o usuário.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-light-card w-full max-w-lg rounded-xl shadow-xl p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-dark-text mb-4">Editar Usuário</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                     {error && (
                        <div className="bg-red-100 border border-red-300 text-red-700 text-sm p-3 rounded-lg">
                            {error}
                        </div>
                    )}
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-dark-text mb-1">Nome Completo</label>
                        <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-dark-text mb-1">E-mail</label>
                        <input type="email" id="email" name="email" value={user.email || ''} readOnly className="w-full px-3 py-2 bg-gray-100 text-gray-500 border border-gray-300 rounded-lg cursor-not-allowed" />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-dark-text mb-1">Perfil de Acesso</label>
                        <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white text-black">
                            {manageableRoles.map(role => (
                                <option key={role} value={role}>{roleNames[role]}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center">
                        <input
                            id="isActive"
                            name="isActive"
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-dark-text">
                            Usuário Ativo
                        </label>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-dark-text font-semibold rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:bg-gray-400">
                            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
