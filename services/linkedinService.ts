/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
// services/linkedinService.ts

/**
 * A mock database of LinkedIn profiles to simulate data fetching.
 * In a real application, this data would come from the LinkedIn API.
 */
const mockLinkedInProfiles: { [username: string]: string } = {
  'pedro-jefferson-paulas': 'Pedro Jefferson Paulas',
  'vyst-inc': 'Vyst Ltda.',
  'carlos-almoxarifado': 'Carlos Silva',
  'ana-docente': 'Ana Pereira',
  'satyanadella': 'Satya Nadella', // A valid but non-matching name
};

/**
 * Normalizes names for a more flexible comparison.
 * - Converts to lowercase.
 * - Removes middle initials and periods.
 * - Splits into parts and checks for inclusion.
 * @param name The name to normalize.
 * @returns A simplified, comparable version of the name.
 */
function normalizeName(name: string): string[] {
    return name
        .toLowerCase()
        .replace(/\s[A-Z]\.\s/g, ' ') // Remove middle initials like J.
        .replace(/[.,]/g, '') // Remove punctuation
        .split(' ');
}

/**
 * Simulates fetching a LinkedIn profile, verifying the name, and returning a profile picture URL.
 * @param appUserName The name of the user within the Alma application.
 * @param linkedInUsername The LinkedIn username provided by the user.
 * @returns A promise that resolves with the verification result.
 */
export const verifyAndFetchLinkedInPhoto = async (
  appUserName: string,
  linkedInUsername: string
): Promise<{ success: boolean; avatarUrl?: string; message?: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const linkedInProfileName = mockLinkedInProfiles[linkedInUsername];

  if (!linkedInProfileName) {
    return {
      success: false,
      message: 'Usuário do LinkedIn não encontrado. Verifique se o nome de usuário está correto.',
    };
  }

  // Perform name verification
  const appNameParts = normalizeName(appUserName);
  const linkedInNameParts = normalizeName(linkedInProfileName);

  // Check if at least the first and last names match.
  const isMatch = appNameParts[0] === linkedInNameParts[0] && appNameParts[appNameParts.length - 1] === linkedInNameParts[linkedInNameParts.length - 1];

  if (!isMatch) {
    return {
      success: false,
      message: `O nome no perfil do LinkedIn ("${linkedInProfileName}") não parece corresponder ao seu nome ("${appUserName}").`,
    };
  }

  // On success, return a new avatar URL. We use a consistent seed for the image.
  return {
    success: true,
    avatarUrl: `https://i.pravatar.cc/150?u=${linkedInUsername}`,
  };
};