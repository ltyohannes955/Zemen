import type { EthiopianDate } from '@zemen/core';
import { addDays, isLeapYear, getMonthDays, getDayOfWeek, toGregorian, toEthiopian, isValid } from '@zemen/core';
import type { RecurrenceRule, Task } from './types';

function ethDateFromString(dateStr: string): EthiopianDate {
  const [y, m, d] = dateStr.split('-').map(Number);
  return { year: y, month: m, day: d };
}

function gregorianStringToDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function addGregorianDays(dateStr: string, days: number): string {
  const d = gregorianStringToDate(dateStr);
  d.setUTCDate(d.getUTCDate() + days);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function computeNextOccurrence(task: Task, afterDate: string): string | null {
  if (!task.recurrence) return null;

  const { recurrence } = task;
  const after = gregorianStringToDate(afterDate);
  const taskDate = gregorianStringToDate(task.gregorianDate);

  if (taskDate >= after && task.status === 'pending') {
    return task.gregorianDate;
  }

  const ethDate: EthiopianDate = { year: task.primaryYear, month: task.primaryMonth, day: task.primaryDay };

  for (let i = 0; i < 730; i++) {
    let nextDate: string;

    if (task.dateType === 'ethiopian') {
      const ethAfter = toEthiopian(after);

      let ethNext = { ...ethDate };
      let serial = ethToSerial(ethNext);
      const afterSerial = ethToSerial(ethAfter);

      let diff = afterSerial - serial;
      if (diff < 0) diff = 0;

      switch (recurrence.type) {
        case 'daily': {
          const add = Math.max(0, afterSerial - serial);
          const skip = Math.ceil(add / recurrence.interval) * recurrence.interval;
          serial = serial + skip;
          ethNext = serialToEth(serial);
          break;
        }
        case 'weekly': {
          const daysPerWeek = 7 * recurrence.interval;
          const add = Math.max(0, afterSerial - serial);
          const skip = Math.ceil(add / daysPerWeek) * daysPerWeek;
          serial += skip;
          ethNext = serialToEth(serial);

          if (recurrence.weekDays && recurrence.weekDays.length > 0) {
            const targetDayOfWeek = getDayOfWeek(ethNext);
            if (!recurrence.weekDays.includes(targetDayOfWeek)) {
              const targetDay = adjustToNextWeekDay(ethNext, recurrence.weekDays);
              if (targetDay) ethNext = targetDay;
            }
          }
          break;
        }
        case 'monthly': {
          let targetMonth = recurrence.monthDay ?? task.primaryDay;
          let totalMonths = (ethAfter.year - task.primaryYear) * 12 +
            (ethAfter.month - task.primaryMonth);
          if (totalMonths < 0) totalMonths = 0;

          const remainder = totalMonths % recurrence.interval;
          let monthsToAdd = totalMonths;
          if (remainder > 0) monthsToAdd += recurrence.interval - remainder;
          else if (ethAfter.day > targetMonth) monthsToAdd += recurrence.interval;

          let targetYear = task.primaryYear;
          let targetMonthNum = task.primaryMonth;
          for (let m = 0; m < Math.max(1, monthsToAdd); m++) {
            targetMonthNum++;
            if (targetMonthNum > 13) {
              targetMonthNum = 1;
              targetYear++;
            }
          }

          if (targetMonthNum === 13) {
            const maxPagume = isLeapYear(targetYear) ? 6 : 5;
            targetMonth = Math.min(targetMonth, maxPagume);
          } else {
            targetMonth = Math.min(targetMonth, 30);
          }

          ethNext = { year: targetYear, month: targetMonthNum, day: targetMonth };
          break;
        }
        case 'yearly': {
          let targetDay = recurrence.monthDay ?? task.primaryDay;
          let yearsAhead = ethAfter.year - task.primaryYear;
          if (yearsAhead < 0) yearsAhead = 0;

          const remainder = yearsAhead % recurrence.interval;
          let targetYear = task.primaryYear + yearsAhead;
          if (remainder > 0) targetYear += recurrence.interval - remainder;
          else if (ethAfter.month > task.primaryMonth ||
            (ethAfter.month === task.primaryMonth && ethAfter.day > targetDay)) {
            targetYear += recurrence.interval;
          }

          const targetMonth = task.primaryMonth;
          const maxDay = getMonthDays(targetMonth, targetYear);
          targetDay = Math.min(targetDay, maxDay);

          ethNext = { year: targetYear, month: targetMonth, day: targetDay };
          break;
        }
      }

      if (!isValid(ethNext)) {
        i++;
        continue;
      }

      nextDate = ethDateToGregorianString(ethNext);
    } else {
      let next = gregorianStringToDate(task.gregorianDate);

      switch (recurrence.type) {
        case 'daily':
          next = new Date(Date.UTC(
            next.getUTCFullYear(), next.getUTCMonth(),
            next.getUTCDate() + recurrence.interval
          ));
          break;
        case 'weekly': {
          const daysPerWeek = 7 * recurrence.interval;
          next = new Date(Date.UTC(
            next.getUTCFullYear(), next.getUTCMonth(),
            next.getUTCDate() + daysPerWeek
          ));
          break;
        }
        case 'monthly': {
          let m = next.getUTCMonth() + recurrence.interval;
          let y = next.getUTCFullYear();
          while (m > 12) { m -= 12; y++; }
          const targetDay = Math.min(
            recurrence.monthDay ?? next.getUTCDate(),
            new Date(Date.UTC(y, m, 0)).getUTCDate()
          );
          next = new Date(Date.UTC(y, m - 1, targetDay));
          break;
        }
        case 'yearly': {
          const targetDay = Math.min(
            recurrence.monthDay ?? next.getUTCDate(),
            new Date(Date.UTC(next.getUTCFullYear() + recurrence.interval, next.getUTCMonth() + 1, 0)).getUTCDate()
          );
          next = new Date(Date.UTC(
            next.getUTCFullYear() + recurrence.interval,
            next.getUTCMonth(),
            targetDay
          ));
          break;
        }
      }

      const y = next.getUTCFullYear();
      const m = String(next.getUTCMonth() + 1).padStart(2, '0');
      const d = String(next.getUTCDate()).padStart(2, '0');
      nextDate = `${y}-${m}-${d}`;
    }

    if (nextDate > afterDate) {
      if (!recurrence.endType || recurrence.endType === 'never') {
        return nextDate;
      }
      if (recurrence.endType === 'count' && recurrence.endCount) {
        const count = countOccurrences(task, task.gregorianDate, nextDate);
        if (count > recurrence.endCount) return null;
        return nextDate;
      }
      if (recurrence.endType === 'date' && recurrence.endDate) {
        if (nextDate > recurrence.endDate) return null;
        return nextDate;
      }
      return nextDate;
    }
  }

  return null;
}

function ethToSerial(eth: EthiopianDate): number {
  const daysBeforeYear = 365 * (eth.year - 1) + Math.floor(eth.year / 4);
  const daysBeforeMonth = 30 * (eth.month - 1);
  return daysBeforeYear + daysBeforeMonth + (eth.day - 1);
}

function serialToEth(serial: number): EthiopianDate {
  const cycleDays = 1461;
  const cycles = Math.floor(serial / cycleDays);
  let remainder = serial - cycles * cycleDays;
  if (remainder < 0) remainder += cycleDays;

  const yearBase = cycles * 4;
  let yearInCycle: number;
  let dayOfYear: number;

  if (remainder < 365) { yearInCycle = 1; dayOfYear = remainder; }
  else if (remainder < 730) { yearInCycle = 2; dayOfYear = remainder - 365; }
  else if (remainder < 1096) { yearInCycle = 3; dayOfYear = remainder - 730; }
  else { yearInCycle = 4; dayOfYear = remainder - 1096; }

  return {
    year: yearBase + yearInCycle,
    month: Math.floor(dayOfYear / 30) + 1,
    day: (dayOfYear % 30) + 1,
  };
}

function adjustToNextWeekDay(eth: EthiopianDate, weekDays: number[]): EthiopianDate | null {
  for (let i = 1; i <= 7; i++) {
    const next = addDays(eth, i);
    if (weekDays.includes(getDayOfWeek(next))) return next;
  }
  return null;
}

function countOccurrences(task: Task, fromDate: string, toDate: string): number {
  let count = 0;
  let current = fromDate;
  for (let i = 0; i < 365; i++) {
    const next = computeNextOccurrence(task, current);
    if (!next || next > toDate) break;
    count++;
    current = next;
  }
  return count;
}

export function computeOccurrencesInRange(
  task: Task,
  startDate: string,
  endDate: string,
): string[] {
  const results: string[] = [];
  let current = startDate;

  for (let i = 0; i < 365; i++) {
    const next = computeNextOccurrence(task, current);
    if (!next || next > endDate) break;
    results.push(next);
    current = addGregorianDays(next, 1);
  }

  return results;
}

export function taskIsDueOnDate(task: Task, dateStr: string): boolean {
  if (task.status !== 'pending') return false;

  if (task.gregorianDate === dateStr) return true;

  if (task.recurrence) {
    const next = computeNextOccurrence(task, dateStr);
    return next === dateStr;
  }

  return false;
}

export function tasksForDate(tasks: Task[], dateStr: string): Task[] {
  return tasks.filter((t) => taskIsDueOnDate(t, dateStr));
}

export function groupTasksByDate(tasks: Task[], startDate: string, endDate: string): Map<string, Task[]> {
  const grouped = new Map<string, Task[]>();

  const start = gregorianStringToDate(startDate);
  const end = gregorianStringToDate(endDate);

  const current = new Date(start);
  while (current <= end) {
    const dateStr = current.toISOString().slice(0, 10);
    const dueTasks = tasks.filter((t) => taskIsDueOnDate(t, dateStr));
    if (dueTasks.length > 0) {
      grouped.set(dateStr, dueTasks);
    }
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return grouped;
}

export function ethDateFromGregorianString(dateStr: string): EthiopianDate {
  const d = gregorianStringToDate(dateStr);
  return toEthiopian(d);
}

function ethDateToGregorianString(eth: EthiopianDate): string {
  const g = toGregorian(eth);
  const y = g.getUTCFullYear();
  const m = String(g.getUTCMonth() + 1).padStart(2, '0');
  const d = String(g.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function computeEthiopianDate(
  dateType: 'ethiopian' | 'gregorian',
  ethiopianDate: EthiopianDate,
  gregorianDate: string,
): { ethiopianDate: EthiopianDate; gregorianDate: string; primaryYear: number; primaryMonth: number; primaryDay: number; secondaryYear: number; secondaryMonth: number; secondaryDay: number } {
  if (dateType === 'ethiopian') {
    const gDate = ethDateToGregorianString(ethiopianDate);
    const g = gregorianStringToDate(gDate);
    return {
      ethiopianDate,
      gregorianDate: gDate,
      primaryYear: ethiopianDate.year,
      primaryMonth: ethiopianDate.month,
      primaryDay: ethiopianDate.day,
      secondaryYear: g.getUTCFullYear(),
      secondaryMonth: g.getUTCMonth() + 1,
      secondaryDay: g.getUTCDate(),
    };
  }
  const g = gregorianStringToDate(gregorianDate);
  const eth = ethDateFromGregorianString(gregorianDate);
  return {
    ethiopianDate: eth,
    gregorianDate,
    primaryYear: g.getUTCFullYear(),
    primaryMonth: g.getUTCMonth() + 1,
    primaryDay: g.getUTCDate(),
    secondaryYear: eth.year,
    secondaryMonth: eth.month,
    secondaryDay: eth.day,
  };
}
