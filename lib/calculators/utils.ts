export function formatCurrency(value: number | string): string {
  if (value === undefined || value === null || isNaN(Number(value))) return '-';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value));
}

export function formatPercent(value: number | string, decimals = 2): string {
  if (value === undefined || value === null || isNaN(Number(value))) return '-';
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(value) / 100);
}

export function formatNumber(value: number | string, decimals = 2): string {
  if (value === undefined || value === null || isNaN(Number(value))) return '-';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(value));
}

export function parseNumber(value: string): number {
  if (!value) return 0;
  // Handle Brazilian format if present
  let cleanValue = value;
  if (typeof value === 'string') {
    if (value.includes(',') && value.includes('.')) {
      cleanValue = value.replace(/\./g, '').replace(',', '.');
    } else if (value.includes(',')) {
      cleanValue = value.replace(',', '.');
    }
  }
  return Number(cleanValue) || 0;
}

export function pmt(rate: number, nper: number, pv: number, fv = 0, type = 0): number {
  if (rate === 0) return -(pv + fv) / nper;
  const pvif = Math.pow(1 + rate, nper);
  let pmt = rate / (pvif - 1) * -(pv * pvif + fv);
  if (type === 1) {
    pmt /= (1 + rate);
  }
  return Math.abs(pmt);
}

export function fv(rate: number, nper: number, pmt: number, pv: number, type = 0): number {
  const pow = Math.pow(1 + rate, nper);
  let fv;
  if (rate) {
    fv = (pmt * (1 + rate * type) * (1 - pow) / rate) - pv * pow;
  } else {
    fv = -1 * (pv + pmt * nper);
  }
  return fv;
}

export function pv(rate: number, nper: number, pmt: number, fv: number, type = 0): number {
  if (rate === 0) {
    return -fv - (pmt * nper);
  }
  const pvif = Math.pow(1 + rate, nper);
  return -(fv + pmt * (1 + rate * type) * ((pvif - 1) / rate)) / pvif;
}
