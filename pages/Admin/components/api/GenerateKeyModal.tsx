import React, { useState } from 'react';
import { ClipboardDocumentIcon } from '../../../../components/shared/IconComponents';

interface GenerateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GenerateKeyModal: React.FC<GenerateKeyModalProps> = ({ isOpen, onClose }) => {
    const [newKey, setNewKey] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const handleGenerate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Simulate key generation
        const generated = `sk_${[...Array(32)].map(() => Math.random().toString(36)[2]).join('')}`;
        setNewKey(generated);
    };

    const handleCopy = () => {
        if (newKey) {
            navigator.clipboard.writeText(newKey);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };
    
    const handleClose = () => {
        setNewKey(null);
        setIsCopied(false);
        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleClose}>
            <div className="bg-light-card w-full max-w-lg rounded-xl shadow-xl p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-dark-text mb-4">
                    {newKey ? 'Chave de API Gerada' : 'Gerar Nova Chave de API'}
                </h2>
                
                {!newKey ? (
                     <form onSubmit={handleGenerate} className="space-y-4">
                         <p className="text-sm text-light-text">Chaves de API dão acesso aos recursos do sistema. Trate-as como senhas.</p>
                         <div>
                             <label htmlFor="keyName" className="block text-sm font-medium text-dark-text mb-1">Nome da Chave (Descrição)</label>
                             <input type="text" id="keyName" name="keyName" required placeholder="Ex: Integração BI, App Mobile" className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                         </div>
                         <div>
                             <label htmlFor="keyPermissions" className="block text-sm font-medium text-dark-text mb-1">Permissões</label>
                             <select id="keyPermissions" name="keyPermissions" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white text-black">
                                 <option value="read-write">Leitura e Escrita</option>
                                 <option value="read-only">Somente Leitura</option>
                             </select>
                         </div>
                         <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-200 text-dark-text font-semibold rounded-lg hover:bg-gray-300">Cancelar</button>
                            <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90">Gerar Chave</button>
                         </div>
                     </form>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-sm">
                            <p><strong>Atenção:</strong> Copie sua chave de API agora. Você não poderá vê-la novamente por motivos de segurança.</p>
                        </div>
                        <div className="relative">
                            <input type="text" readOnly value={newKey} className="w-full font-mono text-sm bg-white text-black px-3 py-2 border border-gray-300 rounded-lg pr-10" />
                            <button onClick={handleCopy} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-primary">
                                <ClipboardDocumentIcon className="w-5 h-5" />
                            </button>
                        </div>
                        {isCopied && <p className="text-sm text-green-600 font-semibold text-center">Copiado para a área de transferência!</p>}
                         <div className="text-center pt-4">
                            <button type="button" onClick={handleClose} className="w-full px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90">Concluído</button>
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerateKeyModal;