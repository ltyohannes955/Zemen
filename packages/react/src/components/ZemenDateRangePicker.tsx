'use client';

import * as React from 'react';
import { useMonthGrid } from '../hooks/useMonthGrid';
import { useCalendarNavigation } from '../hooks/useCalendarNavigation';
import { getMonthName, toGregorian, toEthiopian, formatNumber } from '@zemen/core';
import type { DateValue } from '@zemen/core';

/*
 * Date range picker. First click sets start, second click sets end.
 * Hover between start and end previews the range.
 * Clicking before the current start resets to a new range.
 */

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const GREGORIAN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const ETHIOPIAN_MONTHS = [
  'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
  'Megabit', 'Miazia', 'Genbot', 'Sene', 'Hamle', 'Nehase', 'Pagume',
];

export type DateRangeValue = {
  start: DateValue | null;
  end: DateValue | null;
};

export type ZemenDateRangePickerProps = {
  value?: DateRangeValue;
  onChange?: (range: DateRangeValue) => void;
  calendar?: 'ethiopian' | 'gregorian';
  minDate?: DateValue;
  maxDate?: DateValue;
  themeColor?: string;
  locale?: 'en' | 'am';
  className?: string;
};

function dateToKey(d: DateValue): string {
  return `${d.year}-${d.month}-${d.day}`;
}

function dateToSerial(d: DateValue): number {
  return d.year * 10000 + d.month * 100 + d.day;
}

function isBefore(a: DateValue, b: DateValue): boolean {
  return dateToSerial(a) < dateToSerial(b);
}

function isBetween(val: DateValue, start: DateValue, end: DateValue): boolean {
  const s = dateToSerial(val);
  return s >= dateToSerial(start) && s <= dateToSerial(end);
}

