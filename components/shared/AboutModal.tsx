/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/

import React from 'react';
import { ERPLogo, VystLogo } from './IconComponents';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-light-card w-full max-w-2xl rounded-2xl shadow-xl p-8 relative flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
                <ERPLogo className="w-10 h-10" />
                <h2 className="text-2xl font-bold text-dark-text">Sobre o Alma</h2>
            </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-light">&times;</button>
        </div>

        <div className="flex-grow overflow-y-auto pr-2 mt-6 text-dark-text space-y-4 text-sm">
            <p><strong className="font-semibold">Alma</strong> é um sistema ERP de alto nível projetado para gerenciamento educacional, desenvolvido pela <strong className="font-semibold">Vyst Ltda.</strong></p>
            <p>Este sistema utiliza como base o <strong className="font-semibold">Storia</strong>, um robusto back-end de ERP de código aberto, também desenvolvido e mantido pela Vyst Ltda. O Storia é distribuído sob a licença permissiva <strong className="font-semibold">Apache-2.0</strong>, que permite flexibilidade e inovação na criação de sistemas derivados.</p>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-bold mb-2 text-md">Créditos e Termos de Uso</h3>
                <p className="text-light-text">O front-end do Alma e o back-end do Storia são propriedades intelectuais da Vyst Ltda. É obrigatória a manutenção dos devidos créditos à API Storia. A Vyst Ltda. não se responsabiliza por eventuais erros de segurança, instabilidade ou perda de dados provenientes de forks (cópias modificadas) do código-fonte ou da não aplicação de atualizações de segurança recomendadas.</p>
            </div>

             <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-bold mb-2 text-md text-blue-800">Manutenção e Segurança</h3>
                <p className="text-blue-700">Recomenda-se fortemente que os administradores do sistema mantenham a aplicação sempre atualizada. O back-end Storia foi projetado para receber atualizações automáticas de segurança e performance. No entanto, modificações no código-fonte ou no ambiente de hospedagem podem interferir nesse processo. A verificação periódica de atualizações é crucial para garantir a segurança e a estabilidade do sistema.</p>
            </div>
            
            <div className="text-center pt-4 text-xs text-light-text">
                <p>Versão da API: <span className="font-mono bg-gray-100 p-1 rounded text-dark-text">Storia API v1.2.3 (Stable)</span></p>
            </div>
        </div>

        <div className="flex justify-center items-center mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
                <VystLogo className="w-5 h-5 text-gray-500" />
                <p className="text-xs text-gray-500 font-medium">
                    Copyright © 2025, Vyst Ltda.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;