export type EthiopianHoliday = {
  month: number;
  day: number;
  name: string;
  nameAm: string;
};

export const ETHIOPIAN_HOLIDAYS: EthiopianHoliday[] = [
  { month: 1, day: 1, name: 'Enkutatash (Ethiopian New Year)', nameAm: 'እንቁጣጣሽ' },
  { month: 1, day: 17, name: 'Meskel (Finding of the True Cross)', nameAm: 'መስቀል' },
  { month: 4, day: 29, name: 'Genna (Ethiopian Christmas)', nameAm: 'ገና' },
  { month: 5, day: 11, name: 'Timkat (Ethiopian Epiphany)', nameAm: 'ጥምቀት' },
  { month: 6, day: 23, name: 'Adwa Victory Day', nameAm: 'የዓድዋ ድል በዓል' },
  { month: 9, day: 5, name: "Patriots' Victory Day", nameAm: 'የአርበኞች ድል በዓል' },
  { month: 12, day: 1, name: 'Ethiopian Constitution Day', nameAm: 'የሕገ መንግሥት ቀን' },
];

export function getHoliday(month: number, day: number): EthiopianHoliday | null {
  return ETHIOPIAN_HOLIDAYS.find((h) => h.month === month && h.day === day) ?? null;
}
