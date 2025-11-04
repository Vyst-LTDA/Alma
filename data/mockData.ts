/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import { Request, Contact, Supplier, LossRecord, CreateItemRequestDto, ItemDto } from '../types';

export let mockLossRecords: LossRecord[] = [
    { id: 'LOSS-001', itemCode: 'ITM-001', itemName: 'Canetões (Caixa)', quantity: 1, report: 'Caixa danificada durante o transporte.', wasInStock: true, recordedBy: 'warehouse', date: '10/06/2024', category: 'Escritório' },
    { id: 'LOSS-002', itemCode: 'ITM-002', itemName: 'Projetor Multimídia', quantity: 1, report: 'Lâmpada queimou, sem conserto.', wasInStock: true, recordedBy: 'admin', date: '15/06/2024', category: 'Eletrônicos' },
    { id: 'LOSS-003', itemCode: 'ITM-003', itemName: 'Livro: Logística Reversa', quantity: 2, report: 'Páginas rasgadas por aluno.', wasInStock: false, recordedBy: 'professor', date: '20/06/2024', category: 'Material Didático' },
];

// --- API Simulation Service has been removed and replaced with a real service in services/apiService.ts ---