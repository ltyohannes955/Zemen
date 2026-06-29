import { isValid } from '@zemen/core';
import type { Task, CreateTaskInput, UpdateTaskInput, RecurrenceRule, ReminderRule, ValidationError } from './types';

export function validateTitle(title: unknown): ValidationError | null {
  if (typeof title !== 'string' || title.trim().length === 0) {
    return { field: 'title', message: 'Title is required' };
  }
  if (title.length > 500) {
    return { field: 'title', message: 'Title must be 500 characters or less' };
  }
  return null;
}

export function validatePriority(priority: unknown): ValidationError | null {
  const valid = ['none', 'low', 'medium', 'high'];
  if (priority !== undefined && priority !== null && !valid.includes(priority as string)) {
    return { field: 'priority', message: 'Priority must be one of: none, low, medium, high' };
  }
  return null;
}

export function validateStatus(status: unknown): ValidationError | null {
  const valid = ['pending', 'completed', 'cancelled'];
  if (status !== undefined && status !== null && !valid.includes(status as string)) {
    return { field: 'status', message: 'Status must be one of: pending, completed, cancelled' };
  }
  return null;
}

export function validateDateType(dateType: unknown): ValidationError | null {
  if (dateType !== 'ethiopian' && dateType !== 'gregorian') {
    return { field: 'dateType', message: 'dateType must be "ethiopian" or "gregorian"' };
  }
  return null;
}

export function validatePrimaryDate(y: number, m: number, d: number): ValidationError | null {
  if (typeof y !== 'number' || typeof m !== 'number' || typeof d !== 'number') {
    return { field: 'primaryDate', message: 'Date fields must be numbers' };
  }
  if (!isValid({ year: y, month: m, day: d })) {
    return { field: 'primaryDate', message: 'Invalid Ethiopian date' };
  }
  return null;
}

export function validateGregorianDate(dateStr: unknown): ValidationError | null {
  if (typeof dateStr !== 'string') {
    return { field: 'gregorianDate', message: 'Gregorian date must be a string in YYYY-MM-DD format' };
  }
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return { field: 'gregorianDate', message: 'Gregorian date must be in YYYY-MM-DD format' };
  }
  const d = new Date(`${dateStr}T00:00:00Z`);
  if (isNaN(d.getTime())) {
    return { field: 'gregorianDate', message: 'Invalid Gregorian date' };
  }
  return null;
}

export function validateTags(tags: unknown): ValidationError | null {
  if (tags !== undefined && tags !== null) {
    if (!Array.isArray(tags) || !tags.every((t) => typeof t === 'string')) {
      return { field: 'tags', message: 'Tags must be an array of strings' };
    }
  }
  return null;
}

export function validateRecurrence(rule: unknown): ValidationError | null {
  if (rule === undefined || rule === null) return null;

  const r = rule as RecurrenceRule;
  if (typeof r.type !== 'string' || !['daily', 'weekly', 'monthly', 'yearly'].includes(r.type)) {
    return { field: 'recurrence.type', message: 'Recurrence type must be: daily, weekly, monthly, or yearly' };
  }
  if (typeof r.interval !== 'number' || r.interval < 1 || !Number.isInteger(r.interval)) {
    return { field: 'recurrence.interval', message: 'Recurrence interval must be a positive integer' };
  }
  if (r.endType && !['never', 'count', 'date'].includes(r.endType)) {
    return { field: 'recurrence.endType', message: 'endType must be: never, count, or date' };
  }
  return null;
}

export function validateReminder(rule: unknown): ValidationError | null {
  if (rule === undefined || rule === null) return null;

  const r = rule as ReminderRule;
  if (r.type !== 'at-time' && r.type !== 'before') {
    return { field: 'reminder.type', message: 'Reminder type must be "at-time" or "before"' };
  }
  if (r.type === 'before' && (typeof r.before !== 'number' || r.before < 1)) {
    return { field: 'reminder.before', message: 'Reminder before must be a positive number of minutes' };
  }
  return null;
}

export function validateCreateTask(input: CreateTaskInput): ValidationError[] {
  const errors: ValidationError[] = [];

  const titleErr = validateTitle(input.title);
  if (titleErr) errors.push(titleErr);

  const dtErr = validateDateType(input.dateType);
  if (dtErr) errors.push(dtErr);

  const priErr = validatePrimaryDate(input.primaryYear, input.primaryMonth, input.primaryDay);
  if (priErr) errors.push(priErr);

  const gregErr = validateGregorianDate(input.gregorianDate);
  if (gregErr) errors.push(gregErr);

  const prioErr = validatePriority(input.priority);
  if (prioErr) errors.push(prioErr);

  const tagsErr = validateTags(input.tags);
  if (tagsErr) errors.push(tagsErr);

  const recErr = validateRecurrence(input.recurrence);
  if (recErr) errors.push(recErr);

  const remErr = validateReminder(input.reminder);
  if (remErr) errors.push(remErr);

  return errors;
}

export function validateUpdateTask(input: UpdateTaskInput): ValidationError[] {
  const errors: ValidationError[] = [];

  if (input.title !== undefined) {
    const titleErr = validateTitle(input.title);
    if (titleErr) errors.push(titleErr);
  }

  if (input.dateType !== undefined) {
    const dtErr = validateDateType(input.dateType);
    if (dtErr) errors.push(dtErr);
  }

  if (input.primaryYear !== undefined || input.primaryMonth !== undefined || input.primaryDay !== undefined) {
    const y = input.primaryYear ?? 0;
    const m = input.primaryMonth ?? 1;
    const d = input.primaryDay ?? 1;
    const priErr = validatePrimaryDate(y, m, d);
    if (priErr) errors.push(priErr);
  }

  if (input.gregorianDate !== undefined) {
    const gregErr = validateGregorianDate(input.gregorianDate);
    if (gregErr) errors.push(gregErr);
  }

  if (input.priority !== undefined) {
    const prioErr = validatePriority(input.priority);
    if (prioErr) errors.push(prioErr);
  }

  if (input.status !== undefined) {
    const statErr = validateStatus(input.status);
    if (statErr) errors.push(statErr);
  }

  if (input.tags !== undefined) {
    const tagsErr = validateTags(input.tags);
    if (tagsErr) errors.push(tagsErr);
  }

  const recErr = validateRecurrence(input.recurrence);
  if (recErr) errors.push(recErr);

  const remErr = validateReminder(input.reminder);
  if (remErr) errors.push(remErr);

  return errors;
}

export function validateTask(task: Task): ValidationError[] {
  const errors: ValidationError[] = [];

  const titleErr = validateTitle(task.title);
  if (titleErr) errors.push(titleErr);

  const dtErr = validateDateType(task.dateType);
  if (dtErr) errors.push(dtErr);

  const priErr = validatePrimaryDate(task.primaryYear, task.primaryMonth, task.primaryDay);
  if (priErr) errors.push(priErr);

  const gregErr = validateGregorianDate(task.gregorianDate);
  if (gregErr) errors.push(gregErr);

  const prioErr = validatePriority(task.priority);
  if (prioErr) errors.push(prioErr);

  const statErr = validateStatus(task.status);
  if (statErr) errors.push(statErr);

  const tagsErr = validateTags(task.tags);
  if (tagsErr) errors.push(tagsErr);

  const recErr = validateRecurrence(task.recurrence);
  if (recErr) errors.push(recErr);

  const remErr = validateReminder(task.reminder);
  if (remErr) errors.push(remErr);

  return errors;
}
