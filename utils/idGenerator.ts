/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
// FIX: The 'LossRecord' type is not exported from '../types' and was causing an error.
// The entire import statement was removed as 'Request' was also unused in this file.

type ItemWithId = { id: string };

export function generateDailyId(prefix: string, existingItems: ItemWithId[]): string {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const dateString = `${day}${month}${year}`;

  const todayItems = existingItems.filter(item => {
    const idParts = item.id.split('-');
    return idParts.length === 3 && idParts[2] === dateString && idParts[0] === prefix;
  });

  const nextIdNumber = todayItems.length + 1;
  const formattedIdNumber = String(nextIdNumber).padStart(3, '0');

  return `${prefix}-${formattedIdNumber}-${dateString}`;
}