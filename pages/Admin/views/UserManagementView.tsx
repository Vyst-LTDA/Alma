import React, { useState, useMemo, useEffect, useRef } from 'react';
import { UserDto, UserRole } from '../../../types';
import { getUsers, deleteUser } from '../../../services/apiService';
import { SearchIcon, DotsVerticalIcon, UserCircleIcon, PencilIcon, TrashIcon, ArrowUturnLeftIcon, UserPlusIcon, UsersIcon } from '../../../components/shared/IconComponents';
import EditUserModal from '../components/users/EditUserModal';
import CreateUserView from './CreateUserView';

const ActionMenu: React.FC<{ user: UserDto, onEdit: (user: UserDto) => void, onDelete: (user: UserDto) => void }> = ({ user, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-gray-200">
                <DotsVerticalIcon className="w-5 h-5 text-gray-500" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <ul className="py-1">
                        <li>
                            <button onClick={() => { onEdit(user); setIsOpen(false); }} className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-dark-text hover:bg-gray-100">
                                <PencilIcon className="w-4 h-4" />
                                Editar
                            </button>
                        </li>
                        <li>
                            <button onClick={() => { onDelete(user); setIsOpen(false); }} className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                <TrashIcon className="w-4 h-4" />
                                Excluir
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

interface UserManagementViewProps {
    manageableRoles: UserRole[];
    onUserCreated?: (notification: any) => void;
}

const UserManagementView: React.FC<UserManagementViewProps> = ({ manageableRoles, onUserCreated = () => {} }) => {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
    const [refreshKey, setRefreshKey] = useState(0);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<UserDto | null>(null);

    const [subView, setSubView] = useState<'main' | 'list' | 'create'>('main');

    const roleNames: { [key: string]: string } = {
        professor: 'Docente',
        warehouse: 'Almoxarifado',
        admin: 'Administrador',
    };

    useEffect(() => {
        if (subView !== 'list') return;

        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getUsers({
                    pageNumber: 1,
                    pageSize: 100,
                    searchTerm: searchTerm
                });
                
                let fetchedUsers = result.items;
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
    }, [searchTerm, roleFilter, manageableRoles, refreshKey, subView]);

    const handleEdit = (user: UserDto) => {
        setUserToEdit(user);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (user: UserDto) => {
        if (window.confirm(`Tem certeza que deseja excluir o usuário "${user.fullName}"? Esta ação não pode ser desfeita.`)) {
            try {
                await deleteUser(user.id);
                setUsers(prev => prev.filter(u => u.id !== user.id));
                alert("Usuário excluído com sucesso.");
            } catch (err: any) {
                setError(err.message || "Falha ao excluir usuário.");
            }
        }
    };
    
    const handleSave = () => {
        setIsEditModalOpen(false);
        setUserToEdit(null);
        setRefreshKey(prev => prev + 1); // Trigger a re-fetch
    };

    const roleFilterOptions = manageableRoles.map(role => ({
        value: role,
        label: roleNames[role] || role,
    }));

    if (subView === 'create') {
        return <CreateUserView onBack={() => setSubView('main')} onUserCreated={onUserCreated} creatableRoles={manageableRoles} />;
    }

    if (subView === 'list') {
        return (
            <div className="h-full flex flex-col">
                 <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setSubView('main')} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <ArrowUturnLeftIcon className="w-6 h-6 text-dark-text" />
                    </button>
                    <h2 className="text-2xl font-bold text-dark-text">Lista de Usuários</h2>
                </div>
                
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
                                                    <ActionMenu user={user} onEdit={handleEdit} onDelete={handleDelete} />
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
                {isEditModalOpen && userToEdit && (
                    <EditUserModal 
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        user={userToEdit}
                        onSave={handleSave}
                        manageableRoles={manageableRoles}
                    />
                )}
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-2xl font-bold text-dark-text mb-6">Gerenciamento de Usuários e Permissões</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => setSubView('list')} className="group bg-light-card p-6 rounded-xl border border-gray-200 hover:border-primary hover:shadow-lg transition-all text-left">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 group-hover:bg-primary transition-colors">
                        <UsersIcon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-dark-text">Gerenciar Contas de Usuário</h3>
                    <p className="text-sm text-light-text mt-1">Edite perfis, altere permissões e gerencie o status das contas existentes no sistema.</p>
                </button>
                <button onClick={() => setSubView('create')} className="group bg-light-card p-6 rounded-xl border border-gray-200 hover:border-primary hover:shadow-lg transition-all text-left">
                     <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 group-hover:bg-primary transition-colors">
                        <UserPlusIcon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-dark-text">Criar Nova Conta de Usuário</h3>
                    <p className="text-sm text-light-text mt-1">Adicione novos usuários à plataforma, defina seus perfis de acesso e envie convites por e-mail.</p>
                </button>
            </div>
        </div>
    );
};

export default UserManagementView;