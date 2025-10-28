
import React, { useState } from 'react';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const inventoryItems = [
    { id: 1, name: 'Canetões (Caixa com 12)', img: 'https://picsum.photos/seed/markers/200' },
    { id: 2, name: 'Projetor Multimídia', img: 'https://picsum.photos/seed/projector/200' },
    { id: 3, name: 'Kit de EPIs', img: 'https://picsum.photos/seed/epi/200' },
    { id: 4, name: 'Livro: Logística Reversa', img: 'https://picsum.photos/seed/book/200' },
    { id: 5, name: 'Farinha de Trigo (5kg)', img: 'https://picsum.photos/seed/flour/200' },
    { id: 6, name: 'Notebook Dell Vostro', img: 'https://picsum.photos/seed/laptop/200' }
];

const RequestModal: React.FC<RequestModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);
  
  const handleClose = () => {
    setStep(1);
    setSelectedItem(null);
    onClose();
  }
  
  const handleSubmit = () => {
      alert("Requisição enviada com sucesso! (Simulação)");
      handleClose();
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="text-xl font-bold text-dark-text mb-6">Passo 1: Selecione o item</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {inventoryItems.map(item => (
                <button key={item.id} onClick={() => setSelectedItem(item.id)} className={`p-4 border rounded-lg text-center transition-all ${selectedItem === item.id ? 'border-primary ring-2 ring-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`}>
                  <img src={item.img} alt={item.name} className="w-24 h-24 object-cover mx-auto rounded-md mb-2" />
                  <span className="text-sm font-semibold text-dark-text">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-xl font-bold text-dark-text mb-6">Passo 2: Detalhes da Requisição</h3>
             <div className="space-y-4">
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-light-text mb-1">Quantidade</label>
                    <input type="number" id="quantity" defaultValue="1" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-light-text mb-1">Tipo de Requisição</label>
                    <div className="flex gap-4">
                        <label className="flex-1 p-3 border rounded-lg cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary"><input type="radio" name="type" value="loan" className="mr-2" /> Empréstimo</label>
                        <label className="flex-1 p-3 border rounded-lg cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary"><input type="radio" name="type" value="permanent" className="mr-2" defaultChecked /> Uso Contínuo</label>
                    </div>
                </div>
                <div>
                    <label htmlFor="returnDate" className="block text-sm font-medium text-light-text mb-1">Data de Devolução (se empréstimo)</label>
                    <input type="date" id="returnDate" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                </div>
             </div>
          </div>
        );
      case 3:
        return (
            <div>
            <h3 className="text-xl font-bold text-dark-text mb-6">Passo 3: Entrega ou Retirada</h3>
             <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-light-text mb-1">Método</label>
                    <div className="flex gap-4">
                        <label className="flex-1 p-3 border rounded-lg cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary"><input type="radio" name="delivery" value="pickup" className="mr-2" defaultChecked /> Retirar no Almoxarifado</label>
                        <label className="flex-1 p-3 border rounded-lg cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary"><input type="radio" name="delivery" value="delivery" className="mr-2" /> Solicitar Entrega</label>
                    </div>
                </div>
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-light-text mb-1">Local de Entrega (se aplicável)</label>
                    <input type="text" id="location" placeholder="Ex: Sala A-201, Laboratório de Química" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                </div>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div className="bg-light-card w-full max-w-2xl rounded-2xl shadow-xl p-8 relative flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-dark-text">Nova Requisição</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>

        <div className="flex-grow overflow-y-auto pr-2">
            {renderStep()}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <div>
            <span className="text-sm font-semibold text-light-text">Passo {step} de 3</span>
          </div>
          <div className="flex gap-4">
            {step > 1 && <button onClick={handleBack} className="px-6 py-2 bg-gray-200 text-dark-text font-semibold rounded-lg hover:bg-gray-300">Voltar</button>}
            {step < 3 && <button onClick={handleNext} disabled={step === 1 && !selectedItem} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed">Avançar</button>}
            {step === 3 && <button onClick={handleSubmit} className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">Finalizar Requisição</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;
