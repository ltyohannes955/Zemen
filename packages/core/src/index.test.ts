import { describe, expect, test } from 'vitest';
import {
  addDays,
  getDayOfWeek,
  getMonthDays,
  isLeapYear,
  subtractDays,
  toEthiopian,
  toGregorian,
  toISOString,
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

describe('isLeapYear', () => {
  test('follows (year + 1) % 4 === 0', () => {
    expect(isLeapYear(2011)).toBe(true); // 2012 % 4 === 0
    expect(isLeapYear(2012)).toBe(false);
    expect(isLeapYear(2015)).toBe(true); // 2016 % 4 === 0
    expect(isLeapYear(2016)).toBe(false);
  });
});

describe('getMonthDays', () => {
  test('months 1..12 are always 30', () => {
    for (let m = 1; m <= 12; m += 1) {
      expect(getMonthDays(m, 2015)).toBe(30);
    }
  });

  test('Pagume (13) is 5 days normally, 6 in leap years', () => {
    expect(getMonthDays(13, 2012)).toBe(5);
    expect(getMonthDays(13, 2015)).toBe(6);
  });
});

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
});

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

  test('round-trip conversion stays stable on day boundary', () => {
    const samples: EthiopianDate[] = [
      { year: 2015, month: 1, day: 1 },
      { year: 2015, month: 4, day: 23 },
      { year: 2015, month: 13, day: 6 },
      { year: 2016, month: 1, day: 1 },
    ];

    for (const eth of samples) {
      const g = toGregorian(eth);
      const back = toEthiopian(g);
      expect(toISOString(back)).toBe(toISOString(eth));
    }
  });
});

describe('getDayOfWeek', () => {
  test('returns 0..6 (Sunday..Saturday)', () => {
    // 2022-09-11 is Sunday.
    expect(getDayOfWeek({ year: 2015, month: 1, day: 1 })).toBe(0);
  });
});

