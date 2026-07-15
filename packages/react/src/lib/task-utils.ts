import { toEthiopian, toGregorian } from '@zemen/core';
import type { ViewTask } from '../types';

function serialDate(year: number, month: number, day: number): number {
  return year * 10000 + month * 100 + day;
}

function taskMatchesPoint(
  task: ViewTask,
  year: number,
  month: number,
  day: number,
  displayCalendar: 'ethiopian' | 'gregorian',
): boolean {
  if (task.dateType === displayCalendar) {
    return task.primaryYear === year && task.primaryMonth === month && task.primaryDay === day;
  }
  if (displayCalendar === 'ethiopian') {
    const eth = toEthiopian(new Date(Date.UTC(task.primaryYear, task.primaryMonth - 1, task.primaryDay)));
    return eth.year === year && eth.month === month && eth.day === day;
  }
  const greg = toGregorian({ year: task.primaryYear, month: task.primaryMonth, day: task.primaryDay });
  return greg.getUTCFullYear() === year && (greg.getUTCMonth() + 1) === month && greg.getUTCDate() === day;
}

function taskSpansDate(
  task: ViewTask,
  year: number,
  month: number,
  day: number,
  displayCalendar: 'ethiopian' | 'gregorian',
): boolean {
  if (task.endYear == null || task.endMonth == null || task.endDay == null) return false;
  const start = serialDate(
    displayCalendar === task.dateType ? task.primaryYear : 0,
    displayCalendar === task.dateType ? task.primaryMonth : 0,
    displayCalendar === task.dateType ? task.primaryDay : 0,
  );
  const end = serialDate(
    displayCalendar === task.dateType ? task.endYear : 0,
    displayCalendar === task.dateType ? task.endMonth : 0,
    displayCalendar === task.dateType ? task.endDay : 0,
  );
  const check = serialDate(year, month, day);
  return check >= start && check <= end;
}

export function taskMatchesDate(
  task: ViewTask,
  year: number,
  month: number,
  day: number,
  displayCalendar: 'ethiopian' | 'gregorian',
): boolean {
  return taskMatchesPoint(task, year, month, day, displayCalendar)
    || taskSpansDate(task, year, month, day, displayCalendar);
}

export function getTasksForDate(tasks: ViewTask[], year: number, month: number, day: number, displayCalendar: 'ethiopian' | 'gregorian'): ViewTask[] {
  return tasks.filter((t) => taskMatchesDate(t, year, month, day, displayCalendar));
}

export function parseTaskTime(time: string | null): { hour: number; minute: number } | null {
  if (!time) return null;
  const parts = time.split(':');
  if (parts.length < 2) return null;
  const hour = parseInt(parts[0], 10);
  const minute = parseInt(parts[1], 10);
  if (isNaN(hour) || isNaN(minute)) return null;
  return { hour, minute };
}

export function getWeekDates(date: Date): Date[] {
  const day = date.getDay();
  const start = new Date(date);
  start.setDate(date.getDate() - day);
  start.setHours(0, 0, 0, 0);
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d);
  }
  return dates;
}
