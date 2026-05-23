const monthNamesEn: readonly string[] = [
  'Meskerem',
  'Tikimt',
  'Hidar',
  'Tahsas',
  'Tir',
  'Yekatit',
  'Megabit',
  'Miazia',
  'Genbot',
  'Sene',
  'Hamle',
  'Nehase',
  'Pagume',
];

const monthNamesAm: readonly string[] = [
  'መስከረም',
  'ጥቅምት',
  'ህዳር',
  'ታህሳስ',
  'ጥር',
  'የካቲት',
  'መጋቢት',
  'ሚያዚያ',
  'ግንቦት',
  'ሰኔ',
  'ሐምሌ',
  'ነሐሴ',
  'ጳጉሜ',
];

const locales = {
  en: {
    monthNames: monthNamesEn,
  },
  am: {
    monthNames: monthNamesAm,
  },
} as const;

export type Locale = keyof typeof locales;

export type LocaleData = {
  monthNames: readonly string[];
};

export const supportedLocales = Object.keys(locales) as Locale[];

export function isSupportedLocale(locale: string): locale is Locale {
  return locale in locales;
}

export function getLocaleData(locale: Locale): LocaleData;
export function getLocaleData(locale: string): LocaleData | undefined;
export function getLocaleData(locale: string): LocaleData | undefined {
  return (locales as unknown as Record<string, LocaleData | undefined>)[locale];
}

export function getMonthName(month: number, locale: Locale = 'en'): string {
  if (month < 1 || month > 13) {
    throw new RangeError('month must be between 1 and 13');
  }
  const data = locales[locale];
  if (!data) {
    throw new RangeError(`unsupported locale "${locale}"`);
  }
  const name = data.monthNames[month - 1];
  if (locale !== 'en') {
    const enName = locales.en.monthNames[month - 1];
    return `${name} (${enName})`;
  }
  return name;
}

export function registerLocale(locale: string, data: LocaleData): void {
  if (locale in locales) {
    throw new Error(`locale "${locale}" is already registered`);
  }
  (locales as unknown as Record<string, LocaleData>)[locale] = data;
}
