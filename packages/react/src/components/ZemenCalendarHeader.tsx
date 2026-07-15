'use client';

import * as React from 'react';
import { getMonthName, toGregorian, toEthiopian, formatNumber } from '@zemen/core';
import type { Locale } from '@zemen/core';

/*
 * Usage:
 *   <ZemenCalendarHeader
 *     year={2018} month={10} calendar="ethiopian"
 *     onPrev={() => nav.goToPreviousMonth()}
 *     onNext={() => nav.goToNextMonth()}
 *     onToday={() => nav.goToToday()}
 *     onCalendarToggle={(c) => setCalendar(c)}
 *   />
 */

const GREGORIAN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export type ZemenCalendarHeaderProps = {
  year: number;
  month: number;
  calendar: 'ethiopian' | 'gregorian';
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onCalendarToggle?: (calendar: 'ethiopian' | 'gregorian') => void;
  locale?: Locale;
  className?: string;
};

export function ZemenCalendarHeader({
  year,
  month,
  calendar,
  onPrev,
  onNext,
  onToday,
  onCalendarToggle,
  locale = 'en',
  className = '',
}: ZemenCalendarHeaderProps): React.JSX.Element {
  const primaryLabel = React.useMemo(() => {
    if (calendar === 'ethiopian') {
      const ethName = getMonthName(month, locale);
      const firstGreg = toGregorian({ year, month, day: 1 });
      const gregName = GREGORIAN_MONTHS[firstGreg.getUTCMonth()];
      const gregYear = firstGreg.getUTCFullYear();
      return { primary: ethName, secondary: gregName, primaryYear: year, secondaryYear: gregYear };
    }
    const gregName = GREGORIAN_MONTHS[month - 1];
    const eth = toEthiopian(new Date(Date.UTC(year, month - 1, 1)));
    const ethName = getMonthName(eth.month, locale);
    return { primary: gregName, secondary: ethName, primaryYear: year, secondaryYear: eth.year };
  }, [year, month, calendar, locale]);

  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      {/* Navigation */}
      <div className="flex items-center gap-1">
        <button
          onClick={onPrev}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          aria-label="Previous"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button
          onClick={onNext}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          aria-label="Next"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      {/* Title */}
      <div className="flex items-center gap-3 text-center">
        <div>
          <div className="text-lg font-bold text-amber-600 dark:text-amber-400 leading-tight">
            <span>{primaryLabel.primary}</span>
            <span className="text-gray-400 dark:text-gray-500 font-medium ml-1.5">({primaryLabel.secondary})</span>
          </div>
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
            {formatNumber(primaryLabel.primaryYear, locale)} <span className="text-gray-300 dark:text-gray-600 mx-1">፡</span> {formatNumber(primaryLabel.secondaryYear, locale)}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToday}
          className="px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          Today
        </button>
        {onCalendarToggle && (
          <button
            onClick={() => onCalendarToggle(calendar === 'ethiopian' ? 'gregorian' : 'ethiopian')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Toggle calendar"
          >
            {calendar === 'ethiopian' ? '🇪🇹' : '🇬🇷'}
            <span>{calendar === 'ethiopian' ? 'Ethiopian' : 'Gregorian'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
