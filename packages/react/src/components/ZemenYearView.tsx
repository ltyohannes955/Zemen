'use client';

import * as React from 'react';
import { useMonthGrid } from '../hooks/useMonthGrid';
import { useCalendarNavigation } from '../hooks/useCalendarNavigation';
import { useRovingGridFocus } from '../hooks/useRovingGridFocus';
import { getTasksForDate } from '../lib/task-utils';
import { ZemenCalendarHeader } from './ZemenCalendarHeader';
import { ZemenHolidayBadge } from './ZemenHolidayBadge';
import { ZemenEmptyState } from './ZemenEmptyState';
import { toGregorian, toEthiopian, formatNumber } from '@zemen/core';
import type { ViewTask } from '../types';

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const ETH_NAMES = ['Meskerem','Tikimt','Hidar','Tahsas','Tir','Yekatit','Megabit','Miazia','Genbot','Sene','Hamle','Nehase','Pagume'];
const GREG_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export type MonthClickInfo = {
  month: number;
  year: number;
  calendar: 'ethiopian' | 'gregorian';
};

export type ZemenYearViewProps = {
  year?: number;
  calendar?: 'ethiopian' | 'gregorian';
  tasks?: ViewTask[];
  onMonthClick?: (info: MonthClickInfo) => void;
  onDayClick?: (day: number, month: number, year: number) => void;
  onTaskClick?: (task: ViewTask) => void;
  locale?: 'en' | 'am';
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
};

function MiniMonthGrid({
  year, month, calendar, tasks, onDayClick, onTaskClick, monthLabel, locale,
}: {
  year: number; month: number; calendar: 'ethiopian' | 'gregorian';
  tasks: ViewTask[]; onDayClick: (day: number) => void;
  onTaskClick?: (task: ViewTask) => void; monthLabel: string; locale?: 'en' | 'am';
}): React.JSX.Element {
  const { weeks } = useMonthGrid(year, month, calendar);
  const rows = weeks.length;
  const cols = 7;

  const grid = useRovingGridFocus({
    rows, cols,
    onActivate: React.useCallback((r: number, c: number) => {
      const cell = weeks[r]?.[c];
      if (cell?.day !== null && cell.day !== undefined) onDayClick(cell.day);
    }, [weeks, onDayClick]),
  });

  return (
    <div role="grid" aria-label={`${monthLabel} ${year}`} ref={grid.containerRef} onKeyDown={grid.handleKeyDown} className="rounded-xl border border-gray-100 dark:border-gray-700/50 bg-white dark:bg-[#111827]/50 p-2.5 cursor-pointer hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 transition-all">
      <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 text-center">{monthLabel}</div>
      <div role="row" className="grid grid-cols-7 gap-0">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} role="columnheader" className="text-center text-[10px] font-bold text-gray-400 dark:text-gray-600 py-0.5">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0">
        {weeks.flatMap((week, wi) =>
          week.map((cell, ci) => {
            if (cell.day === null) return <div key={`${wi}-${ci}`} role="gridcell" className="aspect-square" />;
            const tasksForDay = cell.ethiopian ? getTasksForDate(tasks, cell.ethiopian.year, cell.ethiopian.month, cell.ethiopian.day, calendar) : [];
            return (
              <div
                key={`${wi}-${ci}`}
                role="gridcell"
                tabIndex={grid.getTabIndex(wi, ci)}
                data-roving-row={wi}
                data-roving-col={ci}
                aria-label={`${monthLabel} ${cell.day}, ${year}`}
                onClick={() => onDayClick(cell.day!)}
                className={`aspect-square flex flex-col items-center justify-center rounded-sm text-[9px] font-medium relative ${
                  cell.isToday ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/30'
                }`}
              >
                  <span>{formatNumber(cell.day!, locale ?? 'en')}</span>
                {tasksForDay.length > 0 && <div className="w-1 h-1 rounded-full bg-emerald-400 dark:bg-emerald-500 mt-0.5" />}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}

export function ZemenYearView({
  year: controlledYear,
  calendar = 'ethiopian',
  tasks = [],
  onMonthClick,
  onDayClick,
  onTaskClick,
  locale = 'en',
  isLoading = false,
  emptyState,
  className = '',
}: ZemenYearViewProps): React.JSX.Element {
  const nav = useCalendarNavigation(
    controlledYear ? { year: controlledYear, month: 1, day: 1 } : undefined,
    calendar,
  );
  const { year, goToNextYear, goToPreviousYear, goToToday, setDate } = nav;
  const maxMonth = calendar === 'ethiopian' ? 13 : 12;

  const handleCalendarToggle = React.useCallback((newCalendar: 'ethiopian' | 'gregorian') => {
    if (newCalendar === 'ethiopian') {
      const eth = toEthiopian(new Date(Date.UTC(year, 0, 1)));
      setDate(eth.year, 1, 1);
    } else {
      const greg = toGregorian({ year, month: 1, day: 1 });
      setDate(greg.getUTCFullYear(), 1, 1);
    }
  }, [year, setDate]);

  if (isLoading) {
    return (
      <div className={`flex flex-col gap-6 ${className}`}>
        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-700/50 p-2.5">
              <div className="h-4 w-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mx-auto mb-2" />
              <div className="grid grid-cols-7 gap-0">
                {Array.from({ length: 35 }).map((_, j) => (
                  <div key={j} className="aspect-square bg-gray-50 dark:bg-gray-800/30 rounded-sm animate-pulse m-px" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const showEmpty = tasks.length === 0;

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <ZemenCalendarHeader year={year} month={1} calendar={calendar} onPrev={goToPreviousYear} onNext={goToNextYear} onToday={goToToday} onCalendarToggle={handleCalendarToggle} />

      {showEmpty && (emptyState ?? <ZemenEmptyState message="No tasks this year" description="Tasks across all months will appear here" />)}

      {!showEmpty && (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: maxMonth }, (_, i) => i + 1).map((month) => {
          const label = calendar === 'ethiopian' ? ETH_NAMES[month - 1] : GREG_NAMES[month - 1];
          return (
            <div key={month} onClick={() => onMonthClick?.({ month, year, calendar })}>
              <MiniMonthGrid
                year={year}
                month={month}
                calendar={calendar}
                tasks={tasks}
                onDayClick={(d) => onDayClick?.(d, month, year)}
                onTaskClick={onTaskClick}
                monthLabel={label}
                locale={locale}
              />
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
