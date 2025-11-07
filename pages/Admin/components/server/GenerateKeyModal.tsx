import React, { useState } from 'react';
import { ClipboardDocumentIcon } from '../../../../components/shared/IconComponents';
import { createApiKey } from '../../../../services/apiService';
import { CreateApiKeyRequestDto, ApiKeyCreatedDto } from '../../../../types';

interface GenerateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyAdded: () => void;
}

const GenerateKeyModal: React.FC<GenerateKeyModalProps> = ({ isOpen, onClose, onKeyAdded }) => {
    const [step, setStep] = useState<'form' | 'result'>('form');
    const [generatedKeyInfo, setGeneratedKeyInfo] = useState<{ fullKey: string } | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [keyName, setKeyName] = useState('');
    const [permissions, setPermissions] = useState<'read-write' | 'read-only'>('read-write');

    const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            const request: CreateApiKeyRequestDto = { name: keyName, permissions };
            const result = await createApiKey(request);
            setGeneratedKeyInfo({ fullKey: result.fullKey });
            setStep('result');
        } catch (err: any) {
            setError(err.message || 'Falha ao gerar a chave de API. Este endpoint pode não estar implementado.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopy = () => {
        if (generatedKeyInfo?.fullKey) {
            navigator.clipboard.writeText(generatedKeyInfo.fullKey);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };
    
    const handleModalClose = () => {
        if (step === 'result') {
            onKeyAdded(); // Trigger refresh on parent only if a key was generated
        }
        setStep('form');
        setGeneratedKeyInfo(null);
        setIsCopied(false);
        setKeyName('');
        setPermissions('read-write');
        setError(null);
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleModalClose}>
            <div className="bg-light-card w-full max-w-lg rounded-xl shadow-xl p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-dark-text mb-4">
                    {step === 'result' ? 'Chave de API Gerada' : 'Gerar Nova Chave de API'}
                </h2>
                
                {step === 'form' ? (
                     <form onSubmit={handleGenerate} className="space-y-4">
                         {error && <div className="bg-red-100 border border-red-300 text-red-700 p-2 rounded-md text-sm">{error}</div>}
                         <p className="text-sm text-light-text">Chaves de API dão acesso aos recursos do sistema. Trate-as como senhas.</p>
                         <div>
                             <label htmlFor="keyName" className="block text-sm font-medium text-dark-text mb-1">Nome da Chave (Descrição)</label>
                             <input type="text" id="keyName" value={keyName} onChange={e => setKeyName(e.target.value)} required placeholder="Ex: Integração BI, App Mobile" className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                         </div>
                         <div>
                             <label htmlFor="keyPermissions" className="block text-sm font-medium text-dark-text mb-1">Permissões</label>
                             <select id="keyPermissions" value={permissions} onChange={e => setPermissions(e.target.value as any)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white text-black">
                                 <option value="read-write">Leitura e Escrita</option>
                                 <option value="read-only">Somente Leitura</option>
                             </select>
                         </div>
                         <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={handleModalClose} className="px-4 py-2 bg-gray-200 text-dark-text font-semibold rounded-lg hover:bg-gray-300">Cancelar</button>
                            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:bg-gray-400">
                                {isSubmitting ? 'Gerando...' : 'Gerar Chave'}
                            </button>
                         </div>
                     </form>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-sm">
                            <p><strong>Atenção:</strong> Copie sua chave de API agora. Você não poderá vê-la novamente por motivos de segurança.</p>
                        </div>
                        <div className="relative">
                            <input type="text" readOnly value={generatedKeyInfo?.fullKey || ''} className="w-full font-mono text-sm bg-white text-black px-3 py-2 border border-gray-300 rounded-lg pr-10" />
                            <button onClick={handleCopy} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-primary">
                                <ClipboardDocumentIcon className="w-5 h-5" />
                            </button>
                        </div>
                        {isCopied && <p className="text-sm text-green-600 font-semibold text-center">Copiado para a área de transferência!</p>}
                         <div className="text-center pt-4">
                            <button type="button" onClick={handleModalClose} className="w-full px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90">Concluído</button>
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerateKeyModal;