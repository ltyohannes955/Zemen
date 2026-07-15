'use client';

import { getHoliday } from '@zemen/core';

export type ZemenHolidayBadgeProps = {
  ethiopianMonth: number;
  ethiopianDay: number;
  locale?: 'en' | 'am';
  className?: string;
};

export function ZemenHolidayBadge({
  ethiopianMonth,
  ethiopianDay,
  className = '',
}: ZemenHolidayBadgeProps): React.JSX.Element | null {
  const holiday = getHoliday(ethiopianMonth, ethiopianDay);
  if (!holiday) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 leading-none ${className}`}
      aria-label={holiday.name}
    >
      <span aria-hidden="true">✦</span>
      <span aria-hidden="true" className="truncate max-w-[80px]">{holiday.nameAm}</span>
    </span>
  );
}
