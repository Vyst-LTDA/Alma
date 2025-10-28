/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
export interface ChartConfig {
    id: string;
    title: string;
    type: 'bar' | 'pie' | 'line' | 'area' | 'verticalBar';
    data: any[];
    dataKey: string;
    nameKey: string;
}

const generateRandomData = (labels: string[], dataKey: string, nameKey: string) => {
    return labels.map(label => ({
        [nameKey]: label,
        [dataKey]: Math.floor(Math.random() * 100) + 10
    }));
};

const categories = ['Escritório', 'Eletrônicos', 'Segurança', 'Alimentos', 'Didático'];
const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
const items = ['Canetões', 'Projetor', 'EPIs', 'Livros', 'Farinha'];
const requesters = ['Ana Pereira', 'Carlos Souza', 'Mariana Lima', 'Usuário'];
const suppliers = ['Papelaria Central', 'Tech Solutions', 'Didáticos & Cia'];

// --- CHARTS FOR ANALYTICS VIEW ---
export const generalAnalyticsCharts: ChartConfig[] = [
    { id: 'ga1', title: 'Perdas por Categoria', type: 'pie', data: generateRandomData(categories, 'value', 'name'), dataKey: 'value', nameKey: 'name' },
    { id: 'ga2', title: 'Requisições por Solicitante', type: 'bar', data: generateRandomData(requesters, 'requisições', 'name'), dataKey: 'requisições', nameKey: 'name' },
    { id: 'ga3', title: 'Entrada de Itens por Mês', type: 'line', data: generateRandomData(months, 'entradas', 'name'), dataKey: 'entradas', nameKey: 'name' },
    { id: 'ga4', title: 'Uso Recorrente por Item', type: 'verticalBar', data: generateRandomData(items, 'usos', 'name'), dataKey: 'usos', nameKey: 'name' },
    { id: 'ga5', title: 'Requisições por Fornecedor', type: 'pie', data: generateRandomData(suppliers, 'value', 'name'), dataKey: 'value', nameKey: 'name' },
    { id: 'ga6', title: 'Uso Contínuo (Volume Mensal)', type: 'area', data: generateRandomData(months, 'volume', 'name'), dataKey: 'volume', nameKey: 'name' },
    { id: 'ga7', title: 'Perdas por Mês', type: 'line', data: generateRandomData(months, 'perdas', 'name'), dataKey: 'perdas', nameKey: 'name' },
    { id: 'ga8', title: 'Entradas por Categoria', type: 'bar', data: generateRandomData(categories, 'entradas', 'name'), dataKey: 'entradas', nameKey: 'name' },
    { id: 'ga9', title: 'Itens (Empréstimo) por Solicitante', type: 'verticalBar', data: generateRandomData(requesters, 'empréstimos', 'name'), dataKey: 'empréstimos', nameKey: 'name' },
    { id: 'ga10', title: 'Valor de Perdas (R$) por Fornecedor', type: 'area', data: generateRandomData(suppliers, 'valor', 'name'), dataKey: 'valor', nameKey: 'name' },
];

export const myAnalyticsCharts: ChartConfig[] = [
    { id: 'ma1', title: 'Minhas Requisições por Categoria', type: 'pie', data: generateRandomData(categories, 'value', 'name'), dataKey: 'value', nameKey: 'name' },
    { id: 'ma2', title: 'Meus Itens Mais Requisitados', type: 'bar', data: generateRandomData(items, 'requisições', 'name'), dataKey: 'requisições', nameKey: 'name' },
    { id: 'ma3', title: 'Meu Histórico de Requisições (Mensal)', type: 'line', data: generateRandomData(months, 'requisições', 'name'), dataKey: 'requisições', nameKey: 'name' },
    { id: 'ma4', title: 'Meus Empréstimos por Categoria', type: 'verticalBar', data: generateRandomData(categories, 'empréstimos', 'name'), dataKey: 'empréstimos', nameKey: 'name' },
    { id: 'ma5', title: 'Minhas Perdas Registradas', type: 'pie', data: generateRandomData(categories, 'value', 'name'), dataKey: 'value', nameKey: 'name' },
    { id: 'ma6', title: 'Minhas Entradas Registradas (Volume)', type: 'area', data: generateRandomData(months, 'volume', 'name'), dataKey: 'volume', nameKey: 'name' },
    { id: 'ma7', title: 'Meu Uso de Itens (Mensal)', type: 'bar', data: generateRandomData(months, 'uso', 'name'), dataKey: 'uso', nameKey: 'name' },
    { id: 'ma8', title: 'Meus Empréstimos vs. Uso Contínuo', type: 'pie', data: generateRandomData(['Empréstimo', 'Uso Contínuo'], 'value', 'name'), dataKey: 'value', nameKey: 'name' },
    { id: 'ma9', title: 'Frequência de Requisições por Dia da Semana', type: 'line', data: generateRandomData(['Seg', 'Ter', 'Qua', 'Qui', 'Sex'], 'frequência', 'name'), dataKey: 'frequência', nameKey: 'name' },
    { id: 'ma10', title: 'Meus Itens de Empréstimo Ativos', type: 'verticalBar', data: generateRandomData(items.slice(0,3), 'ativos', 'name'), dataKey: 'ativos', nameKey: 'name' },
];


// --- CHARTS FOR DASHBOARD VIEW ---
export const generalDashboardCharts: ChartConfig[] = [
    { id: 'gd1', title: 'Volume de Requisições (Últimos 6 meses)', type: 'bar', data: generateRandomData(months, 'volume', 'name'), dataKey: 'volume', nameKey: 'name' },
    { id: 'gd2', title: 'Distribuição de Requisições por Status', type: 'pie', data: generateRandomData(['Pendente', 'Aprovado', 'Entregue', 'Recusado'], 'value', 'name'), dataKey: 'value', nameKey: 'name' },
    { id: 'gd3', title: 'Top Itens por Fornecedor', type: 'verticalBar', data: generateRandomData(suppliers, 'itens', 'name'), dataKey: 'itens', nameKey: 'name' },
    { id: 'gd4', title: 'Tendência de Perdas (Mensal)', type: 'line', data: generateRandomData(months, 'perdas', 'name'), dataKey: 'perdas', nameKey: 'name' },
    { id: 'gd5', title: 'Taxa de Atendimento (%)', type: 'area', data: generateRandomData(months, 'taxa', 'name'), dataKey: 'taxa', nameKey: 'name' },
];

export const myDashboardCharts: ChartConfig[] = [
    { id: 'md1', title: 'Minhas Requisições (Últimos 6 meses)', type: 'bar', data: generateRandomData(months, 'volume', 'name'), dataKey: 'volume', nameKey: 'name' },
    { id: 'md2', title: 'Status das Minhas Requisições', type: 'pie', data: generateRandomData(['Pendente', 'Aprovado', 'Entregue', 'Recusado'], 'value', 'name'), dataKey: 'value', nameKey: 'name' },
    { id: 'md3', title: 'Meus Itens Mais Usados', type: 'verticalBar', data: generateRandomData(items, 'quantidade', 'name'), dataKey: 'quantidade', nameKey: 'name' },
    { id: 'md4', title: 'Meus Empréstimos (Mensal)', type: 'line', data: generateRandomData(months, 'empréstimos', 'name'), dataKey: 'empréstimos', nameKey: 'name' },
    { id: 'md5', title: 'Minhas Requisições por Categoria', type: 'pie', data: generateRandomData(categories, 'valor', 'name'), dataKey: 'valor', nameKey: 'name' },
];

export const professorDashboardCharts: ChartConfig[] = [
    { id: 'pd1', title: 'Minhas Requisições por Tipo', type: 'pie', data: generateRandomData(['Uso Contínuo', 'Empréstimo'], 'value', 'name'), dataKey: 'value', nameKey: 'name' },
    { id: 'pd2', title: 'Histórico Mensal de Requisições', type: 'bar', data: generateRandomData(months, 'requisições', 'name'), dataKey: 'requisições', nameKey: 'name' },
    { id: 'pd3', title: 'Itens de Empréstimo Mais Solicitados', type: 'verticalBar', data: generateRandomData(items.slice(0,3), 'empréstimos', 'name'), dataKey: 'empréstimos', nameKey: 'name' },
    { id: 'pd4', title: 'Requisições por Categoria', type: 'pie', data: generateRandomData(categories, 'value', 'name'), dataKey: 'value', nameKey: 'name' },
    { id: 'pd5', title: 'Tendência de Devoluções', type: 'line', data: generateRandomData(months, 'devoluções', 'name'), dataKey: 'devoluções', nameKey: 'name' },
];
