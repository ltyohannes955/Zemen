'use client';

import { useState, useCallback } from 'react';
import { toEthiopianLocal, getMonthDays } from '@zemen/core';

/*
 * Usage:
 *   const nav = useCalendarNavigation(undefined, 'ethiopian');
 *   // nav.year, nav.month, nav.day — current position
 *   nav.goToNextMonth() / nav.goToPreviousMonth() / nav.goToToday()
 *
 * The initialDate (if provided) must be in the same calendar system as the
 * `calendar` prop. If omitted, defaults to today in the specified calendar.
 */

export type UseCalendarNavigationResult = {
  year: number;
  month: number;
  day: number;
  goToNextMonth: () => void;
  goToPreviousMonth: () => void;
  goToNextYear: () => void;
  goToPreviousYear: () => void;
  goToToday: () => void;
  setDate: (year: number, month: number, day?: number) => void;
  calendar: 'ethiopian' | 'gregorian';
};

function getInitialDate(calendar: 'ethiopian' | 'gregorian'): { year: number; month: number; day: number } {
  if (calendar === 'ethiopian') {
    const eth = toEthiopianLocal(new Date());
    return { year: eth.year, month: eth.month, day: eth.day };
  }
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

function clampDay(year: number, month: number, day: number, calendar: 'ethiopian' | 'gregorian'): number {
  const maxDay = calendar === 'ethiopian'
    ? getMonthDays(month, year)
    : new Date(year, month, 0).getDate();
  return Math.min(day, maxDay);
}

const ETHIOPIAN_MAX_MONTH = 13;
const GREGORIAN_MAX_MONTH = 12;

export function useCalendarNavigation(
  initialDate?: { year: number; month: number; day: number } | undefined,
  calendar: 'ethiopian' | 'gregorian' = 'ethiopian',
): UseCalendarNavigationResult {
  const init = initialDate ?? getInitialDate(calendar);
  const [date, setDateState] = useState(init);
  const maxMonth = calendar === 'ethiopian' ? ETHIOPIAN_MAX_MONTH : GREGORIAN_MAX_MONTH;

  const goToNextMonth = useCallback(() => {
    setDateState((prev) => {
      let { year, month, day } = prev;
      if (month >= maxMonth) {
        year += 1;
        month = 1;
      } else {
        month += 1;
      }
      day = clampDay(year, month, day, calendar);
      return { year, month, day };
    });
  }, [maxMonth, calendar]);

  const goToPreviousMonth = useCallback(() => {
    setDateState((prev) => {
      let { year, month, day } = prev;
      if (month <= 1) {
        year -= 1;
        month = maxMonth;
      } else {
        month -= 1;
      }
      day = clampDay(year, month, day, calendar);
      return { year, month, day };
    });
  }, [maxMonth, calendar]);

  const goToNextYear = useCallback(() => {
    setDateState((prev) => ({ ...prev, year: prev.year + 1 }));
  }, []);

  const goToPreviousYear = useCallback(() => {
    setDateState((prev) => ({ ...prev, year: prev.year - 1 }));
  }, []);

  const goToToday = useCallback(() => {
    setDateState(getInitialDate(calendar));
  }, [calendar]);

  const setDate = useCallback((year: number, month: number, day?: number) => {
    setDateState((prev) => ({ year, month, day: day ?? prev.day }));
  }, []);

  return {
    year: date.year,
    month: date.month,
    day: date.day,
    goToNextMonth,
    goToPreviousMonth,
    goToNextYear,
    goToPreviousYear,
    goToToday,
    setDate,
    calendar,
  };
}
