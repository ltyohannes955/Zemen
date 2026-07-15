'use client';

import * as React from 'react';
import { useMonthGrid } from '../hooks/useMonthGrid';
import { useCalendarNavigation } from '../hooks/useCalendarNavigation';
import { useRovingGridFocus } from '../hooks/useRovingGridFocus';
import { getTasksForDate } from '../lib/task-utils';
import { ZemenCalendarHeader } from './ZemenCalendarHeader';
import { toGregorian, toEthiopian, formatNumber } from '@zemen/core';
import { ZemenEmptyState } from './ZemenEmptyState';
import type { ViewTask } from '../types';
import type { DayCell } from '../hooks/useMonthGrid';

const ETH_MONTH_NAMES = [
  'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
  'Megabit', 'Miazia', 'Genbot', 'Sene', 'Hamle', 'Nehase', 'Pagume',
];
const GREG_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MAX_VISIBLE_TASKS = 3;

export type DayClickInfo = {
  day: number;
  month: number;
  year: number;
  calendar: 'ethiopian' | 'gregorian';
  ethiopian: { year: number; month: number; day: number };
  gregorian: { year: number; month: number; day: number };
};

export type ZemenMonthViewProps = {
  year?: number;
  month?: number;
  calendar?: 'ethiopian' | 'gregorian';
  tasks?: ViewTask[];
  onDayClick?: (info: DayClickInfo) => void;
  onTaskClick?: (task: ViewTask) => void;
  onTaskReschedule?: (task: ViewTask, newDate: { year: number; month: number; day: number }) => void;
  disableDragDrop?: boolean;
  renderDay?: (cell: DayCell, tasksForDay: ViewTask[]) => React.ReactNode;
  locale?: 'en' | 'am';
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
};

function formatAriaLabel(
  day: number, month: number, year: number,
  calendar: 'ethiopian' | 'gregorian',
  eth: { year: number; month: number; day: number } | null,
  greg: { year: number; month: number; day: number } | null,
): string {
  if (calendar === 'ethiopian') {
    const ethName = ETH_MONTH_NAMES[month - 1] ?? '';
    const gregStr = greg ? `${GREG_MONTH_NAMES[greg.month - 1]} ${greg.day}, ${greg.year}` : '';
    return `${ethName} ${day}, ${year} — ${gregStr}`;
  }
  const gregName = GREG_MONTH_NAMES[month - 1] ?? '';
  const ethStr = eth ? `${ETH_MONTH_NAMES[eth.month - 1]} ${eth.day}, ${eth.year}` : '';
  return `${gregName} ${day}, ${year} — ${ethStr}`;
}

/*
 * Recurring tasks: pass already-expanded occurrences. The view does not call
 * computeOccurrencesInRange — use @zemen/scheduler's recurrence utilities
 * to expand recurring tasks before passing them in as tasks[].
 */
