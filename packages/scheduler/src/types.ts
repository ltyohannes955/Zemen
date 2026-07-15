import type { EthiopianDate } from '@zemen/core';

export type Priority = 'none' | 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'completed' | 'cancelled';
export type DateType = 'ethiopian' | 'gregorian';
export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type ReminderType = 'at-time' | 'before';

export interface RecurrenceRule {
  type: RecurrenceType;
  interval: number;
  endType?: 'never' | 'count' | 'date';
  endCount?: number;
  endDate?: string;
  weekDays?: number[];
  monthDay?: number;
}

export interface ReminderRule {
  type: ReminderType;
  before?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dateType: DateType;
  primaryYear: number;
  primaryMonth: number;
  primaryDay: number;
  secondaryYear: number;
  secondaryMonth: number;
  secondaryDay: number;
  gregorianDate: string;
  time: string | null;
  priority: Priority;
  status: TaskStatus;
  recurrence: RecurrenceRule | null;
  reminder: ReminderRule | null;
  tags: string[];
  position: number;
  createdAt: string;
  updatedAt: string;
  /** Multi-day/all-day: optional end date. If set together with isAllDay, renders as a multi-day bar. */
  endYear?: number;
  endMonth?: number;
  endDay?: number;
  isAllDay?: boolean;
}

export function getEthiopianDate(task: Task): EthiopianDate {
  return { year: task.primaryYear, month: task.primaryMonth, day: task.primaryDay };
}

export function getEthiopianSecondary(task: Task): EthiopianDate {
  return { year: task.secondaryYear, month: task.secondaryMonth, day: task.secondaryDay };
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  dateType: DateType;
  primaryYear: number;
  primaryMonth: number;
  primaryDay: number;
  secondaryYear: number;
  secondaryMonth: number;
  secondaryDay: number;
  gregorianDate: string;
  time?: string | null;
  priority?: Priority;
  recurrence?: RecurrenceRule | null;
  reminder?: ReminderRule | null;
  tags?: string[];
  endYear?: number;
  endMonth?: number;
  endDay?: number;
  isAllDay?: boolean;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  dateType?: DateType;
  primaryYear?: number;
  primaryMonth?: number;
  primaryDay?: number;
  secondaryYear?: number;
  secondaryMonth?: number;
  secondaryDay?: number;
  gregorianDate?: string;
  time?: string | null;
  priority?: Priority;
  status?: TaskStatus;
  recurrence?: RecurrenceRule | null;
  reminder?: ReminderRule | null;
  tags?: string[];
  position?: number;
  endYear?: number;
  endMonth?: number;
  endDay?: number;
  isAllDay?: boolean;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: Priority;
  dateType?: DateType;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  search?: string;
  upcoming?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiConfig {
  baseUrl: string;
  getToken: () => string | null;
}
