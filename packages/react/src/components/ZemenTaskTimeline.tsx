'use client';

import * as React from 'react';
import { useDayTimeline } from '../hooks/useDayTimeline';
import { useRovingGridFocus } from '../hooks/useRovingGridFocus';
import { getTasksForDate, parseTaskTime } from '../lib/task-utils';
import { formatNumber } from '@zemen/core';
import type { ViewTask } from '../types';

export type ZemenTaskTimelineProps = {
  date: Date;
  tasks: ViewTask[];
  startHour: number;
  endHour: number;
  onTimeSlotClick?: (hour: number) => void;
  onTaskClick?: (task: ViewTask) => void;
  onTaskReschedule?: (task: ViewTask, newHour?: number) => void;
  disableDragDrop?: boolean;
  compact?: boolean;
  showHeader?: boolean;
  showGridNav?: boolean;
  onGridNavigate?: (dir: 'left' | 'right') => void;
  /** External move task for cross-column move mode (WeekView). When set, overrides internal moveTask. */
  externalMoveTask?: ViewTask | null;
  /** Called when M key activates move mode on a task. */
  onMoveModeChange?: (task: ViewTask | null) => void;
  /** Called when Enter drops in a slot during external move mode. */
  onExternalDrop?: (task: ViewTask, hour: number) => void;
  locale?: 'en' | 'am';
  className?: string;
};

const HOUR_HEIGHT = 60;
const COMPACT_HOUR_HEIGHT = 36;
const TASK_PILL_HEIGHT = 24;

function formatDateHeader(d: Date, locale: 'en' | 'am'): string {
  return `${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()]} ${formatNumber(d.getDate(), locale)}`;
}

function isToday(d: Date): boolean {
  return new Date().toDateString() === d.toDateString();
}

export function ZemenTaskTimeline({
  date,
  tasks,
  startHour,
  endHour,
  onTimeSlotClick,
  onTaskClick,
  onTaskReschedule,
  disableDragDrop = false,
  compact = false,
  showHeader = true,
  showGridNav = false,
  onGridNavigate,
  externalMoveTask,
  onMoveModeChange,
  onExternalDrop,
  locale = 'en',
  className = '',
}: ZemenTaskTimelineProps): React.JSX.Element {
  const today = isToday(date);
  const hourH = compact ? COMPACT_HOUR_HEIGHT : HOUR_HEIGHT;
  const { slots } = useDayTimeline(date, 'gregorian', startHour, endHour);
  const now = new Date();
  const currentMinutes = today ? now.getHours() * 60 + now.getMinutes() : -1;

  const [dropSlot, setDropSlot] = React.useState<number | null>(null);
  const [internalMoveTask, setInternalMoveTask] = React.useState<ViewTask | null>(null);

  // Use external move task if provided, otherwise fall back to internal
  const effectiveMoveTask = externalMoveTask !== undefined ? externalMoveTask : internalMoveTask;
  const setEffectiveMoveTask = externalMoveTask !== undefined
    ? (task: ViewTask | null) => onMoveModeChange?.(task)
    : setInternalMoveTask;

  const rows = endHour - startHour;
  const cols = 1;

  const grid = useRovingGridFocus({
    rows, cols,
    onActivate: React.useCallback((r: number) => {
      const task = externalMoveTask !== undefined ? externalMoveTask : internalMoveTask;
      if (task && (onExternalDrop ?? onTaskReschedule)) {
        if (onExternalDrop) {
          onExternalDrop(task, startHour + r);
        } else {
          onTaskReschedule?.(task, startHour + r);
        }
        if (externalMoveTask === undefined) setInternalMoveTask(null);
        else onMoveModeChange?.(null);
      } else {
        onTimeSlotClick?.(startHour + r);
      }
    }, [externalMoveTask, internalMoveTask, startHour, onExternalDrop, onTaskReschedule, onTimeSlotClick, onMoveModeChange]),
  });

  const handleContainerKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      if (showGridNav && onGridNavigate) {
        e.preventDefault();
        onGridNavigate(e.key === 'ArrowLeft' ? 'left' : 'right');
        return;
      }
    }
    if (e.key === 'Escape' && effectiveMoveTask) {
      setEffectiveMoveTask(null);
      return;
    }
    grid.handleKeyDown(e);
  }, [showGridNav, onGridNavigate, effectiveMoveTask, setEffectiveMoveTask, grid]);

  const taskPosition = (time: string | null): { top: number; slotIndex: number } | null => {
    const parsed = parseTaskTime(time);
    if (!parsed) return null;
    const totalMinutes = parsed.hour * 60 + parsed.minute;
    if (totalMinutes < startHour * 60 || totalMinutes >= endHour * 60) return null;
    const slotIndex = parsed.hour - startHour;
    return { top: slotIndex * hourH + (parsed.minute / 60) * hourH, slotIndex };
  };

  const tasksForDate = React.useMemo(
    () => getTasksForDate(tasks, date.getFullYear(), date.getMonth() + 1, date.getDate(), 'gregorian'),
    [tasks, date],
  );

  const allDayTasks = React.useMemo(() => tasksForDate.filter((t) => t.isAllDay), [tasksForDate]);

  const timedTasks = React.useMemo(() => tasksForDate.filter((t) => !t.isAllDay), [tasksForDate]);

  const positionedTasks = React.useMemo(
    () => timedTasks
      .map((t) => ({ task: t, pos: taskPosition(t.time) }))
      .filter((t) => t.pos !== null)
      .sort((a, b) => (a.pos?.top ?? 0) - (b.pos?.top ?? 0)),
    [timedTasks],
  );

  const unscheduledTasks = React.useMemo(() => timedTasks.filter((t) => !t.time), [timedTasks]);

  return (
    <div className={`relative ${className}`}>
      {showHeader && (
        <div className={`text-center pb-1.5 border-b border-gray-100 dark:border-gray-700 mb-0 ${compact ? 'text-[11px]' : 'text-sm'}`}>
          <div className={`font-bold ${today ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-gray-100'}`}>
            {formatDateHeader(date, locale)}
          </div>
          {today && <div className="text-[10px] font-semibold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider">Today</div>}
        </div>
      )}

      {allDayTasks.length > 0 && (
        <div className="border-b-2 border-double border-emerald-200 dark:border-emerald-800 pb-1 mb-1">
          <div className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider mb-0.5">All Day</div>
          {allDayTasks.map((task) => (
            <button
              key={task.id}
              data-task-id={task.id}
              draggable={!disableDragDrop}
              onDragStart={(e) => { if (!disableDragDrop) { e.dataTransfer.setData('text/plain', task.id); e.dataTransfer.effectAllowed = 'move'; } }}
              onClick={() => onTaskClick?.(task)}
              onKeyDown={(e) => { if ((e.key === 'm' || e.key === 'M') && !disableDragDrop) { e.preventDefault(); setEffectiveMoveTask(task); } }}
              aria-label={`${task.title}, All-day, Priority: ${task.priority}`}
              className={`w-full text-left truncate rounded px-1.5 font-medium transition-colors ${compact ? 'text-[10px] leading-5' : 'text-xs leading-6'} ${
                task.priority === 'high' || task.priority === 'urgent'
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300'
                  : task.priority === 'medium'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-300'
                    : task.priority === 'low'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              } ${effectiveMoveTask?.id === task.id ? 'ring-2 ring-emerald-400' : ''}`}
            >
              {task.title}
            </button>
          ))}
        </div>
      )}

      {unscheduledTasks.length > 0 && (
        <div className={`border-b border-dashed border-gray-200 dark:border-gray-700 pb-1 ${compact ? '' : 'py-1'}`}>
          {unscheduledTasks.map((task) => (
            <button
              key={task.id}
              data-task-id={task.id}
              draggable={!disableDragDrop}
              onDragStart={(e) => { if (!disableDragDrop) { e.dataTransfer.setData('text/plain', task.id); e.dataTransfer.effectAllowed = 'move'; } }}
              onClick={() => onTaskClick?.(task)}
              onKeyDown={(e) => { if ((e.key === 'm' || e.key === 'M') && !disableDragDrop) { e.preventDefault(); setEffectiveMoveTask(task); } }}
              aria-label={`${task.title}, Priority: ${task.priority}`}
              className={`w-full text-left truncate rounded px-1.5 font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${compact ? 'text-[10px] leading-5' : 'text-xs leading-6'} ${effectiveMoveTask?.id === task.id ? 'ring-2 ring-emerald-400' : ''}`}
            >
              {task.title}
            </button>
          ))}
        </div>
      )}

      <div ref={grid.containerRef} onKeyDown={handleContainerKeyDown}           role={showGridNav ? 'grid' : undefined} aria-label={`${formatDateHeader(date, locale)} schedule`} className="relative" style={{ height: (endHour - startHour) * hourH }}>
        {slots.map((slot) => {
          const slotIndex = slot.hour - startHour;
          const isMoveTarget = effectiveMoveTask && grid.focusRow === slotIndex;
          return (
            <div
              key={slot.hour}
              role="gridcell"
              tabIndex={grid.getTabIndex(slotIndex, 0)}
              data-roving-row={slotIndex}
              data-roving-col={0}
              aria-label={`${slot.displayLabel}${today && slot.hour === now.getHours() ? ', current hour' : ''}`}
              onDragOver={(e) => { if (!disableDragDrop) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDropSlot(slot.hour); } }}
              onDragLeave={() => setDropSlot(null)}
              onDrop={(e) => {
                e.preventDefault(); setDropSlot(null);
                if (disableDragDrop || !onTaskReschedule) return;
                const taskId = e.dataTransfer.getData('text/plain');
                const task = tasksForDate.find((t) => t.id === taskId);
                if (task) onTaskReschedule(task, slot.hour);
              }}
              className="absolute left-0 right-0"
              style={{ top: slotIndex * hourH, height: hourH }}
            >
              {!compact && (
                <div className="absolute -left-14 top-0 w-12 text-right pr-2 text-[11px] font-medium text-gray-400 dark:text-gray-500 leading-none pt-1">
                  {slot.displayLabel}
                </div>
              )}
              <div
                className={`absolute left-0 right-0 top-0 border-t cursor-pointer transition-colors ${
                  isMoveTarget
                    ? 'border-emerald-400 bg-emerald-50/40 dark:bg-emerald-900/20'
                    : dropSlot === slot.hour
                      ? 'border-emerald-400 bg-emerald-50/40 dark:bg-emerald-900/20'
                      : 'border-gray-100 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
                }`}
                style={{ height: hourH }}
                onClick={() => onTimeSlotClick?.(slot.hour)}
              />
            </div>
          );
        })}

        {positionedTasks.map(({ task, pos }) => (
          <button
            key={task.id}
            data-task-id={task.id}
            draggable={!disableDragDrop}
            onDragStart={(e) => { if (!disableDragDrop) { e.dataTransfer.setData('text/plain', task.id); e.dataTransfer.effectAllowed = 'move'; } }}
            onClick={() => onTaskClick?.(task)}
            onKeyDown={(e) => { if ((e.key === 'm' || e.key === 'M') && !disableDragDrop) { e.preventDefault(); setEffectiveMoveTask(task); } }}
            aria-label={`${task.title}${task.time ? ` at ${task.time}` : ''}, Priority: ${task.priority}`}
            className={`absolute left-1 right-1 z-10 rounded px-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-left font-medium shadow-sm transition-all hover:shadow-md ${
              compact ? 'text-[10px] leading-5' : 'text-xs leading-6'
            } ${
              effectiveMoveTask?.id === task.id ? 'ring-2 ring-emerald-400 dark:ring-emerald-500' : ''
            } ${
              task.priority === 'high' || task.priority === 'urgent'
                ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-l-2 border-red-400'
                : task.priority === 'medium'
                  ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-l-2 border-yellow-400'
                  : task.priority === 'low'
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-2 border-blue-400'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-l-2 border-gray-300 dark:border-gray-600'
            }`}
            style={{ top: pos!.top, height: compact ? COMPACT_HOUR_HEIGHT - 8 : TASK_PILL_HEIGHT }}
          >
            {task.title}
          </button>
        ))}

        {today && currentMinutes >= startHour * 60 && currentMinutes < endHour * 60 && (
          <div className="absolute left-0 right-0 z-20 pointer-events-none" style={{ top: ((currentMinutes - startHour * 60) / 60) * hourH }}>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
              <div className="flex-1 border-t border-red-500" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
