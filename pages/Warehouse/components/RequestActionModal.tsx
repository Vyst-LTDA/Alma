/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState } from 'react';

interface RequestActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const RequestActionModal: React.FC<RequestActionModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason('');
    } else {
      alert("Por favor, forneça um motivo para a recusa.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-light-card w-full max-w-md rounded-xl shadow-xl p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-dark-text mb-4">Recusar Requisição</h2>
        <p className="text-sm text-light-text mb-4">
            Por favor, informe o motivo da recusa. Esta informação será visível para o solicitante.
        </p>
        <div>
          <label htmlFor="rejectionReason" className="block text-sm font-medium text-dark-text mb-1">
            Motivo
          </label>
          <textarea
            id="rejectionReason"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            placeholder="Ex: Item fora de estoque, requisição inválida..."
          ></textarea>
        </div>
        <div className="flex justify-end gap-3 pt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-dark-text font-semibold rounded-lg hover:bg-gray-300">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
          >
            Confirmar Recusa
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestActionModal;