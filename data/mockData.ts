/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import { Request, Contact, Supplier, StockItem, LossRecord, CreateItemRequestDto, ItemDto } from '../types';

export let allRequests: Request[] = [
    { id: 'REQ-001', item: 'Canetões (Caixa)', quantity: 2, requester: 'Ana Pereira', status: 'Entregue', requestDate: '15/06/2024', type: 'Uso Contínuo', category: 'Escritório', unit: 'CX' },
    { id: 'REQ-002', item: 'Projetor Multimídia', quantity: 1, requester: 'Carlos Souza', status: 'Aprovado', requestDate: '18/06/2024', type: 'Empréstimo', category: 'Eletrônicos', unit: 'UN', returnDate: '25/06/2024' },
    { id: 'REQ-003', item: 'Livro: Logística Reversa', quantity: 5, requester: 'Ana Pereira', status: 'Pendente', requestDate: '20/06/2024', type: 'Empréstimo', category: 'Material Didático', unit: 'UN', returnDate: '10/07/2024' },
    { id: 'REQ-004', item: 'Kit de EPIs', quantity: 10, requester: 'Mariana Lima', status: 'Pendente', requestDate: '21/06/2024', type: 'Uso Contínuo', category: 'Segurança', unit: 'Kit' },
    { id: 'REQ-005', item: 'Canetões (Caixa)', quantity: 3, requester: 'Carlos Souza', status: 'Entregue', requestDate: '10/05/2024', type: 'Uso Contínuo', category: 'Escritório', unit: 'CX' },
    { id: 'REQ-006', item: 'Projetor Multimídia', quantity: 1, requester: 'Ana Pereira', status: 'Recusado', requestDate: '12/05/2024', type: 'Empréstimo', category: 'Eletrônicos', unit: 'UN', rejectionReason: 'Item em manutenção.' },
    { id: 'REQ-007', item: 'Farinha de Trigo (5kg)', quantity: 2, requester: 'Mariana Lima', status: 'Entregue', requestDate: '15/05/2024', type: 'Uso Contínuo', category: 'Alimentos', unit: 'Pct' },
    { id: 'REQ-008', item: 'Canetões (Caixa)', quantity: 1, requester: 'Ana Pereira', status: 'Entregue', requestDate: '01/04/2024', type: 'Uso Contínuo', category: 'Escritório', unit: 'CX' },
    { id: 'REQ-009', item: 'Kit de EPIs', quantity: 20, requester: 'Carlos Souza', status: 'Entregue', requestDate: '05/04/2024', type: 'Uso Contínuo', category: 'Segurança', unit: 'Kit' },
    { id: 'REQ-010', item: 'Projetor Multimídia', quantity: 1, requester: 'Mariana Lima', status: 'Aprovado', requestDate: '22/06/2024', type: 'Empréstimo', category: 'Eletrônicos', unit: 'UN', returnDate: '29/06/2024' },
    { id: 'REQ-011', item: 'Canetões (Caixa)', quantity: 5, requester: 'Usuário', status: 'Entregue', requestDate: '23/06/2024', type: 'Uso Contínuo', category: 'Escritório', unit: 'CX' },
    { id: 'REQ-012', item: 'Kit de EPIs', quantity: 2, requester: 'Usuário', status: 'Pendente', requestDate: '24/06/2024', type: 'Uso Contínuo', category: 'Segurança', unit: 'Kit' },
];

export const mockInventoryItems: { id: string, name: string, category: string }[] = [
    { id: 'ITM-001', name: 'Canetões (Caixa)', category: 'Escritório' },
    { id: 'ITM-002', name: 'Projetor Multimídia', category: 'Eletrônicos' },
    { id: 'ITM-003', name: 'Livro: Logística Reversa', category: 'Material Didático' },
    { id: 'ITM-004', name: 'Kit de EPIs', category: 'Segurança' },
    { id: 'ITM-005', name: 'Farinha de Trigo (5kg)', category: 'Alimentos' },
];

export let mockUsers: Contact[] = [
    { id: 'prof_ana', name: 'Ana Pereira', avatar: 'https://i.pravatar.cc/150?u=ana-docente', role: 'professor', email: 'ana.pereira@instituicao.edu' },
    { id: 'prof_carlos', name: 'Carlos Souza', avatar: 'https://i.pravatar.cc/150?u=carlos-docente', role: 'professor', email: 'carlos.souza@instituicao.edu' },
    { id: 'prof_mariana', name: 'Mariana Lima', avatar: 'https://i.pravatar.cc/150?u=mariana-docente', role: 'professor', email: 'mariana.lima@instituicao.edu' },
    { id: 'warehouse_main', name: 'Almoxarifado', avatar: 'https://i.pravatar.cc/150?u=almoxarifado-staff', role: 'warehouse', email: 'almoxarifado@instituicao.edu', unreadCount: 1 },
    { id: 'admin_main', name: 'Usuário', avatar: '', role: 'admin', email: 'admin@instituicao.edu' },
];

export let mockSuppliers: Supplier[] = [
    { id: 'sup1', name: 'Papelaria Central', cnpj: '11.111.111/0001-11', phone: '(11) 9999-1111', email: 'contato@papelariacentral.com', address: 'Rua das Papoulas, 123', category: 'Escritório' },
    { id: 'sup2', name: 'Tech Solutions', cnpj: '22.222.222/0001-22', phone: '(11) 9999-2222', email: 'vendas@techsolutions.com', address: 'Av. dos Projetores, 456', category: 'Eletrônicos' },
    { id: 'sup3', name: 'Didáticos & Cia', cnpj: '33.333.333/0001-33', phone: '(11) 9999-3333', email: 'contato@didaticos.com', address: 'Rua dos Livros, 789', category: 'Material Didático' },
];

export let mockStockItems: StockItem[] = [
    { id: '1', code: 'ITM-001', name: 'Canetões (Caixa)', category: 'Escritório', quantity: 50, status: 'Disponível' },
    { id: '2', code: 'ITM-002', name: 'Projetor Multimídia', category: 'Eletrônicos', quantity: 10, status: 'Disponível' },
    { id: '3', code: 'ITM-003', name: 'Livro: Logística Reversa', category: 'Material Didático', quantity: 5, status: 'Estoque Baixo' },
    { id: '4', code: 'ITM-004', name: 'Kit de EPIs', category: 'Segurança', quantity: 100, status: 'Disponível' },
    { id: '5', code: 'ITM-005', name: 'Farinha de Trigo (5kg)', category: 'Alimentos', quantity: 0, status: 'Indisponível' },
];

export let mockLossRecords: LossRecord[] = [
    { id: 'LOSS-001', itemCode: 'ITM-001', itemName: 'Canetões (Caixa)', quantity: 1, report: 'Caixa danificada durante o transporte.', wasInStock: true, recordedBy: 'warehouse', date: '10/06/2024', category: 'Escritório' },
    { id: 'LOSS-002', itemCode: 'ITM-002', itemName: 'Projetor Multimídia', quantity: 1, report: 'Lâmpada queimou, sem conserto.', wasInStock: true, recordedBy: 'admin', date: '15/06/2024', category: 'Eletrônicos' },
    { id: 'LOSS-003', itemCode: 'ITM-003', itemName: 'Livro: Logística Reversa', quantity: 2, report: 'Páginas rasgadas por aluno.', wasInStock: false, recordedBy: 'professor', date: '20/06/2024', category: 'Material Didático' },
];

