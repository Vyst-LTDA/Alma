import React, { useState, useMemo } from 'react';
import { Contact, UserRole } from '../../../types';
import { mockUsers } from '../../../data/mockData';
import { SearchIcon, DotsVerticalIcon, UserCircleIcon } from '../../../components/shared/IconComponents';

interface UserManagementViewProps {
    manageableRoles: UserRole[];
}

const UserManagementView: React.FC<UserManagementViewProps> = ({ manageableRoles }) => {
    const [users] = useState<Contact[]>(mockUsers.filter(u => u.role && manageableRoles.includes(u.role)));
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

    const roleNames: { [key in UserRole]?: string } = {
        professor: 'Docente',
        warehouse: 'Almoxarifado',
        admin: 'Administrador',
    };

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);

    const roleFilterOptions = manageableRoles.map(role => ({
        value: role,
        label: roleNames[role] || role,
    }));

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-2xl font-bold text-dark-text mb-6">Gerenciamento de Usuários</h2>
            
            <div className="bg-light-card p-6 rounded-xl border border-gray-200 h-full flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <div className="relative w-full md:w-1/3">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou e-mail..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                        />
                    </div>
                    <div className="w-full md:w-auto">
                        <select
                            value={roleFilter}
                            onChange={e => setRoleFilter(e.target.value as any)}
                            className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition bg-white text-black"
                        >
                            <option value="all">Todos os Perfis</option>
                            {roleFilterOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto">
                    <table className="w-full text-sm text-left text-dark-text">
                        <thead className="text-xs text-light-text uppercase bg-gray-50 sticky top-0">
                            <tr>
                                <th scope="col" className="px-6 py-3">Usuário</th>
                                <th scope="col" className="px-6 py-3">E-mail</th>
                                <th scope="col" className="px-6 py-3">Perfil</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <UserCircleIcon className="w-8 h-8 text-gray-400" />
                                                </div>
                                            )}
                                            <span className="font-semibold">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4 font-medium">{roleNames[user.role!]}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">Ativo</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center">
                                            <button className="p-2 rounded-full hover:bg-gray-100">
                                                <DotsVerticalIcon className="w-5 h-5 text-gray-500" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-10 text-light-text">
                            <p>Nenhum usuário encontrado com os filtros atuais.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserManagementView;