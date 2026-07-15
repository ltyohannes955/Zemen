'use client';

import * as React from 'react';
import { useMonthGrid } from '../hooks/useMonthGrid';
import { useCalendarNavigation } from '../hooks/useCalendarNavigation';
import { useRovingGridFocus } from '../hooks/useRovingGridFocus';
import { getMonthName, toEthiopian, formatNumber } from '@zemen/core';
import type { Locale } from '@zemen/core';

const ETH_MONTH_NAMES = [
  'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
  'Megabit', 'Miazia', 'Genbot', 'Sene', 'Hamle', 'Nehase', 'Pagume',
];

const GREG_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export type SelectedDateInfo = {
  ethYear: number;
  ethMonth: number;
  ethDay: number;
  gregYear: number;
  gregMonth: number;
  gregDay: number;
};

const WEEKDAY_LABELS: Record<string, string[]> = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  am: ['እሁ', 'ሰኞ', 'ማክ', 'ረቡ', 'ሐሙ', 'ዓር', 'ቅዳ'],
};

export type ZemenCalendarProps = {
  locale?: Locale;
  onSelectDate?: (date: SelectedDateInfo) => void;
  selectedDate?: { ethYear: number; ethMonth: number; ethDay: number } | null;
  themeColor?: string;
  className?: string;
  calendar?: 'ethiopian' | 'gregorian';
};

function formatAriaLabel(day: number, month: number, year: number, calendar: 'ethiopian' | 'gregorian', eth: { year: number; month: number; day: number } | null, greg: { year: number; month: number; day: number } | null): string {
  if (calendar === 'ethiopian') {
    const ethName = ETH_MONTH_NAMES[month - 1] ?? '';
    const gregStr = greg ? `${GREG_MONTH_NAMES[greg.month - 1]} ${greg.day}, ${greg.year}` : '';
    return `${ethName} ${day}, ${year} — ${gregStr}`;
  }
  const gregName = GREG_MONTH_NAMES[month - 1] ?? '';
  const ethStr = eth ? `${ETH_MONTH_NAMES[eth.month - 1]} ${eth.day}, ${eth.year}` : '';
  return `${gregName} ${day}, ${year} — ${ethStr}`;
}

