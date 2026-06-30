/**
 * Validates Iranian mobile phone numbers
 * Supports formats: 09xxxxxxxxx, 9xxxxxxxxx (without leading zero), +989xxxxxxxxx, 00989xxxxxxxxx
 */
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Check different formats
  // 10 digits starting with 9 (without leading zero)
  if (digits.length === 10 && digits.startsWith('9')) {
    return true;
  }
  
  // 11 digits starting with 09
  if (digits.length === 11 && digits.startsWith('09')) {
    return true;
  }
  
  // 12 digits starting with 989
  if (digits.length === 12 && digits.startsWith('989')) {
    return true;
  }
  
  // 13 digits starting with 0989
  if (digits.length === 13 && digits.startsWith('0989')) {
    return true;
  }
  
  return false;
};

/**
 * Normalizes phone number to standard format (09xxxxxxxxx)
 */
export const normalizePhoneNumber = (phoneNumber: string): string => {
  const digits = phoneNumber.replace(/\D/g, '');
  
  // 10 digits starting with 9 (add leading zero)
  if (digits.length === 10 && digits.startsWith('9')) {
    return '0' + digits;
  }
  
  // 11 digits starting with 09
  if (digits.length === 11 && digits.startsWith('09')) {
    return digits;
  }
  
  // 12 digits starting with 989
  if (digits.length === 12 && digits.startsWith('989')) {
    return '0' + digits.substring(2);
  }
  
  // 13 digits starting with 0989
  if (digits.length === 13 && digits.startsWith('0989')) {
    return '0' + digits.substring(3);
  }
  
  return phoneNumber;
};

/**
 * Formats phone number for display (09xx xxx xxxx)
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const normalized = normalizePhoneNumber(phoneNumber);
  
  if (normalized.length === 11) {
    return `${normalized.substring(0, 4)} ${normalized.substring(4, 7)} ${normalized.substring(7)}`;
  }
  
  return phoneNumber;
};
