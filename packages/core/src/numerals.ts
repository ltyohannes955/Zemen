const GEEZ_ONES = ['', '፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱'];
const GEEZ_TENS = ['', '፲', '፳', '፴', '፵', '፶', '፷', '፸', '፹', '፺'];
const GEEZ_HUNDRED = '፻';
const GEEZ_TEN_THOUSAND = '፼';

export function toGeezNumerals(n: number): string {
  if (!Number.isInteger(n)) {
    throw new RangeError('n must be an integer');
  }
  if (n < 1) return '';

  if (n < 100) {
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    return (tens > 0 ? GEEZ_TENS[tens] : '') + (ones > 0 ? GEEZ_ONES[ones] : '');
  }

  if (n < 10000) {
    const hundreds = Math.floor(n / 100);
    const remainder = n % 100;
    const prefix = hundreds === 1 ? GEEZ_HUNDRED : toGeezNumerals(hundreds) + GEEZ_HUNDRED;
    return prefix + (remainder > 0 ? toGeezNumerals(remainder) : '');
  }

  const tenThousands = Math.floor(n / 10000);
  const remainder = n % 10000;
  const prefix = tenThousands === 1 ? GEEZ_TEN_THOUSAND : toGeezNumerals(tenThousands) + GEEZ_TEN_THOUSAND;
  return prefix + (remainder > 0 ? toGeezNumerals(remainder) : '');
}

export function formatNumber(n: number, locale: 'en' | 'am'): string {
  if (locale === 'am') return toGeezNumerals(n);
  return String(n);
}