export function ZemenMonthView({
  year: controlledYear,
  month: controlledMonth,
  calendar = 'ethiopian',
  tasks = [],
  onDayClick,
  onTaskClick,
  onTaskReschedule,
  disableDragDrop = false,
  renderDay,
  locale = 'en',
  isLoading = false,
  emptyState,
  className = '',
}: ZemenMonthViewProps): React.JSX.Element {
  const isControlled = controlledYear !== undefined && controlledMonth !== undefined;
  const nav = useCalendarNavigation(
    isControlled ? { year: controlledYear!, month: controlledMonth!, day: 1 } : undefined,
    calendar,
  );
  const { year, month, goToNextMonth, goToPreviousMonth, goToToday, setDate } = nav;
  const { weeks } = useMonthGrid(year, month, calendar);

  const [dropTarget, setDropTarget] = React.useState<string | null>(null);
  const [moveTask, setMoveTask] = React.useState<ViewTask | null>(null);
  const liveRef = React.useRef<HTMLDivElement>(null);

  const rows = weeks.length;
  const cols = 7;

  const grid = useRovingGridFocus({
    rows, cols,
    onActivate: React.useCallback((r: number, c: number) => {
      const cell = weeks[r]?.[c];
      if (!cell || cell.day === null) return;
      onDayClick?.({
        day: cell.day, month, year, calendar,
        ethiopian: cell.ethiopian ?? { year: 0, month: 0, day: 0 },
        gregorian: cell.gregorian ?? { year: 0, month: 0, day: 0 },
      });
    }, [weeks, month, year, calendar, onDayClick]),
    onPageUp: React.useCallback(() => { goToPreviousMonth(); return true; }, [goToPreviousMonth]),
    onPageDown: React.useCallback(() => { goToNextMonth(); return true; }, [goToNextMonth]),
  });

  const handleContainerKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (moveTask && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      e.stopPropagation();
      const cell = weeks[grid.focusRow]?.[grid.focusCol];
      if (cell?.ethiopian && onTaskReschedule) {
        onTaskReschedule(moveTask, cell.ethiopian);
        if (liveRef.current) {
          liveRef.current.textContent = `Task "${moveTask.title}" moved to ${ETH_MONTH_NAMES[cell.ethiopian.month - 1]} ${cell.ethiopian.day}`;
        }
      }
      setMoveTask(null);
      return;
    }
    if (e.key === 'Escape' && moveTask) {
      setMoveTask(null);
      return;
    }
    grid.handleKeyDown(e);
  }, [moveTask, weeks, grid, onTaskReschedule]);

  const announce = React.useCallback((msg: string) => {
    if (liveRef.current) liveRef.current.textContent = msg;
  }, []);

  const handleCalendarToggle = React.useCallback((newCalendar: 'ethiopian' | 'gregorian') => {
    if (newCalendar === 'ethiopian') {
      const eth = toEthiopian(new Date(Date.UTC(year, month - 1, 1)));
      setDate(eth.year, eth.month, 1);
    } else {
      const greg = toGregorian({ year, month, day: 1 });
      setDate(greg.getUTCFullYear(), greg.getUTCMonth() + 1, 1);
    }
  }, [year, month, setDate]);

  const handleDragStart = React.useCallback((e: React.DragEvent, task: ViewTask) => {
    if (disableDragDrop) { e.preventDefault(); return; }
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  }, [disableDragDrop]);

  const handleDragOver = React.useCallback((e: React.DragEvent, cellKey: string) => {
    if (disableDragDrop) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget(cellKey);
  }, [disableDragDrop]);

  const handleDragLeave = React.useCallback(() => setDropTarget(null), []);

  const handleDrop = React.useCallback((e: React.DragEvent, cellKey: string, cellEth: { year: number; month: number; day: number } | null) => {
    e.preventDefault();
    setDropTarget(null);
    if (disableDragDrop || !onTaskReschedule || !cellEth) return;
    const taskId = e.dataTransfer.getData('text/plain');
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      onTaskReschedule(task, cellEth);
      announce(`Task "${task.title}" moved to ${ETH_MONTH_NAMES[cellEth.month - 1]} ${cellEth.day}`);
    }
  }, [disableDragDrop, onTaskReschedule, tasks, announce]);

  if (isLoading) {
    return (
      <div className={`flex flex-col gap-4 ${className}`}>
        <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-7 gap-px">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="min-h-[90px] bg-gray-50 dark:bg-gray-800/30 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const showEmpty = tasks.length === 0;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div aria-live="polite" ref={liveRef} className="sr-only" />

      <div className="print:hidden">
        <ZemenCalendarHeader
          year={year}
          month={month}
          calendar={calendar}
          onPrev={goToPreviousMonth}
          onNext={goToNextMonth}
          onToday={goToToday}
          onCalendarToggle={handleCalendarToggle}
        />
      </div>
      <div className="hidden print:block text-center text-lg font-bold text-gray-900">
        {calendar === 'ethiopian' ? ETH_MONTH_NAMES[month - 1] ?? month : GREG_MONTH_NAMES[month - 1] ?? month} {year}
      </div>

      {showEmpty && (emptyState ?? <ZemenEmptyState message="No tasks this month" description="Add a task to get started" />)}

      {!showEmpty && (
      <div role="grid" aria-label={`${ETH_MONTH_NAMES[month - 1] ?? month} ${year} tasks`} ref={grid.containerRef} onKeyDown={handleContainerKeyDown}>
        <div role="row" className="grid grid-cols-7 gap-px mb-px">
          {WEEKDAY_LABELS.map((d) => (
            <div key={d} role="columnheader" className="py-2 text-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px flex-1">
          {weeks.flatMap((week, wi) =>
            week.map((cell, ci) => {
              if (cell.day === null) {
                return <div key={`${wi}-${ci}`} role="gridcell" className="min-h-[90px] bg-gray-50/30 dark:bg-gray-900/10 rounded-lg" />;
              }

              const tasksForDay = cell.ethiopian
                ? getTasksForDate(tasks, cell.ethiopian.year, cell.ethiopian.month, cell.ethiopian.day, calendar)
                : [];

              if (renderDay) {
                return <div key={`${wi}-${ci}`} role="gridcell" className="min-h-[90px]">{renderDay(cell, tasksForDay)}</div>;
              }

              const dayInfo: DayClickInfo = {
                day: cell.day, month, year, calendar,
                ethiopian: cell.ethiopian ?? { year: 0, month: 0, day: 0 },
                gregorian: cell.gregorian ?? { year: 0, month: 0, day: 0 },
              };

              const visibleTasks = tasksForDay.slice(0, MAX_VISIBLE_TASKS);
              const overflowCount = tasksForDay.length - MAX_VISIBLE_TASKS;
              const cellKey = `${wi}-${ci}`;
              const isDropTarget = dropTarget === cellKey;
              const isMoveTarget = moveTask && grid.focusRow === wi && grid.focusCol === ci;
              const ariaLabel = `${formatAriaLabel(cell.day, month, year, calendar, cell.ethiopian, cell.gregorian)}${tasksForDay.length > 0 ? `, ${tasksForDay.length} tasks` : ''}`;

              return (
                <div
                  key={cellKey}
                  role="gridcell"
                  tabIndex={grid.getTabIndex(wi, ci)}
                  data-roving-row={wi}
                  data-roving-col={ci}
                  aria-label={ariaLabel}
                  aria-current={cell.isToday ? 'date' : undefined}
                  onDragOver={(e) => handleDragOver(e, cellKey)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, cellKey, cell.ethiopian)}
                  onClick={() => onDayClick?.(dayInfo)}
                  className={`min-h-[90px] rounded-lg p-1.5 border flex flex-col gap-0.5 transition-colors cursor-pointer print:bg-white print:text-black print:shadow-none print:border-gray-300 ${
                    isMoveTarget
                      ? 'border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 ring-2 ring-emerald-400 dark:ring-emerald-500'
                      : isDropTarget
                        ? 'border-emerald-400 dark:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-900/20'
                        : cell.isToday
                          ? 'bg-emerald-50/60 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                          : 'border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/30'
                  }`}
                >
                  <div                       className={`text-sm font-bold leading-none mb-0.5 print:text-black ${
                    cell.isToday
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : cell.isWeekend
                        ? 'text-gray-400 dark:text-gray-500'
                        : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {formatNumber(cell.day, locale)}
                    {cell.gregorian && (
                      <span className="ml-1 text-[10px] font-normal text-gray-400 dark:text-gray-500">{formatNumber(cell.gregorian.day, locale)}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
                    {visibleTasks.map((task) => (
                      <button
                        key={task.id}
                        data-task-id={task.id}
                        draggable={!disableDragDrop}
                        onDragStart={(e) => handleDragStart(e, task)}
                        onClick={(e) => { e.stopPropagation(); onTaskClick?.(task); }}
                        onKeyDown={(e) => {
                          if ((e.key === 'm' || e.key === 'M') && !disableDragDrop) {
                            e.preventDefault();
                            e.stopPropagation();
                            setMoveTask(task);
                          }
                        }}
                        aria-label={`${task.title}${task.time ? ` at ${task.time}` : ''}${task.isAllDay ? ', All-day' : ''}, Priority: ${task.priority}`}
                        className={`text-[11px] leading-tight truncate rounded px-1 py-0.5 text-left font-medium transition-colors ${
                          moveTask?.id === task.id ? 'ring-2 ring-emerald-400 dark:ring-emerald-500' : ''
                        } ${
                          task.isAllDay
                            ? 'border border-dashed border-emerald-300 dark:border-emerald-700'
                            : ''
                        } ${
                          task.priority === 'high' || task.priority === 'urgent'
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300'
                            : task.priority === 'medium'
                              ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-300'
                              : task.priority === 'low'
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300'
                                : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {task.isAllDay && <span className="mr-0.5 opacity-60" aria-hidden="true">↔</span>}
                        {task.title}
                      </button>
                    ))}
                    {overflowCount > 0 && (
                      <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 px-1">
                        +{overflowCount} more
                      </div>
                    )}
                  </div>
                </div>
              );
            }),
          )}
        </div>
      </div>
      )}
    </div>
  );
}
