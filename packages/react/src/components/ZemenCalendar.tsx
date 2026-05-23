'use client';

import * as React from 'react';
import {
  toEthiopianLocal,
  toGregorian,
  getMonthName,
  getMonthDays,
  getDayOfWeek,
  type Locale,
} from '@zemen/core';

type DayCell = {
  ethDay: number | null;
  gregDay: number | null;
  gregMonth: number;
  gregYear: number;
  gregLabel: string;
};

const WEEKDAY_LABELS: Record<string, string[]> = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  am: ['እሁ', 'ሰኞ', 'ማክ', 'ረቡ', 'ሐሙ', 'ዓር', 'ቅዳ'],
};

const GREGORIAN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function buildMonthGrid(year: number, month: number): DayCell[][] {
  const weeks: DayCell[][] = [];
  let week: DayCell[] = [];

  const firstDow = getDayOfWeek({ year, month, day: 1 });
  const daysInMonth = getMonthDays(month, year);

  for (let i = 0; i < firstDow; i++) {
    week.push({ ethDay: null, gregDay: null, gregMonth: 0, gregYear: 0, gregLabel: '' });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const greg = toGregorian({ year, month, day: d });
    const gregDay = greg.getUTCDate();
    const gregMonth = greg.getUTCMonth() + 1;
    const gregYear = greg.getUTCFullYear();

    week.push({
      ethDay: d,
      gregDay,
      gregMonth,
      gregYear,
      gregLabel: `${gregDay}`,
    });

    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    while (week.length < 7) {
      week.push({ ethDay: null, gregDay: null, gregMonth: 0, gregYear: 0, gregLabel: '' });
    }
    weeks.push(week);
  }

  return weeks;
}

export type ZemenCalendarProps = {
  locale?: Locale;
};

export function ZemenCalendar({ locale = 'en' }: ZemenCalendarProps): React.JSX.Element {
  const ethToday = React.useMemo(() => toEthiopianLocal(new Date()), []);
  const [ethYear, setEthYear] = React.useState(ethToday.year);
  const [ethMonth, setEthMonth] = React.useState(ethToday.month);

  const grid = React.useMemo(() => buildMonthGrid(ethYear, ethMonth), [ethYear, ethMonth]);

  const firstGreg = React.useMemo(() => {
    for (const week of grid) {
      for (const cell of week) {
        if (cell.ethDay !== null) {
          return { month: cell.gregMonth, year: cell.gregYear };
        }
      }
    }
    return { month: 1, year: 2022 };
  }, [grid]);

  const navigate = (dir: -1 | 1) => {
    setEthMonth((m) => {
      let next = m + dir;
      if (next < 1) {
        setEthYear((y) => y - 1);
        next = 13;
      } else if (next > 13) {
        setEthYear((y) => y + 1);
        next = 1;
      }
      return next;
    });
  };

  const goToday = () => {
    setEthYear(ethToday.year);
    setEthMonth(ethToday.month);
  };

  const ethMonthName = getMonthName(ethMonth, 'am');
  const gregMonthName = GREGORIAN_MONTHS[firstGreg.month - 1];
  const weekdays = WEEKDAY_LABELS[locale] || WEEKDAY_LABELS.en;
  const isCurrentMonth = ethYear === ethToday.year && ethMonth === ethToday.month;

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 font-sans transition-colors duration-300">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          aria-label="Previous month"
        >
          &lsaquo;
        </button>
        <div className="text-center">
          <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
            <span>{ethMonthName}</span>
            <span className="text-gray-400"> ({gregMonthName})</span>
            <span className="ml-2">{ethYear}</span>
            <span className="text-gray-400"> / {firstGreg.year}</span>
          </div>
          <button onClick={goToday} className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
            Today
          </button>
        </div>
        <button
          onClick={() => navigate(1)}
          className="flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          aria-label="Next month"
        >
          &rsaquo;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px">
        {weekdays.map((d) => (
          <div key={d} className="py-1 text-center text-xs font-medium text-gray-400">
            {d}
          </div>
        ))}
        {grid.flatMap((week, wi) =>
          week.map((cell, di) => {
            if (cell.ethDay === null) {
              return <div key={`${wi}-${di}`} className="h-14" />;
            }
            const isToday = isCurrentMonth && cell.ethDay === ethToday.day;
            return (
              <div
                key={`${wi}-${di}`}
                className={`flex flex-col items-center justify-center rounded px-1 py-0.5 h-14 transition-colors duration-200 ${
                  isToday
                    ? 'bg-emerald-500 text-white'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <span
                  className={`text-base font-semibold leading-tight ${
                    isToday ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {cell.ethDay}
                </span>
                <span
                  className={`text-[10px] leading-tight ${
                    isToday ? 'text-emerald-100' : 'text-gray-400'
                  }`}
                >
                  {cell.gregDay}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
