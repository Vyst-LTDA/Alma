/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState, useMemo } from 'react';
import { SearchIcon, CheckCircleIcon } from '../../../components/shared/IconComponents';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const inventoryItems = [
    { id: 1, name: 'Item A', img: 'https://picsum.photos/seed/markers/200' },
    { id: 2, name: 'Item B', img: 'https://picsum.photos/seed/projector/200' },
    { id: 3, name: 'Item C', img: 'https://picsum.photos/seed/epi/200' },
    { id: 4, name: 'Item D', img: 'https://picsum.photos/seed/book/200' },
    { id: 5, name: 'Item E', img: 'https://picsum.photos/seed/flour/200' },
    { id: 6, name: 'Item F', img: 'https://picsum.photos/seed/laptop/200' }
];

const Stepper: React.FC<{currentStep: number, steps: string[]}> = ({ currentStep, steps }) => (
    <div className="flex items-center justify-between mb-8 px-4">
        {steps.map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;
            return (
                 <React.Fragment key={stepNumber}>
                    <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-primary text-white scale-110' : 'bg-gray-200 text-light-text'}`}>
                            {isCompleted ? '✓' : stepNumber}
                        </div>
                        <span className={`mt-2 text-xs font-semibold text-center ${isActive ? 'text-primary' : 'text-light-text'}`}>{label}</span>
                    </div>
                    {stepNumber < steps.length && <div className={`flex-1 h-1 mx-2 ${isCompleted || isActive ? 'bg-primary/50' : 'bg-gray-200'}`}></div>}
                 </React.Fragment>
            )
        })}
    </div>
)


