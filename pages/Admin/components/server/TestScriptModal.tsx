import React, { useState } from 'react';
import { testScript } from '../../../../services/apiService';
import { ScriptDto, TestScriptCommand } from '../../../../types';

interface TestScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  script: ScriptDto;
}

const TestScriptModal: React.FC<TestScriptModalProps> = ({ isOpen, onClose, script }) => {
    const [contextJson, setContextJson] = useState('{}');
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    if (!isOpen) return null;

    const handleRunTest = async () => {
        setIsRunning(true);
        setResult(null);
        setError(null);

        let context;
        try {
            context = JSON.parse(contextJson);
        } catch (e) {
            setError('Contexto JSON inválido.');
            setIsRunning(false);
            return;
        }

        const command: TestScriptCommand = {
            scriptContent: script.content,
            context: { context }, // A API espera que o contexto esteja aninhado
        };

        try {
            const response = await testScript(command);
            setResult(JSON.stringify(response, null, 2));
        } catch (err: any) {
            setError(err.message || 'Falha ao executar o teste.');
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-light-card w-full max-w-2xl rounded-xl shadow-xl p-6 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-dark-text mb-4">Testar Script: {script.name}</h2>
                <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                    <div>
                        <label htmlFor="context" className="block text-sm font-medium text-dark-text mb-1">Contexto de Execução (JSON)</label>
                        <textarea
                            id="context"
                            rows={8}
                            value={contextJson}
                            onChange={(e) => setContextJson(e.target.value)}
                            className="w-full p-2 font-mono text-sm bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                            placeholder='{ "key": "value" }'
                        ></textarea>
                    </div>
                    {result && (
                        <div>
                            <h3 className="text-md font-semibold text-dark-text mb-1">Resultado</h3>
                            <pre className="bg-gray-100 p-3 rounded-lg text-sm text-green-700 overflow-auto">{result}</pre>
                        </div>
                    )}
                    {error && (
                        <div>
                            <h3 className="text-md font-semibold text-dark-text mb-1">Erro</h3>
                            <pre className="bg-red-50 p-3 rounded-lg text-sm text-red-700 overflow-auto">{error}</pre>
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-dark-text font-semibold rounded-lg hover:bg-gray-300">
                        Fechar
                    </button>
                    <button type="button" onClick={handleRunTest} disabled={isRunning} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                        {isRunning ? 'Executando...' : 'Executar Teste'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestScriptModal;
