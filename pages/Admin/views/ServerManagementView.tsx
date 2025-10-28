import React, { useState, useEffect } from 'react';
// FIX: Replace BellAlertIcon with ExclamationTriangleIcon and import ServerStackIcon and CheckCircleIcon
import { Cog6ToothIcon, CodeBracketIcon, ExclamationTriangleIcon, ServerStackIcon, ArrowPathIcon, CheckCircleIcon } from '../../../components/shared/IconComponents';
import StatusView from './server/StatusView';
import ScriptingView from './server/ScriptingView';
import IntegrationsView from './server/IntegrationsView';

type SubView = 'status' | 'scripting' | 'integrations';

interface UpdateInfo {
    status: 'checking' | 'updated' | 'available';
    currentVersion: string;
    latestVersion?: string;
}

const ServerManagementView: React.FC = () => {
    const [activeView, setActiveView] = useState<SubView>('status');
    const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({ status: 'checking', currentVersion: '1.2.3' });

    const checkVersion = () => {
        setUpdateInfo(prev => ({ ...prev, status: 'checking' }));
        setTimeout(() => {
            const isUpdateAvailable = Math.random() > 0.5;
            if (isUpdateAvailable) {
                setUpdateInfo({ status: 'available', currentVersion: '1.2.3', latestVersion: '1.3.0' });
            } else {
                setUpdateInfo({ status: 'updated', currentVersion: '1.2.3' });
            }
        }, 1500); // Simulate network delay
    };

    useEffect(() => {
        checkVersion();
    }, []);

    const NavButton: React.FC<{ viewName: SubView, label: string, icon: React.ElementType }> = ({ viewName, label, icon: Icon }) => {
        const isActive = activeView === viewName;
        const baseClasses = "flex items-center w-full px-4 py-3 text-sm font-semibold rounded-lg transition-colors duration-200";
        const activeClasses = "bg-primary/10 text-primary";
        const inactiveClasses = "text-dark-text hover:bg-gray-100";
        return (
            <button onClick={() => setActiveView(viewName)} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
                <Icon className="w-5 h-5 mr-3" />
                <span>{label}</span>
            </button>
        );
    };

    const renderUpdateBanner = () => {
        switch (updateInfo.status) {
            case 'checking':
                return (
                    <div className="flex items-center gap-2 text-sm text-light-text">
                        <ArrowPathIcon className="w-5 h-5 animate-spin" /> Verificando atualizações...
                    </div>
                );
            case 'updated':
                return (
                    <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                        <CheckCircleIcon className="w-5 h-5" /> Seu sistema está atualizado.
                    </div>
                );
            case 'available':
                return (
                    <div className="flex items-center justify-between w-full p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                         <div className="flex items-center gap-3">
                            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-700" />
                            <div>
                                <p className="font-bold text-yellow-800">Nova atualização disponível!</p>
                                <p className="text-xs text-yellow-700">Atualize da versão {updateInfo.currentVersion} para {updateInfo.latestVersion}.</p>
                            </div>
                        </div>
                        <button className="px-4 py-1.5 text-xs font-bold bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
                            Atualizar Agora
                        </button>
                    </div>
                );
            default: return null;
        }
    }

    const renderContent = () => {
        switch (activeView) {
            case 'scripting':
                return <ScriptingView />;
            case 'integrations':
                return <IntegrationsView />;
            case 'status':
            default:
                return <StatusView updateInfo={updateInfo} onCheckVersion={checkVersion} />;
        }
    };

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-dark-text">Gerenciar Servidor (Storia API)</h2>
                    <p className="text-light-text mt-1">Monitore, configure e estenda a funcionalidade do seu backend.</p>
                </div>
            </div>
             <div className="flex items-center justify-end">
                {renderUpdateBanner()}
            </div>
            <div className="flex flex-col lg:flex-row gap-8 flex-grow min-h-0">
                <aside className="w-full lg:w-1/4 xl:w-1/5">
                    <nav className="space-y-2">
                        <NavButton viewName="status" label="Status e Saúde" icon={ServerStackIcon} />
                        <NavButton viewName="scripting" label="Scripting" icon={CodeBracketIcon} />
                        <NavButton viewName="integrations" label="Integrações" icon={Cog6ToothIcon} />
                    </nav>
                </aside>
                <main className="flex-1 min-w-0">
                   {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default ServerManagementView;