export let mockMasterItems = [
    { code: 'ITM-001', name: 'Canetões (Caixa)', category: 'Escritório' },
    { code: 'ITM-002', name: 'Projetor Multimídia', category: 'Eletrônicos' },
    { code: 'ITM-003', name: 'Livro: Logística Reversa', category: 'Material Didático' },
    { code: 'ITM-004', name: 'Kit de EPIs', category: 'Segurança' },
    { code: 'ITM-005', name: 'Farinha de Trigo (5kg)', category: 'Alimentos' },
];

// Data for Educational Warehouse profile
export let mockEducationalStockItems: StockItem[] = [
    { id: 'edu-1', code: 'EDU-001', name: 'Palete de Madeira PBR', category: 'Logística', quantity: 20, status: 'Disponível' },
    { id: 'edu-2', code: 'EDU-002', name: 'Caixa de Papelão (50x50)', category: 'Embalagem', quantity: 8, status: 'Estoque Baixo' },
];
export const mockEducationalMasterItems: { code: string; name: string; category: string }[] = [
    { code: 'EDU-001', name: 'Palete de Madeira PBR', category: 'Logística' },
    { code: 'EDU-002', name: 'Caixa de Papelão (50x50)', category: 'Embalagem' },
];
export const allEducationalRequests: Request[] = [
    { id: 'EDUREQ-001', item: 'Palete de Madeira PBR', quantity: 5, requester: 'Almoxarifado', status: 'Entregue', requestDate: '10/06/2024', type: 'Uso Contínuo', category: 'Logística', unit: 'UN' },
    { id: 'EDUREQ-002', item: 'Caixa de Papelão (50x50)', quantity: 50, requester: 'Almoxarifado', status: 'Pendente', requestDate: '20/06/2024', type: 'Uso Contínuo', category: 'Embalagem', unit: 'UN' },
];


// --- API Simulation Service ---

const apiDelay = 500;

// GET /api/v1/Items
export const getItemsApi = async (params: { pageNumber?: number, pageSize?: number, searchTerm?: string }): Promise<{ items: ItemDto[], totalCount: number }> => {
    console.log('API_SIM: Fetching items with params:', params);
    await new Promise(resolve => setTimeout(resolve, apiDelay));

    let itemsToReturn = mockStockItems.map(item => ({ // mapping to ItemDto
        id: item.id,
        name: item.name,
        sku: item.code,
        stockQuantity: item.quantity,
        createdAt: '2024-01-01T12:00:00Z', // mock date
        updatedAt: null,
        attributes: {
            category: item.category,
        }
    }));

    if (params.searchTerm) {
        const term = params.searchTerm.toLowerCase();
        itemsToReturn = itemsToReturn.filter(item => 
            item.name.toLowerCase().includes(term) ||
            item.sku.toLowerCase().includes(term) ||
            (item.attributes.category && item.attributes.category.toLowerCase().includes(term))
        );
    }
    
    return {
        items: itemsToReturn,
        totalCount: itemsToReturn.length,
    };
};

// POST /api/v1/Items
export const createItemApi = async (itemData: CreateItemRequestDto): Promise<{ id: string }> => {
    console.log('API_SIM: Creating item:', itemData);
    await new Promise(resolve => setTimeout(resolve, apiDelay));

    // Simulate validation error
    if (mockStockItems.some(i => i.code === itemData.sku)) {
        throw new Error(`SKU "${itemData.sku}" já existe.`);
    }

    const newStockItem: StockItem = {
        id: `itm-${Date.now()}`,
        code: itemData.sku,
        name: itemData.name,
        quantity: itemData.stockQuantity,
        category: itemData.attributes?.category || 'Não categorizado',
        status: itemData.stockQuantity > 10 ? 'Disponível' : itemData.stockQuantity > 0 ? 'Estoque Baixo' : 'Indisponível'
    };
    
    const newMasterItem = {
      code: newStockItem.code,
      name: newStockItem.name,
      category: newStockItem.category
    };

    mockStockItems.unshift(newStockItem);
    mockMasterItems.unshift(newMasterItem);

    return { id: newStockItem.id };
};
