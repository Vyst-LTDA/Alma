import React from 'react';

const RateLimitingCard: React.FC = () => {
    return (
        <div className="bg-light-card p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold text-dark-text mb-4">Limites de Taxa (Rate Limiting)</h3>
            <p className="text-sm text-light-text mb-6">Configure os limites de requisições para proteger a API contra abuso e garantir a estabilidade.</p>
            <form className="space-y-4">
                 <div>
                     <label htmlFor="reqPerMinute" className="block text-sm font-medium text-dark-text mb-1">Requisições por Minuto</label>
                     <input type="number" id="reqPerMinute" defaultValue="1000" className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                 </div>
                 <div>
                     <label htmlFor="burst" className="block text-sm font-medium text-dark-text mb-1">Pico de Requisições (Burst)</label>
                     <input type="number" id="burst" defaultValue="200" className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                 </div>
                 <div className="flex justify-end pt-4">
                    <button type="submit" className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90">
                        Salvar Alterações
                    </button>
                 </div>
            </form>
        </div>
    );
};

export default RateLimitingCard;