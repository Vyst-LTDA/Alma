import React from 'react';

const SwaggerCard: React.FC = () => {
    const handleAccessSwagger = () => {
        alert("Em um ambiente real, você seria redirecionado para a documentação interativa da API no Swagger UI.");
    };

    return (
        <div className="bg-light-card p-6 rounded-xl border border-gray-200 flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-bold text-dark-text mb-2">Documentação da API</h3>
                <p className="text-sm text-light-text">
                    Explore todos os endpoints, modelos e teste as chamadas da API em tempo real usando a interface do Swagger.
                </p>
            </div>
            <button
                onClick={handleAccessSwagger}
                className="w-full mt-6 px-4 py-2 font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
                Acessar Documentação (Swagger)
            </button>
        </div>
    );
};

export default SwaggerCard;
