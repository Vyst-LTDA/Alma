import React from 'react';

const SwaggerCard: React.FC = () => {
    const handleAccessSwagger = () => {
        alert("Em um ambiente real, você seria redirecionado para a documentação interativa da API no Swagger UI.");
    };

    return (
        <div className="bg-light-card p-6 rounded-xl border border-gray-200 flex flex-col md:flex-row md:items-center justify-between">
            <div>
                <h3 className="text-lg font-bold text-dark-text mb-2">Documentação Interativa da API</h3>
                <p className="text-sm text-light-text">
                    Explore e teste os endpoints da API usando a interface do Swagger.
                </p>
            </div>
            <button
                onClick={handleAccessSwagger}
                className="w-full md:w-auto mt-4 md:mt-0 px-4 py-2 font-semibold bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition whitespace-nowrap"
            >
                Acessar Swagger UI
            </button>
        </div>
    );
};

export default SwaggerCard;