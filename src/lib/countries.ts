// List of countries for address form dropdown
export const COUNTRIES = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'BR', name: 'Brazil' },
  { code: 'RU', name: 'Russia' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'MX', name: 'Mexico' },
  { code: 'KR', name: 'South Korea' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'AR', name: 'Argentina' },
  { code: 'EG', name: 'Egypt' },
  { code: 'TH', name: 'Thailand' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'PH', name: 'Philippines' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'NP', name: 'Nepal' },
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'QA', name: 'Qatar' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'OM', name: 'Oman' },
  { code: 'JO', name: 'Jordan' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'IL', name: 'Israel' },
  { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'SY', name: 'Syria' },
  { code: 'YE', name: 'Yemen' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'TM', name: 'Turkmenistan' },
  { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'TJ', name: 'Tajikistan' },
  { code: 'MN', name: 'Mongolia' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'LA', name: 'Laos' },
  { code: 'BT', name: 'Bhutan' },
  { code: 'MV', name: 'Maldives' }
].sort((a, b) => a.name.localeCompare(b.name))

// Get country name by code
export function getCountryName(code: string): string {
  const country = COUNTRIES.find(c => c.code === code)
  return country ? country.name : code
}

// Get country code by name
export function getCountryCode(name: string): string {
  const country = COUNTRIES.find(c => c.name === name)
  return country ? country.code : name
} 