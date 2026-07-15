'use client';

import * as React from 'react';
import { ZemenDatePicker } from './ZemenDatePicker';
import type { SelectedDateInfo } from './ZemenCalendar';
import type { ViewTask } from '../types';

/*
 * Full task form for create and edit modes.
 * Compatible with @zemen/scheduler's CreateTaskInput / UpdateTaskInput.
 */

export type TaskFormInput = {
  title: string;
  description: string;
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
  status: 'pending' | 'completed' | 'cancelled';
  tags: string[];
  recurrence: RecurrenceRuleInput | null;
  reminder: ReminderRuleInput | null;
  endYear?: number;
  endMonth?: number;
  endDay?: number;
  isAllDay?: boolean;
};

export type RecurrenceRuleInput = {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endType?: 'never' | 'count' | 'date';
  endCount?: number;
  endDate?: string;
  weekDays?: number[];
  monthDay?: number;
};

export type ReminderRuleInput = {
  type: 'at-time' | 'before';
  before?: number;
};

export type ZemenTaskFormProps = {
  task?: ViewTask;
  onSubmit?: (input: TaskFormInput) => void;
  onUpdate?: (input: Partial<TaskFormInput>) => void;
  onClose: () => void;
  calendar?: 'ethiopian' | 'gregorian';
  locale?: 'en' | 'am';
  className?: string;
};

const PRIORITY_OPTIONS: { value: TaskFormInput['priority']; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const STATUS_OPTIONS: { value: TaskFormInput['status']; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const RECURRENCE_TYPES: { value: RecurrenceRuleInput['type']; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ZemenTaskForm({
  task,
  onSubmit,
  onUpdate,
  onClose,
  calendar = 'ethiopian',
  locale = 'en',
  className = '',
}: ZemenTaskFormProps): React.JSX.Element {
  const isEdit = !!task;

  const [title, setTitle] = React.useState(task?.title ?? '');
  const [description, setDescription] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState<SelectedDateInfo | null>(null);
  const [time, setTime] = React.useState(task?.time ?? '');
  const [priority, setPriority] = React.useState<TaskFormInput['priority']>((task?.priority as TaskFormInput['priority']) ?? 'none');
  const [status, setStatus] = React.useState<TaskFormInput['status']>((task?.status as TaskFormInput['status']) ?? 'pending');
  const [tagsStr, setTagsStr] = React.useState(task?.tags?.join(', ') ?? '');
  const [enableRecurrence, setEnableRecurrence] = React.useState(false);
  const [recurType, setRecurType] = React.useState<RecurrenceRuleInput['type']>('weekly');
  const [recurInterval, setRecurInterval] = React.useState(1);
  const [recurEndType, setRecurEndType] = React.useState<'never' | 'count' | 'date'>('never');
  const [recurEndCount, setRecurEndCount] = React.useState(5);
  const [recurEndDate, setRecurEndDate] = React.useState('');
  const [recurWeekDays, setRecurWeekDays] = React.useState<number[]>([new Date().getDay()]);
  const [recurMonthDay, setRecurMonthDay] = React.useState(new Date().getDate());
  const [isAllDay, setIsAllDay] = React.useState(task?.isAllDay ?? false);
  const [endDate, setEndDate] = React.useState<SelectedDateInfo | null>(null);

  const firstInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setTimeout(() => firstInputRef.current?.focus(), 50);
  }, []);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const toggleWeekDay = (d: number) => {
    setRecurWeekDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort(),
    );
  };

  const buildInput = (): TaskFormInput => {
    const now = new Date();
    const primaryYear = selectedDate?.ethYear ?? (task?.primaryYear ?? now.getFullYear());
    const primaryMonth = selectedDate?.ethMonth ?? (task?.primaryMonth ?? now.getMonth() + 1);
    const primaryDay = selectedDate?.ethDay ?? (task?.primaryDay ?? now.getDate());
    const gregYear = selectedDate?.gregYear ?? now.getFullYear();
    const gregMonth = selectedDate?.gregMonth ?? now.getMonth() + 1;
    const gregDay = selectedDate?.gregDay ?? now.getDate();
    const gregDateStr = `${gregYear}-${String(gregMonth).padStart(2, '0')}-${String(gregDay).padStart(2, '0')}`;
    const tags = tagsStr.split(',').map((t) => t.trim()).filter(Boolean);

    return {
      title: title.trim(),
      description: description.trim(),
      dateType: calendar,
      primaryYear,
      primaryMonth,
      primaryDay,
      secondaryYear: calendar === 'ethiopian' ? gregYear : primaryYear,
      secondaryMonth: calendar === 'ethiopian' ? gregMonth : primaryMonth,
      secondaryDay: calendar === 'ethiopian' ? gregDay : primaryDay,
      gregorianDate: gregDateStr,
      time: time || null,
      priority,
      status,
      tags,
      recurrence: enableRecurrence ? {
        type: recurType,
        interval: recurInterval,
        endType: recurEndType,
        endCount: recurEndType === 'count' ? recurEndCount : undefined,
        endDate: recurEndType === 'date' ? recurEndDate : undefined,
        weekDays: recurType === 'weekly' ? recurWeekDays : undefined,
        monthDay: recurType === 'monthly' ? recurMonthDay : undefined,
      } : null,
      reminder: null,
      isAllDay: isAllDay || undefined,
      endYear: isAllDay && endDate ? endDate.ethYear : undefined,
      endMonth: isAllDay && endDate ? endDate.ethMonth : undefined,
      endDay: isAllDay && endDate ? endDate.ethDay : undefined,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const input = buildInput();
    if (isEdit) {
      onUpdate?.(input);
    } else {
      onSubmit?.(input);
    }
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] bg-black/30 dark:bg-black/50 overflow-y-auto ${className}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? 'Edit task' : 'New task'}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 shadow-xl p-6 mx-4 mb-10"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
            {isEdit ? 'Edit Task' : 'New Task'}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-7 w-7 items-center justify-center rounded text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block">Title *</label>
            <input
              ref={firstInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none"
            />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block">Date</label>
              <ZemenDatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                placeholder="Select date"
                locale={locale}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Priority + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskFormInput['priority'])}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              >
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskFormInput['status'])}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block">Tags (comma-separated)</label>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="e.g. work, personal, urgent"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* All-day / Multi-day */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
              <input
                type="checkbox"
                checked={isAllDay}
                onChange={(e) => setIsAllDay(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-emerald-600 focus:ring-emerald-500"
              />
              All-day / Multi-day
            </label>
            {isAllDay && (
              <div className="mt-2">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1 block">End date (optional)</label>
                  <ZemenDatePicker
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="End date"
                  locale={locale}
                />
              </div>
            )}
          </div>

          {/* Recurrence */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">
              <input
                type="checkbox"
                checked={enableRecurrence}
                onChange={(e) => setEnableRecurrence(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-emerald-600 focus:ring-emerald-500"
              />
              Recurring task
            </label>
            {enableRecurrence && (
              <div className="flex flex-col gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1 block">Repeat</label>
                    <select
                      value={recurType}
                      onChange={(e) => setRecurType(e.target.value as RecurrenceRuleInput['type'])}
                      className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-gray-100 outline-none"
                    >
                      {RECURRENCE_TYPES.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1 block">Every</label>
                    <input
                      type="number"
                      min={1}
                      max={365}
                      value={recurInterval}
                      onChange={(e) => setRecurInterval(parseInt(e.target.value, 10) || 1)}
                      className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-gray-100 outline-none"
                    />
                  </div>
                </div>

                {recurType === 'weekly' && (
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1 block">On days</label>
                    <div className="flex gap-1">
                      {WEEKDAY_NAMES.map((name, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => toggleWeekDay(i)}
                          className={`w-8 h-8 rounded text-[10px] font-bold transition-colors ${
                            recurWeekDays.includes(i)
                              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {name[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {recurType === 'monthly' && (
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1 block">Day of month</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={recurMonthDay}
                      onChange={(e) => setRecurMonthDay(parseInt(e.target.value, 10) || 1)}
                      className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-gray-100 outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1 block">End</label>
                  <select
                    value={recurEndType}
                    onChange={(e) => setRecurEndType(e.target.value as 'never' | 'count' | 'date')}
                    className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-gray-100 outline-none"
                  >
                    <option value="never">Never</option>
                    <option value="count">After N occurrences</option>
                    <option value="date">On date</option>
                  </select>
                  {recurEndType === 'count' && (
                    <input
                      type="number"
                      min={1}
                      value={recurEndCount}
                      onChange={(e) => setRecurEndCount(parseInt(e.target.value, 10) || 1)}
                      className="w-full px-2 py-1.5 mt-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-gray-100 outline-none"
                      placeholder="Occurrences"
                    />
                  )}
                  {recurEndType === 'date' && (
                    <input
                      type="date"
                      value={recurEndDate}
                      onChange={(e) => setRecurEndDate(e.target.value)}
                      className="w-full px-2 py-1.5 mt-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-gray-100 outline-none"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 rounded-lg transition-colors"
          >
            {isEdit ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}
