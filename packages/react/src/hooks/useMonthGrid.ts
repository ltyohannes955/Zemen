'use client';

import { useMemo } from 'react';
import {
  toEthiopianLocal,
  toEthiopian,
  toGregorian,
  getMonthDays,
  getDayOfWeek,
} from '@zemen/core';
import type { EthiopianDate } from '@zemen/core';

/*
 * Usage:
 *   const { weeks, month, year } = useMonthGrid(2018, 10, 'ethiopian');
 *   // weeks is a 2D array: DayCell[][] — rows of 7 columns
 */

export type DayCell = {
  day: number | null;
  isToday: boolean;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  ethiopian: { year: number; month: number; day: number } | null;
  gregorian: { year: number; month: number; day: number } | null;
};

export type MonthGridData = {
  weeks: DayCell[][];
  month: number;
  year: number;
  calendar: 'ethiopian' | 'gregorian';
};

function getTodayIn(calendar: 'ethiopian' | 'gregorian'): { year: number; month: number; day: number } {
  if (calendar === 'ethiopian') {
    const eth = toEthiopianLocal(new Date());
    return { year: eth.year, month: eth.month, day: eth.day };
  }
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

function buildEthCell(
  year: number,
  month: number,
  day: number | null,
  isCurrentMonth: boolean,
  today: { year: number; month: number; day: number },
): DayCell {
  if (day === null) {
    return { day: null, isToday: false, isCurrentMonth: false, isWeekend: false, ethiopian: null, gregorian: null };
  }
  const isToday = isCurrentMonth && today.year === year && today.month === month && today.day === day;
  const dow = getDayOfWeek({ year, month, day });
  const greg = toGregorian({ year, month, day } as EthiopianDate);
  return {
    day,
    isToday,
    isCurrentMonth,
    isWeekend: dow === 0 || dow === 6,
    ethiopian: { year, month, day },
    gregorian: { year: greg.getUTCFullYear(), month: greg.getUTCMonth() + 1, day: greg.getUTCDate() },
  };
}

function buildEthiopianMonthGrid(year: number, month: number): DayCell[][] {
  const weeks: DayCell[][] = [];
  const today = getTodayIn('ethiopian');
  const daysInMonth = getMonthDays(month, year);
  const firstDow = getDayOfWeek({ year, month, day: 1 } as EthiopianDate);

  let week: DayCell[] = [];
  for (let i = 0; i < firstDow; i++) {
    week.push(buildEthCell(year, month, null, false, today));
  }
  for (let d = 1; d <= daysInMonth; d++) {
    week.push(buildEthCell(year, month, d, true, today));
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) {
      week.push(buildEthCell(year, month, null, false, today));
    }
    weeks.push(week);
  }
  return weeks;
}

function gregorianDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function buildGregorianMonthGrid(year: number, month: number): DayCell[][] {
  const weeks: DayCell[][] = [];
  const today = getTodayIn('gregorian');
  const daysInMonth = gregorianDaysInMonth(year, month);
  const firstDow = new Date(year, month - 1, 1).getDay();

  let week: DayCell[] = [];
  for (let i = 0; i < firstDow; i++) {
    week.push({ day: null, isToday: false, isCurrentMonth: false, isWeekend: false, ethiopian: null, gregorian: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = today.year === year && today.month === month && today.day === d;
    const dow = new Date(year, month - 1, d).getDay();
    const eth = toEthiopian(new Date(Date.UTC(year, month - 1, d)));
    week.push({
      day: d,
      isToday,
      isCurrentMonth: true,
      isWeekend: dow === 0 || dow === 6,
      ethiopian: { year: eth.year, month: eth.month, day: eth.day },
      gregorian: { year, month, day: d },
    });
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) {
      week.push({ day: null, isToday: false, isCurrentMonth: false, isWeekend: false, ethiopian: null, gregorian: null });
    }
    weeks.push(week);
  }
  return weeks;
}

export function useMonthGrid(
  year: number,
  month: number,
  calendar: 'ethiopian' | 'gregorian',
): MonthGridData {
  return useMemo(() => {
    const weeks = calendar === 'ethiopian'
      ? buildEthiopianMonthGrid(year, month)
      : buildGregorianMonthGrid(year, month);
    return { weeks, month, year, calendar };
  }, [year, month, calendar]);
}
