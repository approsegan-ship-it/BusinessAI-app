export type CurrencyCode = 'FCFA' | 'EUR' | 'USD' | 'GHS' | 'NGN' | 'CAD';

export interface CurrencyConfig {
  code: CurrencyCode;
  name: string;
  symbol: string;
  rateFromFCFA: number; // 1 FCFA = X Currency
  decimals: number;
  flag: string;
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  FCFA: {
    code: 'FCFA',
    name: 'Franc CFA (XOF / XAF)',
    symbol: 'FCFA',
    rateFromFCFA: 1,
    decimals: 0,
    flag: '🌍',
  },
  EUR: {
    code: 'EUR',
    name: 'Euro (€)',
    symbol: '€',
    rateFromFCFA: 1 / 655.957,
    decimals: 2,
    flag: '🇪🇺',
  },
  USD: {
    code: 'USD',
    name: 'Dollar US ($)',
    symbol: '$',
    rateFromFCFA: 1 / 610,
    decimals: 2,
    flag: '🇺🇸',
  },
  GHS: {
    code: 'GHS',
    name: 'Cedi Ghanéen (GH₵)',
    symbol: 'GH₵',
    rateFromFCFA: 1 / 40,
    decimals: 1,
    flag: '🇬🇭',
  },
  NGN: {
    code: 'NGN',
    name: 'Naira Nigérian (₦)',
    symbol: '₦',
    rateFromFCFA: 2.5,
    decimals: 0,
    flag: '🇳🇬',
  },
  CAD: {
    code: 'CAD',
    name: 'Dollar Canadien (CAD)',
    symbol: 'CA$',
    rateFromFCFA: 1 / 450,
    decimals: 2,
    flag: '🇨🇦',
  },
};

export function convertFromFCFA(amountFCFA: number, targetCurrency: CurrencyCode): number {
  const config = SUPPORTED_CURRENCIES[targetCurrency] || SUPPORTED_CURRENCIES.FCFA;
  const converted = amountFCFA * config.rateFromFCFA;
  if (config.decimals === 0) {
    return Math.round(converted);
  }
  return parseFloat(converted.toFixed(config.decimals));
}

export function formatPriceWithCurrency(amountFCFA: number, targetCurrency: CurrencyCode): string {
  if (amountFCFA === 0) {
    const sym = SUPPORTED_CURRENCIES[targetCurrency]?.symbol || targetCurrency;
    return targetCurrency === 'EUR' || targetCurrency === 'USD' || targetCurrency === 'CAD'
      ? `0.00 ${sym}`
      : `0 ${sym}`;
  }

  const config = SUPPORTED_CURRENCIES[targetCurrency] || SUPPORTED_CURRENCIES.FCFA;
  const value = convertFromFCFA(amountFCFA, targetCurrency);

  if (targetCurrency === 'FCFA') {
    return `${value.toLocaleString('fr-FR')} FCFA`;
  }
  if (targetCurrency === 'EUR') {
    return `${value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  }
  if (targetCurrency === 'USD') {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (targetCurrency === 'CAD') {
    return `CA$ ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (targetCurrency === 'GHS') {
    return `GH₵ ${value.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
  }
  if (targetCurrency === 'NGN') {
    return `₦${value.toLocaleString('en-US')}`;
  }

  return `${value.toLocaleString()} ${config.symbol}`;
}