export function ZemenCalendar({
  locale = 'en',
  onSelectDate,
  selectedDate,
  themeColor = '#059669',
  className = '',
  calendar: viewCalendar = 'ethiopian',
}: ZemenCalendarProps): React.JSX.Element {
  const nav = useCalendarNavigation(undefined, viewCalendar);
  const { year, month, goToNextMonth, goToPreviousMonth, goToToday } = nav;
  const { weeks } = useMonthGrid(year, month, viewCalendar);

  const ethToday = React.useMemo(() => toEthiopian(new Date()), []);
  const weekdays = WEEKDAY_LABELS[locale] || WEEKDAY_LABELS.en;

  const firstGreg = React.useMemo(() => {
    for (const week of weeks) {
      for (const cell of week) {
        if (cell.gregorian) return cell.gregorian;
      }
    }
    return { year: 2022, month: 9, day: 11 };
  }, [weeks]);

  const rows = weeks.length;
  const cols = 7;

  const todayRow = React.useMemo(() => {
    if (viewCalendar !== 'ethiopian') return -1;
    for (let r = 0; r < weeks.length; r++) {
      for (let c = 0; c < 7; c++) {
        const cell = weeks[r][c];
        if (cell.ethiopian && cell.ethiopian.year === ethToday.year && cell.ethiopian.month === ethToday.month && cell.ethiopian.day === ethToday.day) {
          return r;
        }
      }
    }
    return 0;
  }, [weeks, viewCalendar, ethToday]);

  const todayCol = React.useMemo(() => {
    if (viewCalendar !== 'ethiopian') return 0;
    for (let r = 0; r < weeks.length; r++) {
      for (let c = 0; c < 7; c++) {
        const cell = weeks[r][c];
        if (cell.ethiopian && cell.ethiopian.year === ethToday.year && cell.ethiopian.month === ethToday.month && cell.ethiopian.day === ethToday.day) {
          return c;
        }
      }
    }
    return 0;
  }, [weeks, viewCalendar, ethToday]);

  const grid = useRovingGridFocus({
    rows,
    cols,
    defaultRow: todayRow >= 0 ? todayRow : 0,
    defaultCol: todayCol >= 0 ? todayCol : 0,
    onActivate: React.useCallback((r: number, c: number) => {
      const cell = weeks[r]?.[c];
      if (!cell || cell.day === null || !cell.ethiopian || !cell.gregorian) return;
      onSelectDate?.({
        ethYear: cell.ethiopian.year,
        ethMonth: cell.ethiopian.month,
        ethDay: cell.ethiopian.day,
        gregYear: cell.gregorian.year,
        gregMonth: cell.gregorian.month,
        gregDay: cell.gregorian.day,
      });
    }, [weeks, onSelectDate]),
    onPageUp: React.useCallback(() => { goToPreviousMonth(); return true; }, [goToPreviousMonth]),
    onPageDown: React.useCallback(() => { goToNextMonth(); return true; }, [goToNextMonth]),
  });

  const isDefaultTheme = themeColor === '#059669';
  const ethMonthName = getMonthName(month, 'am');
  const gregMonthName = GREG_MONTH_NAMES[firstGreg.month - 1];

  return (
    <div className={`rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-[#111827] p-3 font-sans shadow-sm ${className}`}>
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
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5" onClick={goToToday}>
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

      <div
        ref={grid.containerRef}
        role="grid"
        aria-label={`${ethMonthName} ${year} calendar`}
        onKeyDown={grid.handleKeyDown}
      >
        <div role="row" className="grid grid-cols-7 gap-0.5 mb-0.5">
          {weekdays.map((d) => (
            <div key={d} role="columnheader" className="py-1 text-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} role="row" className="grid grid-cols-7 gap-0.5">
            {week.map((cell, ci) => {
              if (cell.day === null) {
                return <div key={ci} role="gridcell" className="h-9" />;
              }
              const isToday = viewCalendar === 'ethiopian' && cell.ethiopian &&
                cell.ethiopian.year === ethToday.year && cell.ethiopian.month === ethToday.month && cell.ethiopian.day === ethToday.day;
              const isSelected = selectedDate && cell.ethiopian &&
                selectedDate.ethYear === cell.ethiopian.year && selectedDate.ethMonth === cell.ethiopian.month && selectedDate.ethDay === cell.ethiopian.day;
              const ariaLabel = formatAriaLabel(cell.day, month, year, viewCalendar, cell.ethiopian, cell.gregorian);

              return (
                <div
                  key={ci}
                  role="gridcell"
                  tabIndex={grid.getTabIndex(wi, ci)}
                  data-roving-row={wi}
                  data-roving-col={ci}
                  aria-label={ariaLabel}
                  aria-current={isToday ? 'date' : undefined}
                  onClick={() => {
                    if (cell.ethiopian && cell.gregorian) {
                      onSelectDate?.({
                        ethYear: cell.ethiopian.year,
                        ethMonth: cell.ethiopian.month,
                        ethDay: cell.ethiopian.day,
                        gregYear: cell.gregorian.year,
                        gregMonth: cell.gregorian.month,
                        gregDay: cell.gregorian.day,
                      });
                    }
                  }}
                  className={`flex flex-col items-center justify-center rounded-lg h-9 w-full transition-all duration-150 relative overflow-hidden cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
                    isSelected
                      ? isDefaultTheme
                        ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm transform scale-[1.02]'
                        : 'text-white shadow-sm transform scale-[1.02]'
                      : isToday
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-300 dark:ring-emerald-600/50 text-emerald-700 dark:text-emerald-300 font-bold'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                  style={isSelected && !isDefaultTheme ? { backgroundColor: themeColor } : {}}
                >
                  <span className={`text-sm font-bold leading-none mb-0.5 ${isSelected ? 'text-white' : ''}`}>
                    {formatNumber(cell.day, locale)}
                  </span>
                  <span className={`text-[10px] leading-none ${isSelected ? 'text-white/80' : 'text-gray-400 dark:text-gray-500 font-medium'}`}>
                    {formatNumber(cell.gregorian?.day ?? 0, locale)}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
