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

export type SelectedDateInfo = {
  ethYear: number;
  ethMonth: number;
  ethDay: number;
  gregYear: number;
  gregMonth: number;
  gregDay: number;
};

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
  onSelectDate?: (date: SelectedDateInfo) => void;
  selectedDate?: { ethYear: number; ethMonth: number; ethDay: number } | null;
  themeColor?: string;
  className?: string;
};

export function ZemenCalendar({ 
  locale = 'en', 
  onSelectDate, 
  selectedDate,
  themeColor = '#0B3D16',
  className = ''
}: ZemenCalendarProps): React.JSX.Element {
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
    <div className={`rounded-xl border border-gray-100 bg-white p-3 font-sans shadow-sm ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          aria-label="Previous month"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="text-center">
          <div className="text-[13px] font-bold text-gray-900 leading-tight">
            <span>{ethMonthName}</span>
            <span className="text-gray-400 font-medium ml-1">({gregMonthName})</span>
          </div>
          <div className="text-[11px] font-semibold text-gray-500 mt-0.5 cursor-pointer hover:text-gray-800 transition-colors" onClick={goToday}>
            {ethYear} <span className="text-gray-300 mx-1">/</span> {firstGreg.year}
          </div>
        </div>
        <button
          onClick={() => navigate(1)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          aria-label="Next month"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {weekdays.map((d) => (
          <div key={d} className="py-1 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {d}
          </div>
        ))}
        {grid.flatMap((week, wi) =>
          week.map((cell, di) => {
            if (cell.ethDay === null) {
              return <div key={`${wi}-${di}`} className="h-9" />;
            }
            const isToday = isCurrentMonth && cell.ethDay === ethToday.day;
            const isSelected = selectedDate?.ethYear === ethYear && 
                               selectedDate?.ethMonth === ethMonth && 
                               selectedDate?.ethDay === cell.ethDay;
            
            return (
              <button
                key={`${wi}-${di}`}
                onClick={() => {
                  if (onSelectDate) {
                    onSelectDate({
                      ethYear: ethYear,
                      ethMonth: ethMonth,
                      ethDay: cell.ethDay as number,
                      gregYear: cell.gregYear,
                      gregMonth: cell.gregMonth,
                      gregDay: cell.gregDay as number,
                    });
                  }
                }}
                className={`flex flex-col items-center justify-center rounded-lg h-9 w-full transition-all duration-200 relative overflow-hidden ${
                  isSelected
                    ? 'text-white shadow-md transform scale-105 z-10'
                    : isToday
                      ? 'bg-gray-100 text-gray-900 font-bold'
                      : 'hover:bg-gray-50 text-gray-700'
                } ${onSelectDate ? 'cursor-pointer' : 'cursor-default'}`}
                style={isSelected ? { backgroundColor: themeColor } : {}}
              >
                <span className={`text-[13px] font-semibold leading-none mb-0.5 ${isSelected ? 'text-white' : ''}`}>
                  {cell.ethDay}
                </span>
                <span className={`text-[9px] leading-none ${isSelected ? 'text-white/80' : 'text-gray-400 font-medium'}`}>
                  {cell.gregDay}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
