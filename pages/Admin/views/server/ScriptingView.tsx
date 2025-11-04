import React, { useState, useEffect, useCallback } from 'react';
import { FileTextIcon, PlusIcon, TrashIcon } from '../../../../components/shared/IconComponents';
import ScriptingGuide from '../../components/server/ScriptingGuide';
import { ScriptDto, HookDto, ScriptLanguage as ScriptLanguageType, CreateScriptCommand, UpdateScriptCommand } from '../../../../types';
import { getScripts, getHooks, createScript, createHook, updateScript, deleteHook, deleteScript } from '../../../../services/apiService';

type Language = 'javascript' | 'python' | 'lua';

interface Script extends ScriptDto {
    hook: string;
    hookId?: string;
}

const langStringToEnum: Record<Language, number> = {
    javascript: 1,
    python: 2,
    lua: 3,
};

const langEnumToString: Record<number, Language> = {
    1: 'javascript',
    2: 'python',
    3: 'lua',
};

const ScriptingView: React.FC = () => {
    const [scripts, setScripts] = useState<Script[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeScriptId, setActiveScriptId] = useState<string | null>(null);
    const [editorState, setEditorState] = useState<Script | null>(null);
    const [isGuideVisible, setIsGuideVisible] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [scriptsData, hooksData] = await Promise.all([getScripts(), getHooks()]);
            const hooksMap = new Map(hooksData.map(h => [h.scriptId, { hookName: h.hookName, id: h.id }]));

            const combinedScripts: Script[] = scriptsData.map(s => ({
                ...s,
                language: langEnumToString[s.language as any] || 'javascript', // Assuming language is number from API
                hook: hooksMap.get(s.id)?.hookName || 'N/A',
                hookId: hooksMap.get(s.id)?.id,
            }));
            
            setScripts(combinedScripts);
            if (combinedScripts.length > 0 && !activeScriptId) {
                setActiveScriptId(combinedScripts[0].id);
            } else if (combinedScripts.length === 0) {
                setActiveScriptId(null);
            }
        } catch (error) {
            console.error("Failed to fetch scripts or hooks", error);
            alert("Falha ao carregar dados de script.");
        } finally {
            setLoading(false);
        }
    }, [activeScriptId]);

    useEffect(() => {
        fetchData();
    }, []); // Fetch on mount

    useEffect(() => {
        const script = scripts.find(s => s.id === activeScriptId);
        setEditorState(script ? { ...script } : null);
    }, [activeScriptId, scripts]);

    const handleSaveScript = async () => {
        if (!editorState) return;

        try {
            const originalScript = scripts.find(s => s.id === editorState.id);
            const isNew = !originalScript;

            if (isNew) {
                const createCmd: CreateScriptCommand = {
                    name: editorState.name,
                    content: editorState.content,
                    language: langStringToEnum[editorState.language as Language],
                };
                const newScriptId = await createScript(createCmd);
                await createHook({ scriptId: newScriptId, hookName: editorState.hook });
            } else {
                const updateCmd: UpdateScriptCommand = {
                    id: editorState.id,
                    name: editorState.name,
                    content: editorState.content,
                    language: langStringToEnum[editorState.language as Language],
                };
                await updateScript(updateCmd);
                if (originalScript.hook !== editorState.hook && originalScript.hookId) {
                    await deleteHook(originalScript.hookId);
                    await createHook({ scriptId: editorState.id, hookName: editorState.hook });
                }
            }
            alert('Script salvo com sucesso!');
            await fetchData();
        } catch (error: any) {
            alert(`Falha ao salvar script: ${error.message}`);
        }
    };

    const handleNewScript = () => {
        const newId = `new-script-${Date.now()}`;
        const newScript: Script = {
            id: newId,
            name: 'Novo Script',
            language: 'javascript',
            hook: 'before:CreateItem',
            content: `function handle(context) {\n    // Escreva seu código aqui\n    return context;\n}`
        };
        setScripts(prev => [newScript, ...prev]);
        setActiveScriptId(newId);
    };

    const handleDeleteScript = async () => {
        if (!activeScriptId || !editorState) return;
        if (!window.confirm(`Tem certeza que deseja excluir o script "${editorState.name}"?`)) return;
        
        try {
            if (editorState.hookId) {
                await deleteHook(editorState.hookId);
            }
            // Only try to delete from server if it's not a new unsaved script
            if (!editorState.id.startsWith('new-script-')) {
                await deleteScript(activeScriptId);
            }
            
            setActiveScriptId(null);
            await fetchData();

        } catch (error: any) {
             alert(`Falha ao excluir script: ${error.message}`);
        }
    };

    const handleEditorChange = (field: keyof Omit<Script, 'id'>, value: string) => {
        if (!editorState) return;
        setEditorState(prev => prev ? { ...prev, [field]: value } as Script : null);
    };

    if (isGuideVisible) {
        return <ScriptingGuide onBack={() => setIsGuideVisible(false)} />;
    }

    if (loading) {
        return <div>Carregando scripts...</div>
    }

    return (
        <div className="h-full flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/3 xl:w-1/4 flex flex-col bg-light-card p-4 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-dark-text">Scripts Salvos</h3>
                    <button onClick={handleNewScript} className="p-2 rounded-md hover:bg-gray-200" title="Criar novo script">
                        <PlusIcon className="w-5 h-5 text-primary" />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto space-y-2 pr-2 -mr-2">
                    {scripts.map(script => (
                        <button key={script.id} onClick={() => setActiveScriptId(script.id)} className={`w-full text-left p-3 rounded-lg transition-colors ${activeScriptId === script.id ? 'bg-primary/10' : 'hover:bg-gray-100'}`}>
                            <p className={`font-semibold text-sm truncate ${activeScriptId === script.id ? 'text-primary' : 'text-dark-text'}`}>{script.name}</p>
                            <p className="text-xs text-light-text">{script.hook} • {script.language}</p>
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-1 flex flex-col bg-light-card rounded-xl border border-gray-200">
                {editorState ? (
                    <>
                        <div className="flex justify-between items-start p-4 border-b border-gray-200 gap-4">
                            <div className="flex-grow space-y-2">
                                 <div>
                                    <label htmlFor="scriptName" className="text-xs font-semibold text-light-text">NOME DO SCRIPT</label>
                                    <input id="scriptName" type="text" value={editorState.name} onChange={(e) => handleEditorChange('name', e.target.value)} className="w-full text-lg font-bold text-dark-text bg-transparent focus:outline-none border-b border-transparent focus:border-primary transition-colors"/>
                                </div>
                                <div className="flex items-center gap-6 text-sm">
                                    <div>
                                        <label htmlFor="language-select" className="text-xs font-semibold text-light-text block">LINGUAGEM</label>
                                        <select id="language-select" value={editorState.language} onChange={(e) => handleEditorChange('language', e.target.value)} className="font-semibold bg-gray-50 border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary text-dark-text">
                                            <option value="javascript">JavaScript</option>
                                            <option value="python">Python</option>
                                            <option value="lua">Lua</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="hook-select" className="text-xs font-semibold text-light-text block">HOOK</label>
                                        <select id="hook-select" value={editorState.hook} onChange={(e) => handleEditorChange('hook', e.target.value)} className="font-semibold bg-gray-50 border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary text-dark-text">
                                            <option value="before:CreateItem">before:CreateItem</option>
                                            <option value="after:CreateItem">after:CreateItem</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 flex-shrink-0">
                                <button onClick={() => setIsGuideVisible(true)} className="px-3 py-1.5 text-xs font-semibold bg-gray-100 text-dark-text rounded-md hover:bg-gray-200">
                                    Documentação
                                </button>
                                <button onClick={handleDeleteScript} className="p-2 rounded-md hover:bg-red-100 text-red-500" title="Excluir script">
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-grow p-4">
                            <textarea value={editorState.content} onChange={e => handleEditorChange('content', e.target.value)} className="w-full h-full p-4 rounded-lg resize-none code-editor focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="// Escreva seu código aqui..."/>
                        </div>
                        <div className="p-4 border-t border-gray-200 flex justify-end">
                            <button onClick={handleSaveScript} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90">
                                Salvar Alterações
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-light-text text-center">
                        <FileTextIcon className="w-12 h-12 text-gray-300 mb-4"/>
                        <h3 className="font-semibold text-dark-text">Nenhum script selecionado</h3>
                        <p className="text-sm">Selecione um script para editar ou crie um novo.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScriptingView;
