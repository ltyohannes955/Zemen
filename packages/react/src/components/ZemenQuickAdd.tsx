'use client';

import * as React from 'react';
import { ZemenDatePicker } from './ZemenDatePicker';
import type { SelectedDateInfo } from './ZemenCalendar';

/*
 * Minimal quick-add modal for tasks.
 * Stays presentational — onSubmit receives an assembled input compatible
 * with @zemen/scheduler's CreateTaskInput.
 */

export type QuickAddTaskInput = {
  title: string;
  dateType: 'ethiopian' | 'gregorian';
  primaryYear: number;
  primaryMonth: number;
  primaryDay: number;
  secondaryYear: number;
  secondaryMonth: number;
  secondaryDay: number;
  gregorianDate: string;
  time: string | null;
  priority: 'none' | 'low' | 'medium' | 'high';
  tags?: string[];
  endYear?: number;
  endMonth?: number;
  endDay?: number;
  isAllDay?: boolean;
};

export type ZemenQuickAddProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: QuickAddTaskInput) => void;
  defaultDate?: Date;
  calendar?: 'ethiopian' | 'gregorian';
  locale?: 'en' | 'am';
  className?: string;
};

const PRIORITY_OPTIONS: { value: QuickAddTaskInput['priority']; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export function ZemenQuickAdd({
  open,
  onClose,
  onSubmit,
  calendar = 'ethiopian',
  locale = 'en',
  className = '',
}: ZemenQuickAddProps): React.JSX.Element | null {
  const [title, setTitle] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState<SelectedDateInfo | null>(null);
  const [time, setTime] = React.useState('');
  const [priority, setPriority] = React.useState<QuickAddTaskInput['priority']>('none');
  const [isAllDay, setIsAllDay] = React.useState(false);
  const [endDate, setEndDate] = React.useState<SelectedDateInfo | null>(null);

  const titleRef = React.useRef<HTMLInputElement>(null);
  const prevOpenRef = React.useRef(open);

  React.useEffect(() => {
    if (open && !prevOpenRef.current) {
      setTitle('');
      setSelectedDate(null);
      setTime('');
      setPriority('none');
      setIsAllDay(false);
      setEndDate(null);
      setTimeout(() => titleRef.current?.focus(), 50);
    }
    prevOpenRef.current = open;
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const now = new Date();
    const primaryYear = selectedDate?.ethYear ?? now.getFullYear();
    const primaryMonth = selectedDate?.ethMonth ?? now.getMonth() + 1;
    const primaryDay = selectedDate?.ethDay ?? now.getDate();
    const gregYear = selectedDate?.gregYear ?? now.getFullYear();
    const gregMonth = selectedDate?.gregMonth ?? now.getMonth() + 1;
    const gregDay = selectedDate?.gregDay ?? now.getDate();
    const gregDateStr = `${gregYear}-${String(gregMonth).padStart(2, '0')}-${String(gregDay).padStart(2, '0')}`;

    const input: QuickAddTaskInput = {
      title: title.trim(),
      dateType: calendar,
      primaryYear,
      primaryMonth,
      primaryDay,
      secondaryYear: calendar === 'ethiopian' ? gregYear : primaryYear,
      secondaryMonth: calendar === 'ethiopian' ? gregMonth : primaryMonth,
      secondaryDay: calendar === 'ethiopian' ? gregDay : primaryDay,
      gregorianDate: gregDateStr,
      time: isAllDay ? null : (time || null),
      priority,
      isAllDay: isAllDay || undefined,
    };

    if (isAllDay && endDate) {
      input.endYear = endDate.ethYear;
      input.endMonth = endDate.ethMonth;
      input.endDay = endDate.ethDay;
    }

    onSubmit(input);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] bg-black/30 dark:bg-black/50 ${className}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Quick add task"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 shadow-xl p-5 mx-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Quick Add Task</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            aria-label="Task title"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
          />

          <ZemenDatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            placeholder="Select date"
            locale={locale}
            className="w-full"
          />

          <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
            <input
              type="checkbox"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-emerald-600 focus:ring-emerald-500"
            />
            All-day / Multi-day
          </label>

          <div className="grid grid-cols-2 gap-2">
            {isAllDay ? (
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1 block">End date</label>
                  <ZemenDatePicker
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="End date (optional)"
                  locale={locale}
                  className="w-full"
                />
              </div>
            ) : (
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                aria-label="Task time"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            )}

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as QuickAddTaskInput['priority'])}
              aria-label="Priority"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 rounded-lg transition-colors"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
}
