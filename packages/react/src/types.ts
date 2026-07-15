/*
 * Minimal task shape used by @zemen/react view components.
 * Structurally compatible with the Task type from @zemen/scheduler —
 * consumers pass their existing Task objects directly.
 */
export type ViewTask = {
  id: string;
  title: string;
  dateType: 'ethiopian' | 'gregorian';
  primaryYear: number;
  primaryMonth: number;
  primaryDay: number;
  time: string | null;
  priority: string;
  status: string;
  tags?: string[];
  /** Multi-day/all-day: optional end date for span rendering */
  endYear?: number;
  endMonth?: number;
  endDay?: number;
  isAllDay?: boolean;
};
