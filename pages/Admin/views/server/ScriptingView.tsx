import React, { useState, useEffect } from 'react';
import { FileTextIcon, PlusIcon, TrashIcon } from '../../../../components/shared/IconComponents';
import ScriptingGuide from '../../components/server/ScriptingGuide';

type Language = 'javascript' | 'python' | 'lua';

interface Script {
    id: string;
    name: string;
    language: Language;
    hook: string;
    content: string;
}

const mockScripts: Script[] = [
    { id: 'script-1', name: 'Prefix Sku', language: 'javascript', hook: 'before:CreateItem', content: "function handle(context) {\n    var command = context.context;\n    log.info('Executando script before:CreateItem para o item: ' + command.Sku);\n    if (command.Sku && !command.Sku.startsWith('SKU-')) {\n        log.info('Modificando SKU de \"' + command.Sku + '\" para \"SKU-' + command.Sku + '\"');\n        command.Sku = 'SKU-' + command.Sku;\n    }\n    return context;\n}" },
    { id: 'script-2', name: 'Log After Create', language: 'python', hook: 'after:CreateItem', content: "def handle(context):\n    item = context['context']\n    log.info('Item ' + item.Name + ' (ID: ' + str(item.Id) + ') foi criado com sucesso com o SKU: ' + item.Sku)\n    return context" }
];

const ScriptingView: React.FC = () => {
    const [scripts, setScripts] = useState<Script[]>(mockScripts);
    const [activeScriptId, setActiveScriptId] = useState<string | null>(scripts.length > 0 ? scripts[0].id : null);
    const [editorState, setEditorState] = useState<Script | null>(null);
    const [isGuideVisible, setIsGuideVisible] = useState(false);

    useEffect(() => {
        const script = scripts.find(s => s.id === activeScriptId);
        setEditorState(script ? { ...script } : null);
    }, [activeScriptId, scripts]);

    const handleSaveScript = () => {
        if (!editorState) return;
        setScripts(prev => prev.map(s => s.id === editorState.id ? editorState : s));
        alert('Script salvo com sucesso! (Simulação)');
    };

    const handleNewScript = () => {
        const newId = `script-${Date.now()}`;
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

    const handleDeleteScript = () => {
        if (!activeScriptId || !editorState) return;
        if (!window.confirm(`Tem certeza que deseja excluir o script "${editorState.name}"?`)) return;

        const currentIndex = scripts.findIndex(s => s.id === activeScriptId);
        const newScripts = scripts.filter(s => s.id !== activeScriptId);
        setScripts(newScripts);
        
        if (newScripts.length === 0) {
            setActiveScriptId(null);
        } else {
            const nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;
            setActiveScriptId(newScripts[nextIndex].id);
        }
    };

    const handleEditorChange = (field: keyof Omit<Script, 'id'>, value: string) => {
        if (!editorState) return;
        setEditorState(prev => prev ? { ...prev, [field]: value } as Script : null);
    };

    if (isGuideVisible) {
        return <ScriptingGuide onBack={() => setIsGuideVisible(false)} />;
    }

    return (
        <div className="h-full flex flex-col lg:flex-row gap-6">
            {/* Scripts List */}
            <div className="lg:w-1/3 xl:w-1/4 flex flex-col bg-light-card p-4 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-dark-text">Scripts Salvos</h3>
                    <button onClick={handleNewScript} className="p-2 rounded-md hover:bg-gray-200" title="Criar novo script">
                        <PlusIcon className="w-5 h-5 text-primary" />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto space-y-2 pr-2 -mr-2">
                    {scripts.map(script => (
                        <button
                            key={script.id}
                            onClick={() => setActiveScriptId(script.id)}
                            className={`w-full text-left p-3 rounded-lg transition-colors ${activeScriptId === script.id ? 'bg-primary/10' : 'hover:bg-gray-100'}`}
                        >
                            <p className={`font-semibold text-sm truncate ${activeScriptId === script.id ? 'text-primary' : 'text-dark-text'}`}>{script.name}</p>
                            <p className="text-xs text-light-text">{script.hook} • {script.language}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 flex flex-col bg-light-card rounded-xl border border-gray-200">
                {editorState ? (
                    <>
                        <div className="flex justify-between items-start p-4 border-b border-gray-200 gap-4">
                            <div className="flex-grow space-y-2">
                                 <div>
                                    <label htmlFor="scriptName" className="text-xs font-semibold text-light-text">NOME DO SCRIPT</label>
                                    <input
                                        id="scriptName"
                                        type="text"
                                        value={editorState.name}
                                        onChange={(e) => handleEditorChange('name', e.target.value)}
                                        className="w-full text-lg font-bold text-dark-text bg-transparent focus:outline-none border-b border-transparent focus:border-primary transition-colors"
                                    />
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
                            <textarea
                                value={editorState.content}
                                onChange={e => handleEditorChange('content', e.target.value)}
                                className="w-full h-full p-4 rounded-lg resize-none code-editor focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                placeholder="// Escreva seu código aqui..."
                            />
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