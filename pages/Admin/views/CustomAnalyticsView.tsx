import React, { useState } from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Cell
} from 'recharts';
import { ArrowUturnLeftIcon, CsvIcon, ExcelIcon, ChartPieIcon, ChartLineIcon } from '../../../../components/shared/IconComponents';
import { exportRequestsToCSV, exportRequestsToExcel } from '../../../../utils/export';

interface CustomAnalyticsViewProps {
    onBack: () => void;
}

const COLORS = ['#4f46e5', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

const CustomAnalyticsView: React.FC<CustomAnalyticsViewProps> = ({ onBack }) => {
    const [dependentVar, setDependentVar] = useState('Itens que saíram de estoque');
    const [independentVar, setIndependentVar] = useState('Categoria de itens');
    const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');
    const [period, setPeriod] = useState('last-month');
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');
    const [customStartTime, setCustomStartTime] = useState('00:00');
    const [customEndTime, setCustomEndTime] = useState('23:59');

    const [chartData, setChartData] = useState<any[]>([]);
    const [isGenerated, setIsGenerated] = useState(false);
    
    const handleGenerateChart = () => {
        // Em uma aplicação real, isso acionaria uma chamada de API para o backend
        // com as opções selecionadas. O backend processaria e retornaria os dados.
        // Para simulação, definimos os dados como vazios para indicar que a chamada foi feita.
        setChartData([]);
        setIsGenerated(true);
    };

    const handleExport = (format: 'csv' | 'excel') => {
        if (!isGenerated) {
            alert("Gere um gráfico primeiro para exportar os dados.");
            return;
        }
        if (chartData.length === 0) {
            alert("Não há dados para exportar.");
            return;
        }
        const filename = `relatorio_${dependentVar.replace(/\s/g, '_')}_por_${independentVar.replace(/\s/g, '_')}`;
        const dataToExport = chartData.map(item => ({
            [independentVar]: item.name,
            [dependentVar]: item.value,
        }));

        if (format === 'csv') {
            exportRequestsToCSV(dataToExport as any, `${filename}.csv`);
        } else {
            exportRequestsToExcel(dataToExport as any, `${filename}.xlsx`);
        }
    };

    const renderChart = () => {
        if (chartData.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center text-light-text">
                    <p>Nenhum dado retornado pelo backend para as opções selecionadas.</p>
                    <p className="text-xs mt-1">(Simulação de chamada à API concluída)</p>
                </div>
            )
        }
        switch (chartType) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#4f46e5" name={dependentVar} />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                );
            case 'line':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#10b981" name={dependentVar} />
                        </LineChart>
                    </ResponsiveContainer>
                );
            default:
                return null;
        }
    }

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex items-center gap-4">
                 <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <ArrowUturnLeftIcon className="w-6 h-6 text-dark-text" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-dark-text">Construtor de Gráficos</h2>
                    <p className="text-light-text mt-1">Crie visualizações personalizadas para seus relatórios.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow min-h-0">
                {/* Controls Panel */}
                <div className="lg:col-span-1 bg-light-card p-6 rounded-xl border border-gray-200 flex flex-col">
                    <h3 className="text-lg font-bold text-dark-text mb-4">Configurações</h3>
                    <div className="flex-grow space-y-4 overflow-y-auto pr-2 -mr-2">
                        {/* Variables */}
                        <div>
                            <label htmlFor="dependent-var" className="block text-sm font-medium text-light-text mb-1">Variável Dependente (Eixo Y)</label>
                            <select id="dependent-var" value={dependentVar} onChange={e => setDependentVar(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white text-black">
                                <option>Itens que saíram de estoque</option>
                                <option>Itens que entraram em estoque</option>
                                <option>Itens perdidos</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="independent-var" className="block text-sm font-medium text-light-text mb-1">Variável Independente (Eixo X)</label>
                            <select id="independent-var" value={independentVar} onChange={e => setIndependentVar(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white text-black">
                                <option>Categoria de itens</option>
                                <option>Itens em estoque</option>
                                <option>Solicitante</option>
                                <option>Fornecedor</option>
                            </select>
                        </div>
                        
                        {/* Chart Type */}
                        <div>
                            <span className="block text-sm font-medium text-light-text mb-1">Tipo de Gráfico</span>
                            <div className="grid grid-cols-3 gap-2">
                                <label className={`p-2 border rounded-lg cursor-pointer text-center text-sm ${chartType === 'bar' ? 'bg-dark-text text-white border-dark-text font-semibold' : 'hover:bg-gray-50'}`}><input type="radio" name="chartType" value="bar" checked={chartType === 'bar'} onChange={() => setChartType('bar')} className="sr-only" /> Barras</label>
                                <label className={`p-2 border rounded-lg cursor-pointer text-center text-sm ${chartType === 'pie' ? 'bg-dark-text text-white border-dark-text font-semibold' : 'hover:bg-gray-50'}`}><input type="radio" name="chartType" value="pie" checked={chartType === 'pie'} onChange={() => setChartType('pie')} className="sr-only" /> Setores</label>
                                <label className={`p-2 border rounded-lg cursor-pointer text-center text-sm ${chartType === 'line' ? 'bg-dark-text text-white border-dark-text font-semibold' : 'hover:bg-gray-50'}`}><input type="radio" name="chartType" value="line" checked={chartType === 'line'} onChange={() => setChartType('line')} className="sr-only" /> Linhas</label>
                            </div>
                        </div>

                        {/* Period */}
                        <div>
                            <label htmlFor="period" className="block text-sm font-medium text-light-text mb-1">Período</label>
                            <select id="period" value={period} onChange={e => setPeriod(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white text-black">
                                <option value="last-hour">Última Hora</option>
                                <option value="last-day">Último Dia</option>
                                <option value="last-week">Última Semana</option>
                                <option value="last-month">Último Mês</option>
                                <option value="last-semester">Último Semestre</option>
                                <option value="last-year">Último Ano</option>
                                <option value="total">Período Total</option>
                                <option value="custom">Personalizado</option>
                            </select>
                        </div>
                        {period === 'custom' && (
                            <div className="space-y-2 p-3 bg-gray-50 rounded-lg border">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-light-text">Início</label>
                                        <div className="flex items-center gap-1 mt-1">
                                            <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className="w-full text-sm p-1.5 bg-white text-black border border-gray-300 rounded"/>
                                            <input type="time" value={customStartTime} onChange={e => setCustomStartTime(e.target.value)} className="w-auto text-sm p-1.5 bg-white text-black border border-gray-300 rounded"/>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-light-text">Fim</label>
                                        <div className="flex items-center gap-1 mt-1">
                                            <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="w-full text-sm p-1.5 bg-white text-black border border-gray-300 rounded"/>
                                            <input type="time" value={customEndTime} onChange={e => setCustomEndTime(e.target.value)} className="w-auto text-sm p-1.5 bg-white text-black border border-gray-300 rounded"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <button onClick={handleGenerateChart} className="w-full mt-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-transform transform hover:scale-105">
                        Gerar Gráfico
                    </button>
                </div>

                {/* Chart Area */}
                <div className="lg:col-span-2 bg-light-card p-6 rounded-xl border border-gray-200 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-dark-text">Visualização</h3>
                        <div className="flex gap-2">
                            <button onClick={() => handleExport('csv')} className="flex items-center gap-2 text-sm font-semibold bg-gray-100 text-dark-text px-3 py-1.5 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!isGenerated}>
                                <CsvIcon className="w-5 h-5"/> CSV
                            </button>
                            <button onClick={() => handleExport('excel')} className="flex items-center gap-2 text-sm font-semibold bg-gray-100 text-dark-text px-3 py-1.5 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!isGenerated}>
                                <ExcelIcon className="w-5 h-5"/> Excel
                            </button>
                        </div>
                    </div>

                    <div className="flex-grow flex items-center justify-center min-h-0 relative">
                        {!isGenerated ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-light-text p-4 z-10 pointer-events-none">
                                <ChartPieIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <h4 className="font-semibold text-dark-text">Seu gráfico aparecerá aqui</h4>
                                <p>Ajuste as configurações e clique em "Gerar Gráfico" para visualizar os dados.</p>
                            </div>
                        ) : (
                            renderChart()
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomAnalyticsView;