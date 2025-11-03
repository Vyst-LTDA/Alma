import React, { useState, useMemo, useEffect } from 'react';
import { UserDto, UserRole } from '../../../types';
import { getUsers } from '../../../services/apiService';
import { SearchIcon, DotsVerticalIcon, UserCircleIcon } from '../../../components/shared/IconComponents';

interface UserManagementViewProps {
    manageableRoles: UserRole[];
}

const UserManagementView: React.FC<UserManagementViewProps> = ({ manageableRoles }) => {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

    const roleNames: { [key: string]: string } = {
        professor: 'Docente',
        warehouse: 'Almoxarifado',
        admin: 'Administrador',
    };

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                // In a real app with many users, you'd implement pagination controls.
                // For now, fetching a large page size to get all relevant users.
                const result = await getUsers({ 
                    pageNumber: 1, 
                    pageSize: 100, 
                    searchTerm: searchTerm 
                });
                
                let fetchedUsers = result.items;

                // Client-side filtering for role as the mock API might not support it
                if (roleFilter !== 'all') {
                    fetchedUsers = fetchedUsers.filter(user => user.role && user.role.toLowerCase() === roleFilter);
                }

                setUsers(fetchedUsers);
            } catch (err: any) {
                setError(err.message || 'Falha ao buscar usuários.');
            } finally {
                setLoading(false);
            }
        };

        const debounceFetch = setTimeout(() => {
            fetchUsers();
        }, 300);

        return () => clearTimeout(debounceFetch);
    }, [searchTerm, roleFilter, manageableRoles]);

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
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-light-text">Carregando usuários...</div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full text-red-500">{error}</div>
                    ) : (
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
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <UserCircleIcon className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <span className="font-semibold">{user.fullName || 'Nome não disponível'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{user.email || 'E-mail não disponível'}</td>
                                        <td className="px-6 py-4 font-medium">
                                            {user.role ? (roleNames[user.role.toLowerCase() as UserRole] || user.role) : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.isActive ? (
                                                <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">Ativo</span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-800">Inativo</span>
                                            )}
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
                    )}
                    {!loading && users.length === 0 && (
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