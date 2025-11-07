import React from 'react';
import { NavItemType, UserRole } from '../../types';
import { 
    DashboardIcon, 
    PackageIcon,
    TruckIcon,
    FileTextIcon,
    UsersIcon,
    ArchiveIcon,
    ERPLogo,
    VystLogo,
    InfoIcon,
    MailIcon,
    UserCircleIcon,
    ChartBarIcon,
    CodeBracketIcon,
    ExclamationTriangleIcon,
    Cog6ToothIcon,
    ArrowUturnLeftIcon,
    ClipboardDocumentIcon
} from '../shared/IconComponents';

const NavItem: React.FC<{ item: NavItemType, currentView: string, onNavigate: (view: string) => void }> = ({ item, currentView, onNavigate }) => {
    const { name, icon: Icon, view } = item;
    const isActive = view === currentView;
    const baseClasses = "flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200";
    const activeClasses = "bg-primary/10 text-primary";
    const inactiveClasses = "text-light-text hover:bg-gray-100";

    return (
        <li>
            <button onClick={() => onNavigate(view)} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
                <Icon className="w-5 h-5 mr-3" />
                <span>{name}</span>
            </button>
        </li>
    );
};

interface SidebarProps {
    userRole: UserRole;
    currentView: string;
    onNavigate: (view: string) => void;
    onOpenAboutModal: () => void;
    navItems?: NavItemType[];
    isEducationalMode?: boolean;
    onToggleEducationalMode?: () => void;
}

const professorNavItems: NavItemType[] = [
    { name: 'Painel de Controle', icon: DashboardIcon, view: 'dashboard' },
    { name: 'Análises', icon: ChartBarIcon, view: 'analytics' },
    { name: 'Comunicação', icon: MailIcon, view: 'communication' },
    { name: 'Requisições', icon: FileTextIcon, view: 'requests' },
    { name: 'Controle de Estoque', icon: ArchiveIcon, view: 'stock' },
    { name: 'Clientes', icon: TruckIcon, view: 'customers' },
    { name: 'Perdas', icon: ExclamationTriangleIcon, view: 'losses' },
];

const warehouseNavItems: NavItemType[] = [
    { name: 'Dashboard', icon: DashboardIcon, view: 'dashboard' },
    { name: 'Análises e BI', icon: ChartBarIcon, view: 'analytics' },
    { name: 'Comunicação', icon: MailIcon, view: 'communication' },
    { name: 'Requisições', icon: FileTextIcon, view: 'requests' },
    { name: 'Controle de Estoque', icon: ArchiveIcon, view: 'stock' },
    { name: 'Clientes', icon: TruckIcon, view: 'customers' },
    { name: 'Perdas', icon: ExclamationTriangleIcon, view: 'losses' },
];

const adminNavItems: NavItemType[] = [
    { name: 'Painel de Controle', icon: DashboardIcon, view: 'dashboard' },
    { name: 'Análises e BI', icon: ChartBarIcon, view: 'analytics' },
    { name: 'Comunicação', icon: MailIcon, view: 'communication' },
    { name: 'Requisições', icon: FileTextIcon, view: 'requests' },
    { name: 'Controle de Estoque', icon: ArchiveIcon, view: 'stock' },
    { name: 'Clientes', icon: TruckIcon, view: 'customers' },
    { name: 'Perdas', icon: ExclamationTriangleIcon, view: 'losses' },
    { name: 'Gerenciar Usuários', icon: UsersIcon, view: 'users' },
    { name: 'Criar Usuários', icon: UsersIcon, view: 'create-user' },
    { name: 'Logs de Auditoria', icon: ClipboardDocumentIcon, view: 'audit-log' },
    { name: 'Gerenciar Servidor', icon: Cog6ToothIcon, view: 'server-management' },
];

const Sidebar: React.FC<SidebarProps> = ({ userRole, currentView, onNavigate, onOpenAboutModal, navItems: customNavItems, isEducationalMode, onToggleEducationalMode }) => {
    let navItems: NavItemType[];

    if (customNavItems) {
        navItems = customNavItems;
    } else {
        switch (userRole) {
            case 'professor':
                navItems = professorNavItems;
                break;
            case 'warehouse':
                navItems = warehouseNavItems;
                break;
            case 'admin':
                navItems = adminNavItems;
                break;
            default:
                navItems = [];
        }
    }


    return (
        <aside className="w-72 bg-light-card border-r border-gray-200 flex-col flex-shrink-0 hidden lg:flex">
            <div className="h-20 flex items-center justify-between px-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <ERPLogo className="w-10 h-10" />
                    <h1 className="text-xl font-bold text-dark-text">Alma</h1>
                </div>

                {userRole === 'admin' && onToggleEducationalMode && (
                    isEducationalMode ? (
                        <button onClick={onToggleEducationalMode} title="Voltar ao Painel Principal" className="flex items-center gap-2 text-sm font-semibold bg-gray-200 text-dark-text px-3 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                            <ArrowUturnLeftIcon className="w-4 h-4" />
                            <span>Principal</span>
                        </button>
                    ) : (
                        <button onClick={onToggleEducationalMode} title="Acessar Almoxarifado Educacional" className="flex items-center gap-2 text-sm font-semibold bg-primary/10 text-primary px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors">
                            <PackageIcon className="w-4 h-4" />
                            <span>Educacional</span>
                        </button>
                    )
                )}
            </div>
            <nav className="flex-1 px-4 py-6">
                <ul className="space-y-2">
                    {navItems.map(item => <NavItem key={item.name} item={item} currentView={currentView} onNavigate={onNavigate} />)}
                </ul>
            </nav>
            <div className="px-4 py-4 border-t border-gray-200">
                <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="flex items-center space-x-2">
                        <VystLogo className="w-5 h-5 text-gray-500" />
                        <p className="text-xs text-gray-500 font-medium">
                            Copyright 2025, Vyst Ltda.
                        </p>
                    </div>
                    <button
                        onClick={onOpenAboutModal}
                        className="text-xs text-gray-400 hover:text-primary hover:underline"
                    >
                        Sobre o Alma
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;