const RequestModal: React.FC<RequestModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
      itemId: null as number | null,
      quantity: 1,
      deliveryMethod: 'Retirar no Almoxarifado',
      location: ''
  });
  const [itemSearch, setItemSearch] = useState('');

  const filteredItems = useMemo(() => {
      return inventoryItems.filter(item => item.name.toLowerCase().includes(itemSearch.toLowerCase()));
  }, [itemSearch]);

  const resetState = () => {
    setStep(1);
    setIsSuccess(false);
    setFormData({
      itemId: null,
      quantity: 1,
      deliveryMethod: 'Retirar no Almoxarifado',
      location: ''
    });
    setItemSearch('');
  }

  if (!isOpen) return null;
  
  const handleClose = () => {
    resetState();
    onClose();
  }
  
  const handleSubmit = () => {
      setIsSuccess(true);
      // In a real app, you'd send formData to the backend here.
  }

  const selectedItem = inventoryItems.find(item => item.id === formData.itemId);

  const renderContent = () => {
      if (isSuccess) {
          return (
              <div className="text-center py-10">
                  <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-dark-text">Requisição Enviada!</h3>
                  <p className="text-light-text mt-2">Sua requisição foi enviada com sucesso e está aguardando aprovação.</p>
              </div>
          )
      }

      switch (step) {
        case 1: // Seleção de Item
            return (
            <div>
                <div className="relative mb-6">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Pesquisar item..." value={itemSearch} onChange={(e) => setItemSearch(e.target.value)} className="w-full pl-10 pr-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredItems.map(item => (
                    <button key={item.id} onClick={() => setFormData(f => ({ ...f, itemId: item.id }))} className={`relative p-4 border rounded-lg text-center transition-all ${formData.itemId === item.id ? 'border-primary ring-2 ring-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`}>
                    {formData.itemId === item.id && <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full text-white flex items-center justify-center text-xs">✓</div>}
                    <img src={item.img} alt={item.name} className="w-24 h-24 object-cover mx-auto rounded-md mb-2" />
                    <span className="text-sm font-semibold text-dark-text">{item.name}</span>
                    </button>
                ))}
                </div>
            </div>
            );
        case 2: // Detalhes da Requisição
            return (
            <div className="space-y-6 max-w-md mx-auto">
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-light-text mb-1">Quantidade</label>
                    <input type="number" id="quantity" value={formData.quantity} onChange={e => setFormData(f => ({...f, quantity: parseInt(e.target.value, 10) || 1}))} min="1" className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                </div>
            </div>
            );
        case 3: // Entrega ou Retirada
            return (
            <div className="space-y-6 max-w-md mx-auto">
                <div>
                    <label className="block text-sm font-medium text-light-text mb-1">Método</label>
                    <div className="flex gap-4">
                        <label className={`flex-1 p-3 border rounded-lg cursor-pointer transition-colors ${formData.deliveryMethod === 'Retirar no Almoxarifado' ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'}`}><input type="radio" name="delivery" value="Retirar no Almoxarifado" checked={formData.deliveryMethod === 'Retirar no Almoxarifado'} onChange={e => setFormData(f => ({...f, deliveryMethod: e.target.value}))} className="mr-2" /> Retirar no Almoxarifado</label>
                        <label className={`flex-1 p-3 border rounded-lg cursor-pointer transition-colors ${formData.deliveryMethod === 'Solicitar Entrega' ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'}`}><input type="radio" name="delivery" value="Solicitar Entrega" checked={formData.deliveryMethod === 'Solicitar Entrega'} onChange={e => setFormData(f => ({...f, deliveryMethod: e.target.value}))} className="mr-2" /> Solicitar Entrega</label>
                    </div>
                </div>
                {formData.deliveryMethod === 'Solicitar Entrega' && (
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-light-text mb-1">Local de Entrega</label>
                    <input type="text" id="location" value={formData.location} onChange={e => setFormData(f => ({...f, location: e.target.value}))} placeholder="Ex: Sala A-201, Laboratório de Química" className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                </div>
                )}
            </div>
            );
        case 4: // Revisão
            return (
                 <div className="space-y-4 max-w-lg mx-auto p-4 bg-gray-50 rounded-lg border">
                    <h3 className="text-lg font-bold text-dark-text text-center mb-4">Revise sua Requisição</h3>
                    <div className="flex items-center gap-4">
                        <img src={selectedItem?.img} alt={selectedItem?.name} className="w-20 h-20 rounded-md object-cover" />
                        <div>
                            <p className="font-bold text-dark-text">{selectedItem?.name}</p>
                            <p className="text-sm text-light-text">Quantidade: {formData.quantity}</p>
                        </div>
                    </div>
                    <div className="border-t my-2"></div>
                    <p><strong className="text-light-text">Entrega:</strong> {formData.deliveryMethod}</p>
                    {formData.deliveryMethod === 'Solicitar Entrega' && <p><strong className="text-light-text">Local:</strong> {formData.location || 'Não especificado'}</p>}
                </div>
            );
        default: return null;
      }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div className="bg-light-card w-full max-w-3xl rounded-2xl shadow-xl p-8 relative flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-dark-text">Nova Requisição</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
        </div>

        {!isSuccess && <Stepper currentStep={step} steps={['Item', 'Detalhes', 'Entrega', 'Revisão']} />}

        <div className="flex-grow overflow-y-auto pr-2 min-h-[300px]">
            {renderContent()}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            {isSuccess ? (
                 <button onClick={handleClose} className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90">Fechar</button>
            ) : (
                <>
                <button onClick={handleClose} className="text-sm font-semibold text-light-text hover:underline">Cancelar</button>
                <div className="flex gap-4">
                    {step > 1 && <button onClick={() => setStep(s => s - 1)} className="px-6 py-2 bg-gray-200 text-dark-text font-semibold rounded-lg hover:bg-gray-300">Voltar</button>}
                    {step < 4 && <button onClick={() => setStep(s => s + 1)} disabled={step === 1 && !formData.itemId} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed">Avançar</button>}
                    {step === 4 && <button onClick={handleSubmit} className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">Finalizar Requisição</button>}
                </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default RequestModal;