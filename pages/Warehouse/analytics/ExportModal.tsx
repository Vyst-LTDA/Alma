/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React from 'react';
import { CsvIcon, ExcelIcon } from '../../../components/shared/IconComponents';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    
    const handleClose = () => {
        onClose();
    }

    const handleExportCSV = () => {
        // A função de exportação será implementada no backend.
        handleClose();
    };
    
    const handleExportExcel = () => {
        // A função de exportação será implementada no backend.
        handleClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-opacity" onClick={handleClose}>
            <div className="bg-light-card w-full max-w-lg rounded-xl shadow-xl p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold text-dark-text">Exportar Dados</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-3xl font-light">&times;</button>
                </div>
                <p className="text-sm text-light-text mb-6">Selecione o formato desejado para exportar os dados brutos das requisições.</p>
                <div className="space-y-4">
                    <button onClick={handleExportCSV} className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary/50 transition-all text-left">
                        <CsvIcon className="w-8 h-8 mr-4 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-dark-text">Exportar para CSV</h3>
                            <p className="text-sm text-light-text">Formato universal, ideal para importação em diversas ferramentas.</p>
                        </div>
                    </button>
                     <button onClick={handleExportExcel} className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary/50 transition-all text-left">
                        <ExcelIcon className="w-8 h-8 mr-4 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-dark-text">Exportar para Excel (.xlsx)</h3>
                            <p className="text-sm text-light-text">Formato moderno, compatível com todas as versões recentes do Excel.</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;