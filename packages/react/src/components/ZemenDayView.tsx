'use client';

import * as React from 'react';
import { ZemenTaskTimeline } from './ZemenTaskTimeline';
import { ZemenEmptyState } from './ZemenEmptyState';
import { formatNumber } from '@zemen/core';
import type { ViewTask } from '../types';

export type ZemenDayViewProps = {
  date?: Date;
  calendar?: 'ethiopian' | 'gregorian';
  tasks?: ViewTask[];
  startHour?: number;
  endHour?: number;
  onTimeSlotClick?: (hour: number) => void;
  onTaskClick?: (task: ViewTask) => void;
  onTaskReschedule?: (task: ViewTask, newDate: Date, newHour?: number) => void;
  disableDragDrop?: boolean;
  locale?: 'en' | 'am';
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
};

/*
 * Recurring tasks: pass already-expanded occurrences. Expand recurring tasks
 * via @zemen/scheduler's computeOccurrencesInRange before passing them in.
 */
export function ZemenDayView({
  date: initialDate,
  calendar: initialCalendar = 'gregorian',
  tasks = [],
  startHour = 6,
  endHour = 22,
  onTimeSlotClick,
  onTaskClick,
  onTaskReschedule,
  disableDragDrop = false,
  locale = 'en',
  isLoading = false,
  emptyState,
  className = '',
}: ZemenDayViewProps): React.JSX.Element {
  const [viewDate, setViewDate] = React.useState(initialDate ?? new Date());
  const [viewCalendar, setViewCalendar] = React.useState(initialCalendar);

  const goNextDay = () => { const n = new Date(viewDate); n.setDate(n.getDate() + 1); setViewDate(n); };
  const goPrevDay = () => { const p = new Date(viewDate); p.setDate(p.getDate() - 1); setViewDate(p); };
  const goToday = () => setViewDate(new Date());
  const isToday = new Date().toDateString() === viewDate.toDateString();

  const handleTimelineReschedule = React.useCallback((task: ViewTask, newHour?: number) => {
    onTaskReschedule?.(task, viewDate, newHour);
  }, [onTaskReschedule, viewDate]);

  if (isLoading) {
    return (
      <div className={`flex flex-col gap-4 ${className}`}>
        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        <div className="flex flex-col gap-2 pl-16">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-50 dark:bg-gray-800/30 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const showEmpty = tasks.length === 0;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {showEmpty && (emptyState ?? <ZemenEmptyState message="No tasks for this day" description="Add a task or navigate to another day" />)}

      {!showEmpty && (<>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={goPrevDay} aria-label="Previous day" className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button onClick={goNextDay} aria-label="Next day" className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {viewDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            <span className="ml-1.5 text-sm font-normal text-gray-400 dark:text-gray-500">
              {formatNumber(viewDate.getDate(), locale)}
            </span>
          </div>
          {isToday && <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Today</div>}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={goToday} className="px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">Today</button>
          <button onClick={() => setViewCalendar(p => p === 'ethiopian' ? 'gregorian' : 'ethiopian')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Toggle calendar">
            {viewCalendar === 'ethiopian' ? '🇪🇹' : '🇬🇷'}
          </button>
        </div>
      </div>

      <div className="relative pl-16">
        <ZemenTaskTimeline
          date={viewDate}
          tasks={tasks}
          startHour={startHour}
          endHour={endHour}
          onTimeSlotClick={onTimeSlotClick}
          onTaskClick={onTaskClick}
          onTaskReschedule={handleTimelineReschedule}
          disableDragDrop={disableDragDrop}
        />
      </div>
      </>)}
    </div>
  );
}
