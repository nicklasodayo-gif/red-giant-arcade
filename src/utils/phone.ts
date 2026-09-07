/**
 * Phone number validation and normalization utility
 * Special focus on Kenyan telecommunications prefixes (07xx, 01xx, 254xx, +254xx)
 * Standardizes valid numbers into E.164 compliant format: +254XXXXXXXXX
 */

export interface PhoneValidationResult {
  isValid: boolean;
  normalized: string;
  original: string;
  error?: string;
}

export function normalizePhoneNumber(rawInput: string, defaultCountry = 'KE'): PhoneValidationResult {
  if (!rawInput) {
    return { isValid: false, normalized: '', original: rawInput, error: 'Phone number is required' };
  }

  // Remove whitespace, hyphens, parentheses, and dots
  let cleaned = rawInput.trim().replace(/[\s\-\(\)\.]/g, '');

  if (defaultCountry === 'KE') {
    // 1. Starts with +254
    if (/^\+254[17]\d{8}$/.test(cleaned)) {
      return { isValid: true, normalized: cleaned, original: rawInput };
    }

    // 2. Starts with 254 (without plus)
    if (/^254[17]\d{8}$/.test(cleaned)) {
      return { isValid: true, normalized: `+${cleaned}`, original: rawInput };
    }

    // 3. Starts with 07 or 01 (10 digits)
    if (/^(07|01)\d{8}$/.test(cleaned)) {
      return { isValid: true, normalized: `+254${cleaned.substring(1)}`, original: rawInput };
    }

    // 4. Starts directly with 7 or 1 (9 digits)
    if (/^[17]\d{8}$/.test(cleaned)) {
      return { isValid: true, normalized: `+254${cleaned}`, original: rawInput };
    }

    // General international fallback if user is in an international activation
    if (/^\+[1-9]\d{6,14}$/.test(cleaned)) {
      return { isValid: true, normalized: cleaned, original: rawInput };
    }

    return {
      isValid: false,
      normalized: '',
      original: rawInput,
      error: 'Invalid Kenyan phone number format. Expected: 07XXXXXXXX, 01XXXXXXXX, or +254XXXXXXXXX'
    };
  }

  // Generic international E.164 validation
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }

  if (/^\+[1-9]\d{7,14}$/.test(cleaned)) {
    return { isValid: true, normalized: cleaned, original: rawInput };
  }

  return {
    isValid: false,
    normalized: '',
    original: rawInput,
    error: 'Invalid international phone number'
  };
}
