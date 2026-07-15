import { describe, expect, test } from 'vitest';
import {
  addDays,
  getDayOfWeek,
  getMonthDays,
  isLeapYear,
  isValid,
  subtractDays,
  toEthiopian,
  toGregorian,
  toISOString,
  formatNumber,
  toGeezNumerals,
  getMonthName,
  getHoliday,
  type EthiopianDate,
} from './index';

function utcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

function ymdUTC(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/* ───────── Leap year ───────── */

describe('isLeapYear', () => {
  test('follows (year + 1) % 4 === 0', () => {
    expect(isLeapYear(2011)).toBe(true); // 2012 % 4 === 0
    expect(isLeapYear(2012)).toBe(false);
    expect(isLeapYear(2015)).toBe(true); // 2016 % 4 === 0
    expect(isLeapYear(2016)).toBe(false);
  });

  test('full 4-year cycle alternates correctly', () => {
    for (let y = 1; y <= 400; y++) {
      if ((y + 1) % 4 === 0) {
        expect(isLeapYear(y)).toBe(true);
      } else {
        expect(isLeapYear(y)).toBe(false);
      }
    }
  });

  test('throws on non-integer year', () => {
    expect(() => isLeapYear(NaN)).toThrow(RangeError);
    expect(() => isLeapYear(1.5)).toThrow(RangeError);
  });
});

/* ───────── Month days ───────── */

describe('getMonthDays', () => {
  test('months 1..12 are always 30', () => {
    for (let m = 1; m <= 12; m += 1) {
      expect(getMonthDays(m, 2015)).toBe(30);
    }
  });

  test('Pagume (13) is 5 days normally, 6 in leap years', () => {
    expect(getMonthDays(13, 2012)).toBe(5); // non-leap: (2012+1)%4=1
    expect(getMonthDays(13, 2013)).toBe(5); // non-leap: (2013+1)%4=2
    expect(getMonthDays(13, 2011)).toBe(6); // leap: (2011+1)%4=0
    expect(getMonthDays(13, 2015)).toBe(6); // leap: (2015+1)%4=0
    expect(getMonthDays(13, 2019)).toBe(6); // leap: (2019+1)%4=0
  });

  test('throws on out-of-range month', () => {
    expect(() => getMonthDays(0, 2015)).toThrow(RangeError);
    expect(() => getMonthDays(14, 2015)).toThrow(RangeError);
    expect(() => getMonthDays(-1, 2015)).toThrow(RangeError);
  });

  test('throws on non-integer month/year', () => {
    expect(() => getMonthDays(NaN, 2015)).toThrow(RangeError);
    expect(() => getMonthDays(1, NaN)).toThrow(RangeError);
  });
});

/* ───────── Conversion anchor ───────── */

describe('known conversions', () => {
  test('Sept 11, 2022 -> Ethiopian 2015-01-01', () => {
    const eth = toEthiopian(utcDate(2022, 9, 11));
    expect(eth).toEqual({ year: 2015, month: 1, day: 1 });
  });

  test('Ethiopian 2015-01-01 -> Sept 11, 2022', () => {
    const greg = toGregorian({ year: 2015, month: 1, day: 1 });
    expect(ymdUTC(greg)).toBe('2022-09-11');
  });

  test('Jan 1, 2023 -> Ethiopian 2015-04-23', () => {
    const eth = toEthiopian(utcDate(2023, 1, 1));
    expect(eth).toEqual({ year: 2015, month: 4, day: 23 });
  });

  test('round-trip across many dates', () => {
    const samples: EthiopianDate[] = [
      { year: 1, month: 1, day: 1 },          // epoch
      { year: 1, month: 13, day: 5 },          // non-leap Pagume last day
      { year: 500, month: 6, day: 15 },
      { year: 2015, month: 1, day: 1 },        // anchor
      { year: 2015, month: 4, day: 23 },
      { year: 2015, month: 13, day: 6 },       // leap: (2015+1)%4===0, Pagume last day
      { year: 2016, month: 1, day: 1 },
      { year: 2016, month: 13, day: 5 },       // non-leap: (2016+1)%4=1, max Pagume=5
      { year: 2019, month: 13, day: 6 },       // leap: (2019+1)%4===0, Pagume last day
      { year: 3000, month: 7, day: 14 },
    ];
    for (const eth of samples) {
      const g = toGregorian(eth);
      const back = toEthiopian(g);
      expect(toISOString(back)).toBe(toISOString(eth));
    }
  });

  test('throw on invalid Ethiopian dates for toGregorian', () => {
    expect(() => toGregorian({ year: 0, month: 1, day: 1 })).toThrow(RangeError);
    expect(() => toGregorian({ year: 2015, month: 14, day: 1 })).toThrow(RangeError);
    expect(() => toGregorian({ year: 2015, month: 1, day: 31 })).toThrow(RangeError);
  });
});

/* ───────── Edge transitions ───────── */

describe('edge transitions', () => {
  test('end of month rolls to next month', () => {
    const next = addDays({ year: 2015, month: 1, day: 30 }, 1);
    expect(next).toEqual({ year: 2015, month: 2, day: 1 });
  });

  test('end of year (leap) rolls to next year', () => {
    const year2015Last: EthiopianDate = { year: 2015, month: 13, day: 6 };
    expect(addDays(year2015Last, 1)).toEqual({ year: 2016, month: 1, day: 1 });
    expect(subtractDays({ year: 2016, month: 1, day: 1 }, 1)).toEqual(year2015Last);
  });

  test('end of non-leap Pagume rolls to Meskerem', () => {
    const nonLeapLast: EthiopianDate = { year: 2012, month: 13, day: 5 };
    expect(addDays(nonLeapLast, 1)).toEqual({ year: 2013, month: 1, day: 1 });
    expect(subtractDays({ year: 2013, month: 1, day: 1 }, 1)).toEqual(nonLeapLast);
  });

  test('addDays across year boundary (non-leap)', () => {
    const before: EthiopianDate = { year: 2012, month: 13, day: 4 };
    expect(addDays(before, 2)).toEqual({ year: 2013, month: 1, day: 1 });
  });

  test('subtractDays goes negative then back', () => {
    const d = { year: 2, month: 1, day: 1 };
    const prev = subtractDays(d, 1);
    expect(prev).toEqual({ year: 1, month: 13, day: 5 });
    const back = addDays(prev, 1);
    expect(toISOString(back)).toBe(toISOString(d));
  });

  test('add/subtract zero returns same date', () => {
    const d: EthiopianDate = { year: 2015, month: 6, day: 15 };
    expect(addDays(d, 0)).toEqual(d);
    expect(subtractDays(d, 0)).toEqual(d);
  });
});

/* ───────── Day of week ───────── */

describe('getDayOfWeek', () => {
  test('anchor date (2015-01-01) is Sunday', () => {
    expect(getDayOfWeek({ year: 2015, month: 1, day: 1 })).toBe(0);
  });

  test('known reference dates', () => {
    // 2022-09-12 (Eth 2015-01-02) is Monday
    expect(getDayOfWeek({ year: 2015, month: 1, day: 2 })).toBe(1);
    // 2022-09-17 (Eth 2015-01-07) is Saturday
    expect(getDayOfWeek({ year: 2015, month: 1, day: 7 })).toBe(6);
  });

  test('consistent 7-day cycle', () => {
    const d: EthiopianDate = { year: 2015, month: 1, day: 1 };
    for (let i = 0; i < 28; i++) {
      expect(getDayOfWeek(addDays(d, i))).toBe(i % 7);
    }
  });
});

/* ───────── ISO string ───────── */

describe('toISOString', () => {
  test('formats as YYYY-MM-DD', () => {
    expect(toISOString({ year: 2015, month: 1, day: 1 })).toBe('2015-01-01');
    expect(toISOString({ year: 2015, month: 13, day: 6 })).toBe('2015-13-06');
    expect(toISOString({ year: 1, month: 1, day: 1 })).toBe('0001-01-01');
  });

  test('throws on invalid date', () => {
    expect(() => toISOString({ year: 0, month: 1, day: 1 })).toThrow(RangeError);
  });
});

/* ───────── isValid ───────── */

describe('isValid', () => {
  test('valid dates return true', () => {
    expect(isValid({ year: 2015, month: 1, day: 1 })).toBe(true);
    expect(isValid({ year: 2015, month: 13, day: 6 })).toBe(true);
    expect(isValid({ year: 2012, month: 13, day: 5 })).toBe(true);
    expect(isValid({ year: 1, month: 1, day: 1 })).toBe(true);
  });

  test('invalid dates return false', () => {
    expect(isValid({ year: 0, month: 1, day: 1 })).toBe(false);
    expect(isValid({ year: 2015, month: 0, day: 1 })).toBe(false);
    expect(isValid({ year: 2015, month: 14, day: 1 })).toBe(false);
    expect(isValid({ year: 2015, month: 1, day: 0 })).toBe(false);
    expect(isValid({ year: 2015, month: 1, day: 31 })).toBe(false);
    expect(isValid({ year: 2012, month: 13, day: 6 })).toBe(false); // non-leap Pagume max is 5
    expect(isValid({ year: 2015, month: 13, day: 7 })).toBe(false); // >6
    expect(isValid({ year: -1, month: 1, day: 1 })).toBe(false);
  });
});

/* ───────── Ge'ez numerals ───────── */

describe('toGeezNumerals', () => {
  test('ones', () => {
    expect(toGeezNumerals(1)).toBe('፩');
    expect(toGeezNumerals(5)).toBe('፭');
    expect(toGeezNumerals(9)).toBe('፱');
  });

  test('tens', () => {
    expect(toGeezNumerals(10)).toBe('፲');
    expect(toGeezNumerals(30)).toBe('፴');
    expect(toGeezNumerals(99)).toBe('፺፱');
  });

  test('hundreds', () => {
    expect(toGeezNumerals(100)).toBe('፻');
    expect(toGeezNumerals(200)).toBe('፪፻');
    expect(toGeezNumerals(111)).toBe('፻፲፩');
  });

  test('thousands', () => {
    expect(toGeezNumerals(1000)).toBe('፲፻');
    expect(toGeezNumerals(2024)).toBe('፳፻፳፬');
    expect(toGeezNumerals(9999)).toBe('፺፱፻፺፱');
  });

  test('ten-thousands', () => {
    expect(toGeezNumerals(10000)).toBe('፼');
    expect(toGeezNumerals(10001)).toBe('፼፩');
  });

  test('formatNumber delegates', () => {
    expect(formatNumber(5, 'en')).toBe('5');
    expect(formatNumber(5, 'am')).toBe('፭');
    expect(formatNumber(2024, 'en')).toBe('2024');
    expect(formatNumber(2024, 'am')).toBe('፳፻፳፬');
  });

  test('throws on non-integer', () => {
    expect(() => toGeezNumerals(NaN)).toThrow(RangeError);
    expect(() => toGeezNumerals(1.5)).toThrow(RangeError);
  });

  test('returns empty string for n < 1', () => {
    expect(toGeezNumerals(0)).toBe('');
    expect(toGeezNumerals(-5)).toBe('');
  });
});

/* ───────── getMonthName ───────── */

describe('getMonthName', () => {
  test('returns English names', () => {
    expect(getMonthName(1, 'en')).toBe('Meskerem');
    expect(getMonthName(13, 'en')).toBe('Pagume');
  });

  test('returns Amharic names with English parenthetical', () => {
    const name = getMonthName(1, 'am');
    expect(name).toContain('መስከረም');
    expect(name).toContain('(Meskerem)');
  });

  test('throws on out-of-range month', () => {
    expect(() => getMonthName(0, 'en')).toThrow(RangeError);
    expect(() => getMonthName(14, 'en')).toThrow(RangeError);
  });
});

/* ───────── Holidays ───────── */

describe('getHoliday', () => {
  test('returns known Ethiopian holiday', () => {
    const h = getHoliday(1, 1); // Meskerem 1 = Enkutatash
    expect(h).not.toBeNull();
    expect(h!.name).toBe('Enkutatash (Ethiopian New Year)');
  });

  test('returns null for non-holiday', () => {
    expect(getHoliday(1, 2)).toBeNull();
    expect(getHoliday(13, 1)).toBeNull();
  });
});

