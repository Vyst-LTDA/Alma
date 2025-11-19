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
    Cell,
    AreaChart,
    Area
} from 'recharts';
import { ArrowUturnLeftIcon, CsvIcon, ExcelIcon, ChartPieIcon } from '../../../components/shared/IconComponents';
import { exportRequestsToCSV, exportRequestsToExcel } from '../../../utils/export';

interface CustomAnalyticsViewProps {
    onBack: () => void;
}

const COLORS = ['#4f46e5', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

const CustomAnalyticsView: React.FC<CustomAnalyticsViewProps> = ({ onBack }) => {
    const [dependentVar, setDependentVar] = useState('Número de Requisições');
    const [independentVar, setIndependentVar] = useState('Categoria');
    const [chartType, setChartType] = useState<'bar' | 'pie' | 'line' | 'area'>('bar');
    const [period, setPeriod] = useState('Último Mês');

    const [chartData, setChartData] = useState<any[]>([]);
    const [isGenerated, setIsGenerated] = useState(false);
    
    // Generate mock data relevant to Warehouse context
    const generateMockData = () => {
        let labels: string[] = [];
        
        if (independentVar === 'Departamento') {
            labels = ['Logística', 'Engenharia', 'Administrativo', 'Vendas', 'TI'];
        } else if (independentVar === 'Categoria') {
            labels = ['EPIs', 'Eletrônicos', 'Papelaria', 'Limpeza', 'Ferramentas'];
        } else if (independentVar === 'Solicitante') {
            labels = ['João Silva', 'Maria Souza', 'Carlos Pereira', 'Ana Costa', 'Pedro Santos'];
        } else if (independentVar === 'Status') {
            labels = ['Aprovado', 'Pendente', 'Recusado', 'Entregue'];
        } else if (independentVar === 'Mês') {
            labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
        } else {
            labels = ['Item A', 'Item B', 'Item C', 'Item D', 'Item E'];
        }

        const newData = labels.map(label => ({
            name: label,
            value: Math.floor(Math.random() * 150) + 20 // Random values relevant to stock/requests
        }));

        setChartData(newData);
        setIsGenerated(true);
    };

    const handleExport = (format: 'csv' | 'excel') => {
        if (!isGenerated || chartData.length === 0) {
            alert("Gere um gráfico primeiro para exportar os dados.");
            return;
        }
        const filename = `relatorio_almoxarifado_${Date.now()}`;
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
        if (chartData.length === 0) return null;
        
        switch (chartType) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" name={dependentVar} radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" label>
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
                        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={3} activeDot={{ r: 8 }} name={dependentVar} />
                        </LineChart>
                    </ResponsiveContainer>
                );
             case 'area':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Legend />
                            <Area type="monotone" dataKey="value" stroke="#7c3aed" fillOpacity={1} fill="url(#colorValue)" name={dependentVar} />
                        </AreaChart>
                    </ResponsiveContainer>
                );
            default: return null;
        }
    }

    return (
        <div className="h-full flex flex-col gap-6 bg-light-bg">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                     <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <ArrowUturnLeftIcon className="w-5 h-5 text-dark-text" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-dark-text">Construtor de Gráficos</h2>
                        <p className="text-sm text-light-text">Crie visualizações personalizadas para seus relatórios.</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3">
                    <div className="text-xs font-semibold text-light-text uppercase tracking-wide mr-2">Admin</div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[500px]">
                {/* Left Column: Configuration */}
                <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
                    <h3 className="text-lg font-bold text-dark-text mb-6 border-b border-gray-100 pb-2">Configurações</h3>
                    
                    <div className="space-y-5 flex-grow">
                        <div>
                            <label className="block text-xs font-semibold text-light-text uppercase mb-1.5">Variável Dependente (Eixo Y)</label>
                            <select 
                                value={dependentVar} 
                                onChange={e => setDependentVar(e.target.value)} 
                                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-dark-text focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all"
                            >
                                <option>Número de Requisições</option>
                                <option>Nível de Estoque</option>
                                <option>Itens com Baixo Estoque</option>
                                <option>Valor Total em Estoque</option>
                                <option>Perdas (Quantidade)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-light-text uppercase mb-1.5">Variável Independente (Eixo X)</label>
                            <select 
                                value={independentVar} 
                                onChange={e => setIndependentVar(e.target.value)} 
                                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-dark-text focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all"
                            >
                                <option>Categoria</option>
                                <option>Departamento</option>
                                <option>Solicitante</option>
                                <option>Status</option>
                                <option>Mês</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-light-text uppercase mb-1.5">Tipo de Gráfico</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => setChartType('bar')} className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${chartType === 'bar' ? 'border-secondary text-secondary bg-secondary/5' : 'border-gray-200 text-light-text hover:bg-gray-50'}`}>Barras</button>
                                <button onClick={() => setChartType('pie')} className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${chartType === 'pie' ? 'border-secondary text-secondary bg-secondary/5' : 'border-gray-200 text-light-text hover:bg-gray-50'}`}>Setores</button>
                                <button onClick={() => setChartType('line')} className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${chartType === 'line' ? 'border-secondary text-secondary bg-secondary/5' : 'border-gray-200 text-light-text hover:bg-gray-50'}`}>Linhas</button>
                                <button onClick={() => setChartType('area')} className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${chartType === 'area' ? 'border-secondary text-secondary bg-secondary/5' : 'border-gray-200 text-light-text hover:bg-gray-50'}`}>Área</button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-light-text uppercase mb-1.5">Período</label>
                            <select 
                                value={period} 
                                onChange={e => setPeriod(e.target.value)} 
                                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-dark-text focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all"
                            >
                                <option>Último Mês</option>
                                <option>Último Trimestre</option>
                                <option>Último Semestre</option>
                                <option>Último Ano</option>
                                <option>Todo o Período</option>
                            </select>
                        </div>
                    </div>

                    <button 
                        onClick={generateMockData}
                        className="mt-6 w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-md transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
                    >
                        Gerar Gráfico
                    </button>
                </div>

                {/* Right Column: Visualization */}
                <div className="w-full lg:w-2/3 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full min-h-[500px]">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-2">
                        <h3 className="text-lg font-bold text-dark-text">Visualização</h3>
                        <div className="flex gap-2">
                            <button disabled={!isGenerated} onClick={() => handleExport('csv')} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-gray-50 text-dark-text rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                <CsvIcon className="w-4 h-4" /> CSV
                            </button>
                            <button disabled={!isGenerated} onClick={() => handleExport('excel')} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-gray-50 text-dark-text rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                <ExcelIcon className="w-4 h-4" /> Excel
                            </button>
                        </div>
                    </div>

                    <div className="flex-grow flex items-center justify-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200 relative overflow-hidden">
                        {isGenerated ? (
                            <div className="w-full h-full p-4 animate-in fade-in duration-500">
                                {renderChart()}
                            </div>
                        ) : (
                            <div className="text-center p-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ChartPieIcon className="w-8 h-8 text-gray-300" />
                                </div>
                                <h4 className="text-dark-text font-semibold mb-1">Seu gráfico aparecerá aqui</h4>
                                <p className="text-sm text-light-text max-w-xs mx-auto">
                                    Ajuste as configurações e clique em "Gerar Gráfico" para visualizar os dados.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomAnalyticsView;