'use client';

import * as React from 'react';
import { getWeekDates } from '../lib/task-utils';
import { ZemenCalendarHeader } from './ZemenCalendarHeader';
import { ZemenTaskTimeline } from './ZemenTaskTimeline';
import { ZemenEmptyState } from './ZemenEmptyState';
import type { ViewTask } from '../types';

export type ZemenWeekViewProps = {
  date?: Date;
  calendar?: 'ethiopian' | 'gregorian';
  tasks?: ViewTask[];
  startHour?: number;
  endHour?: number;
  onTimeSlotClick?: (date: Date, hour: number) => void;
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
export function ZemenWeekView({
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
}: ZemenWeekViewProps): React.JSX.Element {
  const [focusDate, setFocusDate] = React.useState(initialDate ?? new Date());
  const [viewCalendar, setViewCalendar] = React.useState(initialCalendar);
  const [focusedCol, setFocusedCol] = React.useState(0);
  const [weekMoveTask, setWeekMoveTask] = React.useState<ViewTask | null>(null);

  const weekDates = React.useMemo(() => getWeekDates(focusDate), [focusDate]);

  const goNextWeek = React.useCallback(() => {
    setFocusDate((prev) => { const n = new Date(prev); n.setDate(n.getDate() + 7); return n; });
    setWeekMoveTask(null);
  }, []);

  const goPrevWeek = React.useCallback(() => {
    setFocusDate((prev) => { const p = new Date(prev); p.setDate(p.getDate() - 7); return p; });
    setWeekMoveTask(null);
  }, []);

  const goToday = React.useCallback(() => {
    setFocusDate(new Date());
    setFocusedCol(new Date().getDay());
    setWeekMoveTask(null);
  }, []);

  const timelineRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const focusColumn = React.useCallback((col: number) => {
    if (col < 0 || col > 6) return;
    setFocusedCol(col);
    const el = timelineRefs.current[col];
    if (el) {
      const firstCell = el.querySelector('[data-roving-row="0"]') as HTMLElement | null;
      firstCell?.focus();
    }
  }, []);

  const focusPrevCol = React.useCallback(() => focusColumn(focusedCol - 1), [focusedCol, focusColumn]);
  const focusNextCol = React.useCallback(() => focusColumn(focusedCol + 1), [focusedCol, focusColumn]);

  const handleWeekKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && weekMoveTask) {
      setWeekMoveTask(null);
      return;
    }
    if (e.key === 'Tab') {
      const container = e.currentTarget;
      const columns = container.querySelectorAll('[data-week-column]');
      const currentIdx = focusedCol;
      if (e.shiftKey && currentIdx > 0) {
        e.preventDefault();
        focusColumn(currentIdx - 1);
      } else if (!e.shiftKey && currentIdx < 6) {
        e.preventDefault();
        focusColumn(currentIdx + 1);
      }
    }
  }, [focusedCol, focusColumn, weekMoveTask]);

  const focusYear = focusDate.getFullYear();
  const focusMonth = focusDate.getMonth() + 1;

  if (isLoading) {
    return (
      <div className={`flex flex-col gap-4 ${className}`}>
        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              {Array.from({ length: 8 }).map((_, j) => (
                <div key={j} className="h-12 bg-gray-50 dark:bg-gray-800/30 rounded-lg animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const showEmpty = tasks.length === 0;

  return (
    <div className={`flex flex-col gap-4 ${className}`} onKeyDown={handleWeekKeyDown}>
      {showEmpty && (emptyState ?? <ZemenEmptyState message="No tasks this week" description="Tasks will appear across the 7-day schedule" />)}

      {!showEmpty && (<>
      <ZemenCalendarHeader
        year={focusYear}
        month={focusMonth}
        calendar={viewCalendar}
        onPrev={goPrevWeek}
        onNext={goNextWeek}
        onToday={goToday}
        onCalendarToggle={setViewCalendar}
      />

      <div role="grid" aria-label="Weekly schedule" className="grid grid-cols-7 gap-2 flex-1">
        {weekDates.map((d, i) => (
          <div
            key={i}
            data-week-column={i}
            ref={(el) => { timelineRefs.current[i] = el; }}
            className="flex flex-col min-w-0"
            role="gridcell"
            tabIndex={focusedCol === i ? 0 : -1}
            data-roving-row={0}
            data-roving-col={i}
          >
              <ZemenTaskTimeline
              date={d}
              tasks={tasks}
              startHour={startHour}
              endHour={endHour}
              onTimeSlotClick={(hour) => onTimeSlotClick?.(d, hour)}
              onTaskClick={onTaskClick}
              onTaskReschedule={onTaskReschedule ? ((task, newHour) => onTaskReschedule(task, d, newHour)) : undefined}
              disableDragDrop={disableDragDrop}
              compact={true}
              showHeader={true}
              showGridNav={true}
              onGridNavigate={(dir) => dir === 'left' ? focusPrevCol() : focusNextCol()}
              locale={locale}
              externalMoveTask={weekMoveTask}
              onMoveModeChange={setWeekMoveTask}
              onExternalDrop={onTaskReschedule ? ((task, hour) => onTaskReschedule(task, d, hour)) : undefined}
            />
          </div>
        ))}
      </div>
      </>)}
    </div>
  );
}