export function ZemenDateRangePicker({
  value,
  onChange,
  calendar: viewCalendar = 'ethiopian',
  minDate,
  maxDate,
  themeColor = '#059669',
  locale = 'en',
  className = '',
}: ZemenDateRangePickerProps): React.JSX.Element {
  const nav = useCalendarNavigation(undefined, viewCalendar);
  const { year, month, goToNextMonth, goToPreviousMonth, goToToday } = nav;
  const { weeks } = useMonthGrid(year, month, viewCalendar);

  const [hoverDate, setHoverDate] = React.useState<DateValue | null>(null);
  const [anchorMonth, setAnchorMonth] = React.useState<{ year: number; month: number } | null>(null);

  const rangeStart = value?.start ?? null;
  const rangeEnd = value?.end ?? null;

  // When we have start but no end, show end of month views that include the end range
  const previewEnd = hoverDate && rangeStart && !rangeEnd ? hoverDate : null;

  const effectiveStart = rangeStart;
  const effectiveEnd = previewEnd && rangeStart && isBefore(previewEnd, rangeStart)
    ? rangeStart
    : previewEnd ?? rangeEnd;

  const isInRange = React.useCallback(
    (dv: DateValue): 'start' | 'end' | 'in' | 'none' => {
      if (!effectiveStart) return 'none';
      if (effectiveStart && effectiveEnd) {
        if (dateToKey(dv) === dateToKey(effectiveStart)) return 'start';
        if (dateToKey(dv) === dateToKey(effectiveEnd)) return 'end';
        if (isBetween(dv, effectiveStart, effectiveEnd)) return 'in';
        return 'none';
      }
      if (dateToKey(dv) === dateToKey(effectiveStart)) return 'start';
      return 'none';
    },
    [effectiveStart, effectiveEnd],
  );

  const isPastMin = React.useCallback(
    (dv: DateValue): boolean => {
      if (!minDate) return false;
      return isBefore(dv, minDate);
    },
    [minDate],
  );

  const isBeyondMax = React.useCallback(
    (dv: DateValue): boolean => {
      if (!maxDate) return false;
      return isBefore(maxDate, dv);
    },
    [maxDate],
  );

  const handleDayClick = React.useCallback(
    (dv: DateValue) => {
      if (!onChange) return;
      if (!rangeStart || (rangeStart && rangeEnd)) {
        onChange({ start: dv, end: null });
      } else {
        if (isBefore(dv, rangeStart)) {
          onChange({ start: dv, end: null });
        } else {
          onChange({ start: rangeStart, end: dv });
        }
      }
    },
    [rangeStart, rangeEnd, onChange],
  );

  const firstGreg = React.useMemo(() => {
    for (const week of weeks) {
      for (const cell of week) {
        if (cell.gregorian) return cell.gregorian;
      }
    }
    return { year: 2022, month: 9, day: 11 };
  }, [weeks]);

  const ethMonthName = getMonthName(month, 'am');
  const gregMonthName = GREGORIAN_MONTHS[firstGreg.month - 1];

  return (
    <div className={`rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-[#111827] p-3 font-sans shadow-sm ${className}`}>
      {/* Range summary */}
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className="text-gray-500 dark:text-gray-400 font-medium">
          {rangeStart
            ? `${ETHIOPIAN_MONTHS[rangeStart.month - 1] ?? ''} ${formatNumber(rangeStart.day, locale)}, ${formatNumber(rangeStart.year, locale)}`
            : 'Select start date'}
        </span>
        <span className="text-gray-300 dark:text-gray-600">→</span>
        <span className="text-gray-500 dark:text-gray-400 font-medium">
          {rangeEnd
            ? `${ETHIOPIAN_MONTHS[rangeEnd.month - 1] ?? ''} ${formatNumber(rangeEnd.day, locale)}, ${formatNumber(rangeEnd.year, locale)}`
            : rangeStart ? 'Select end date' : '—'}
        </span>
      </div>

      {/* Nav */}
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 transition-colors duration-150"
          aria-label="Previous month"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="text-center">
          <div className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">
            <span>{ethMonthName}</span>
            <span className="text-gray-400 dark:text-gray-500 font-medium ml-1">({gregMonthName})</span>
          </div>
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 rounded" onClick={goToToday}>
            {formatNumber(year, locale)} <span className="text-gray-300 dark:text-gray-600 mx-1">/</span> {formatNumber(firstGreg.year, locale)}
          </div>
        </div>
        <button
          onClick={goToNextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 transition-colors duration-150"
          aria-label="Next month"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} className="py-1 text-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            {d}
          </div>
        ))}
        {weeks.flatMap((week, wi) =>
          week.map((cell, di) => {
            const dv = cell.ethiopian;
            if (cell.day === null || !dv) {
              return <div key={`${wi}-${di}`} className="h-9" />;
            }
            const rangeState = isInRange(dv);
            const disabled = isPastMin(dv) || isBeyondMax(dv);

            return (
              <button
                key={`${wi}-${di}`}
                disabled={disabled}
                onClick={() => { if (!disabled) handleDayClick(dv); }}
                onMouseEnter={() => setHoverDate(dv)}
                onMouseLeave={() => setHoverDate(null)}
                className={`flex flex-col items-center justify-center rounded-lg h-9 w-full transition-all duration-150 relative overflow-hidden text-sm font-bold leading-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
                  disabled
                    ? 'text-gray-200 dark:text-gray-700 cursor-not-allowed'
                    : rangeState === 'start' || rangeState === 'end'
                      ? themeColor === '#059669'
                        ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm'
                        : 'text-white shadow-sm'
                      : rangeState === 'in'
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200'
                        : cell.isToday
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-300 dark:ring-emerald-600/50 text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                style={(rangeState === 'start' || rangeState === 'end' && themeColor !== '#059669') ? { backgroundColor: themeColor } : {}}
              >
                {formatNumber(cell.day, locale)}
              </button>
            );
          }),
        )}
      </div>

      {/* Calendar toggle */}
      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={goToToday}
          className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 transition-colors duration-150 rounded"
        >
          Today
        </button>
        <button
          onClick={() => {/* handled by consumer via calendar prop change */}}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 transition-colors duration-150"
        >
          {viewCalendar === 'ethiopian' ? '🇪🇹 Ethiopian' : '🇬🇷 Gregorian'}
        </button>
      </div>
    </div>
  );
}
