/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React from 'react';
import { LossRecord } from '../../../types';

interface LossDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lossRecord: LossRecord | null;
}

const LossDetailsModal: React.FC<LossDetailsModalProps> = ({ isOpen, onClose, lossRecord }) => {
  if (!isOpen || !lossRecord) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-light-card w-full max-w-lg rounded-xl shadow-xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 pb-4 border-b">
            <h2 className="text-xl font-bold text-dark-text">Detalhes da Perda</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-light">&times;</button>
        </div>
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <p className="font-semibold text-light-text">Item</p>
              <p className="text-dark-text">{lossRecord.itemName}</p>
            </div>
            <div>
              <p className="font-semibold text-light-text">Código</p>
              <p className="text-dark-text font-mono">{lossRecord.itemCode}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="font-semibold text-light-text">Quantidade</p>
              <p className="text-dark-text">{lossRecord.quantity}</p>
            </div>
            <div>
              <p className="font-semibold text-light-text">Data</p>
              <p className="text-dark-text">{lossRecord.date}</p>
            </div>
             <div>
              <p className="font-semibold text-light-text">Registrado por</p>
              <p className="text-dark-text capitalize">{lossRecord.recordedBy}</p>
            </div>
          </div>
          <div>
              <p className="font-semibold text-light-text">Relatório</p>
              <p className="text-dark-text bg-gray-50 p-3 rounded-lg border mt-1 whitespace-pre-wrap">{lossRecord.report}</p>
          </div>
        </div>
        <div className="flex justify-end mt-6 pt-4 border-t">
          <button onClick={onClose} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LossDetailsModal;
