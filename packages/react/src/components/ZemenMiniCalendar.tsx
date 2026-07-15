'use client';

import * as React from 'react';
import { useMonthGrid } from '../hooks/useMonthGrid';
import { useCalendarNavigation } from '../hooks/useCalendarNavigation';
import { useRovingGridFocus } from '../hooks/useRovingGridFocus';
import { ZemenHolidayBadge } from './ZemenHolidayBadge';
import { toGregorian, toEthiopian, formatNumber } from '@zemen/core';

const ETH_NAMES = ['Meskerem','Tikimt','Hidar','Tahsas','Tir','Yekatit','Megabit','Miazia','Genbot','Sene','Hamle','Nehase','Pagume'];
const GREG_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export type ZemenMiniCalendarProps = {
  calendar?: 'ethiopian' | 'gregorian';
  selectedDate?: { year: number; month: number; day: number } | null;
  onDateSelect?: (date: { year: number; month: number; day: number }) => void;
  showHolidays?: boolean;
  locale?: 'en' | 'am';
  className?: string;
};

export function ZemenMiniCalendar({
  calendar: initialCalendar = 'ethiopian',
  selectedDate,
  onDateSelect,
  showHolidays = false,
  locale = 'en',
  className = '',
}: ZemenMiniCalendarProps): React.JSX.Element {
  const [viewCalendar, setViewCalendar] = React.useState(initialCalendar);
  const nav = useCalendarNavigation(undefined, viewCalendar);
  const { year, month, goToNextMonth, goToPreviousMonth, goToToday } = nav;
  const { weeks } = useMonthGrid(year, month, viewCalendar);

  const rows = weeks.length;
  const cols = 7;

  const grid = useRovingGridFocus({
    rows, cols,
    onActivate: React.useCallback((r: number, c: number) => {
      const cell = weeks[r]?.[c];
      if (cell?.day === null) return;
      if (onDateSelect) {
        const d = viewCalendar === 'ethiopian' && cell?.ethiopian ? cell.ethiopian : cell?.gregorian!;
        onDateSelect({ year: d.year, month: d.month, day: d.day });
      }
    }, [weeks, viewCalendar, onDateSelect]),
    onPageUp: React.useCallback(() => { goToPreviousMonth(); return true; }, [goToPreviousMonth]),
    onPageDown: React.useCallback(() => { goToNextMonth(); return true; }, [goToNextMonth]),
  });

  const todayInfo = React.useMemo(() => {
    const now = new Date();
    const ethNow = toEthiopian(now);
    return {
      greg: { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() },
      eth: { year: ethNow.year, month: ethNow.month, day: ethNow.day },
    };
  }, []);

  const monthLabel = viewCalendar === 'ethiopian' ? `${ETH_NAMES[month - 1]} ${year}` : `${GREG_SHORT[month - 1]} ${year}`;

  return (
    <div className={`font-sans ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <button onClick={goToPreviousMonth} aria-label="Previous month" className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 transition-colors duration-150">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button onClick={goToToday} className="text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 transition-colors duration-150 rounded">
          {monthLabel}
        </button>
        <button onClick={goToNextMonth} aria-label="Next month" className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 transition-colors duration-150">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      <button onClick={() => setViewCalendar((p) => p === 'ethiopian' ? 'gregorian' : 'ethiopian')} className="text-[10px] font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 mb-1.5 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 transition-colors duration-150 rounded">
        {viewCalendar === 'ethiopian' ? '🇪🇹 Ethiopian' : '🇬🇷 Gregorian'}
      </button>

      <div role="grid" aria-label={monthLabel} ref={grid.containerRef} onKeyDown={grid.handleKeyDown}>
        <div role="row" className="grid grid-cols-7 gap-px mb-0.5">
          {WEEKDAY_LABELS.map((d) => (
            <div key={d} role="columnheader" className="text-center text-[10px] font-bold text-gray-400 dark:text-gray-500 py-0.5">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px">
          {weeks.flatMap((week, wi) =>
            week.map((cell, ci) => {
              if (cell.day === null) return <div key={`${wi}-${ci}`} role="gridcell" className="aspect-square" />;

              const isToday = (() => {
                if (viewCalendar === 'ethiopian' && cell.ethiopian) {
                  return cell.ethiopian.year === todayInfo.eth.year && cell.ethiopian.month === todayInfo.eth.month && cell.ethiopian.day === todayInfo.eth.day;
                }
                return cell.gregorian?.year === todayInfo.greg.year && cell.gregorian?.month === todayInfo.greg.month && cell.gregorian?.day === todayInfo.greg.day;
              })();

              const isSel = (() => {
                if (!selectedDate) return false;
                if (viewCalendar === 'ethiopian' && cell.ethiopian) {
                  return cell.ethiopian.year === selectedDate.year && cell.ethiopian.month === selectedDate.month && cell.ethiopian.day === selectedDate.day;
                }
                return cell.gregorian?.year === selectedDate.year && cell.gregorian?.month === selectedDate.month && cell.gregorian?.day === selectedDate.day;
              })();

              return (
                <div
                  key={`${wi}-${ci}`}
                  role="gridcell"
                  tabIndex={grid.getTabIndex(wi, ci)}
                  data-roving-row={wi}
                  data-roving-col={ci}
                  aria-label={cell.ethiopian ? `${ETH_NAMES[cell.ethiopian.month - 1]} ${cell.ethiopian.day}, ${cell.ethiopian.year}` : `${cell.day}`}
                  aria-current={isToday ? 'date' : undefined}
                  onClick={() => {
                    if (onDateSelect) {
                      const d = viewCalendar === 'ethiopian' && cell.ethiopian ? cell.ethiopian : cell.gregorian!;
                      onDateSelect({ year: d.year, month: d.month, day: d.day });
                    }
                  }}
                  className="relative aspect-square outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 rounded-lg"
                >
                  <button
                    tabIndex={-1}
                    className={`w-full h-full flex items-center justify-center rounded-lg text-[11px] font-medium transition-colors duration-150 ${
                      isSel
                        ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm'
                        : isToday
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-300 dark:ring-emerald-600/50 text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {formatNumber(cell.day, locale)}
                  </button>
                  {showHolidays && cell.ethiopian && (
                    <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4">
                      <ZemenHolidayBadge ethiopianMonth={cell.ethiopian.month} ethiopianDay={cell.ethiopian.day} />
                    </div>
                  )}
                </div>
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}
