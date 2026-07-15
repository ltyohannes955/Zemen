'use client';

import { useMemo } from 'react';

/*
 * Usage:
 *   const { slots } = useDayTimeline(new Date(), 'gregorian', 6, 22);
 *   // slots is HourSlot[] from 6 AM to 10 PM
 *
 * ETHIOPIAN TIME CONVENTION:
 * Traditional Ethiopian timekeeping starts the day at sunrise (~6:00 AM Gregorian).
 * Ethiopian "0:00" or "12:00" = 6:00 AM Gregorian.
 * Ethiopian "1:00" = 7:00 AM Gregorian, ..., Ethiopian "12:00" = 6:00 PM Gregorian.
 *
 * This hook uses Gregorian 24-hour slots internally. The `displayLabel` shows
 * Gregorian 12-hour (AM/PM) format. The `labelEthiopian` field provides the
 * equivalent Ethiopian hour label for any slot.
 *
 * QUESTION: Do you want the primary `displayLabel` to use Ethiopian time
 * convention instead of Gregorian? Currently I'm defaulting to Gregorian
 * since the tasks' `time` field (HH:MM) uses 24-hour Gregorian time.
 * Confirm before I change the default.
 */

export type HourSlot = {
  hour: number;
  displayLabel: string;
  labelEthiopian: string;
  isPast: boolean;
  isCurrent: boolean;
  isToday: boolean;
};

export type DayTimelineData = {
  slots: HourSlot[];
  date: Date;
  calendar: 'ethiopian' | 'gregorian';
  startHour: number;
  endHour: number;
};

function formatGregorianHour(hour: number): string {
  const period = hour < 12 ? 'AM' : 'PM';
  const h = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h}:00 ${period}`;
}

function ethiopianHourLabel(gregorianHour: number): string {
  const ethHour = ((gregorianHour - 6 + 12) % 12) || 12;
  const period = gregorianHour >= 6 && gregorianHour < 18 ? '☀️' : '🌙';
  return `${ethHour}:00 ${period}`;
}

export function useDayTimeline(
  date: Date,
  calendar: 'ethiopian' | 'gregorian',
  startHour = 0,
  endHour = 24,
): DayTimelineData {
  return useMemo(() => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const currentHour = now.getHours();

    const slots: HourSlot[] = [];
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push({
        hour,
        displayLabel: formatGregorianHour(hour),
        labelEthiopian: ethiopianHourLabel(hour),
        isPast: isToday && hour < currentHour,
        isCurrent: isToday && hour === currentHour,
        isToday,
      });
    }

    return { slots, date, calendar, startHour, endHour };
  }, [date.getTime(), calendar, startHour, endHour]);
}
