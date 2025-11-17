import React from 'react';
import { ChartBarSquareIcon } from '../../../components/shared/IconComponents';

const PowerBIView: React.FC = () => {
    return (
        <div className="h-full flex flex-col gap-8">
            <div className="flex items-center gap-4">
                <ChartBarSquareIcon className="w-8 h-8 text-primary" />
                <div>
                    <h2 className="text-2xl font-bold text-dark-text">Integração Power BI (Acesso Antecipado)</h2>
                    <p className="text-light-text mt-1">Visualize e interaja com seus dashboards do Power BI diretamente no Alma.</p>
                </div>
            </div>

            <div className="flex-grow bg-light-card p-6 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center">
                <div className="max-w-md">
                    <img src="https://logodownload.org/wp-content/uploads/2017/05/power-bi-logo-1-1.png" alt="Power BI Logo" className="w-24 h-24 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-dark-text">Conecte sua conta do Power BI</h3>
                    <p className="text-light-text mt-2 mb-6">
                        Para começar, conecte sua conta do Microsoft Power BI. Isso permitirá que o Alma acesse e exiba seus relatórios e dashboards com segurança.
                    </p>
                    <button className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                        Conectar com a Microsoft
                    </button>
                    <p className="text-xs text-light-text mt-4">
                        A funcionalidade de integração ainda está em desenvolvimento. Este é um protótipo para o programa de acesso antecipado.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PowerBIView;
