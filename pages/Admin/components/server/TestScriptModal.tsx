import React, { useState } from 'react';
import { testScript } from '../../../../services/apiService';
import { TestScriptResultDto } from '../../../../types';

type Language = 'javascript' | 'python' | 'lua';

const langStringToEnum: Record<Language, number> = {
    javascript: 1,
    python: 2,
    lua: 3,
};

interface TestScriptModalProps {
    isOpen: boolean;
    onClose: () => void;
    scriptContent: string;
    scriptLanguage: Language;
}

const TestScriptModal: React.FC<TestScriptModalProps> = ({ isOpen, onClose, scriptContent, scriptLanguage }) => {
    const [contextJson, setContextJson] = useState('{\n    "context": {}\n}');
    const [result, setResult] = useState<TestScriptResultDto | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRunTest = async () => {
        let context;
        try {
            context = JSON.parse(contextJson);
        } catch (e) {
            setError('O JSON do contexto é inválido.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await testScript({
                scriptContent,
                context,
                language: langStringToEnum[scriptLanguage]
            });
            setResult(res);
        } catch (err: any) {
            setError(err.message || 'Falha ao executar o teste. O endpoint pode não estar implementado.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setResult(null);
        setError(null);
        setIsLoading(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleClose}>
            <div className="bg-light-card w-full max-w-3xl rounded-xl shadow-xl p-6 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="text-xl font-bold text-dark-text">Testar Script</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-3xl font-light">&times;</button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow min-h-0">
                    {/* Input Context */}
                    <div className="flex flex-col">
                        <label htmlFor="contextJson" className="block text-sm font-medium text-dark-text mb-2">
                            Contexto de Entrada (JSON)
                        </label>
                        <textarea
                            id="contextJson"
                            value={contextJson}
                            onChange={e => setContextJson(e.target.value)}
                            className="w-full flex-grow p-4 rounded-lg resize-none code-editor focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                            placeholder='Ex: { "context": { "Sku": "TEST-001" } }'
                        />
                    </div>
                    {/* Output Results */}
                    <div className="flex flex-col bg-gray-50 p-4 rounded-lg border">
                        <h3 className="text-sm font-medium text-dark-text mb-2 flex-shrink-0">Resultado da Execução</h3>
                        <div className="flex-grow overflow-y-auto bg-white p-3 rounded-md">
                            {isLoading && <p className="text-light-text">Executando...</p>}
                            {error && <div className="text-red-600 text-sm"><strong>Erro:</strong> {error}</div>}
                            {result && (
                                <div className="space-y-4 text-xs font-mono">
                                    <div>
                                        <p className="font-bold text-dark-text">Tempo de Execução:</p>
                                        <p className="text-light-text">{result.executionTimeMs ?? 'N/A'} ms</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-dark-text">Logs:</p>
                                        <div className="bg-gray-800 text-gray-200 p-2 rounded max-h-24 overflow-y-auto">
                                            {result.logs && result.logs.length > 0
                                                ? result.logs.map((log, i) => <div key={i}>{log}</div>)
                                                : <span className="text-gray-400 italic">Nenhum log gerado.</span>
                                            }
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-bold text-dark-text">Retorno:</p>
                                        <pre className="bg-gray-100 p-2 rounded max-h-32 overflow-y-auto text-dark-text whitespace-pre-wrap">{result.returnValue || 'Nenhum valor retornado.'}</pre>
                                    </div>
                                    {result.error && (
                                        <div>
                                            <p className="font-bold text-red-700">Erro no Script:</p>
                                            <pre className="bg-red-50 text-red-700 p-2 rounded whitespace-pre-wrap">{result.error}</pre>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200 flex-shrink-0">
                    <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-200 text-dark-text font-semibold rounded-lg hover:bg-gray-300">
                        Fechar
                    </button>
                    <button type="button" onClick={handleRunTest} disabled={isLoading} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:bg-gray-400">
                        {isLoading ? 'Executando...' : 'Executar Teste'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestScriptModal;