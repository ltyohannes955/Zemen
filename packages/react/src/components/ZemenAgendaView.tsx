'use client';

import * as React from 'react';
import { toEthiopianLocal, formatNumber } from '@zemen/core';
import { ZemenTaskCard } from './ZemenTaskCard';
import { ZemenEmptyState } from './ZemenEmptyState';
import type { ViewTask } from '../types';

export type ZemenAgendaViewProps = {
  tasks: ViewTask[];
  daysAhead?: number;
  onTaskClick?: (task: ViewTask) => void;
  locale?: 'en' | 'am';
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
};

type GroupedDay = {
  date: Date;
  label: string;
  sublabel: string;
  isToday: boolean;
  tasks: ViewTask[];
};

function formatGroup(date: Date, locale: 'en' | 'am'): GroupedDay {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const eth = toEthiopianLocal(date);
  const ethNames = ['Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit', 'Megabit', 'Miazia', 'Genbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'];
  const ethMonthName = ethNames[eth.month - 1] || '';

  let label: string;
  if (isToday) label = 'Today';
  else if (isTomorrow) label = 'Tomorrow';
  else label = `${dayNames[date.getDay()]}, ${monthNames[date.getMonth()]} ${date.getDate()}`;

  const sublabel = `${ethMonthName} ${formatNumber(eth.day, locale)}, ${formatNumber(eth.year, locale)}`;

  return { date, label, sublabel, isToday, tasks: [] };
}

export function ZemenAgendaView({
  tasks,
  daysAhead = 14,
  onTaskClick,
  locale = 'en',
  isLoading = false,
  emptyState,
  className = '',
}: ZemenAgendaViewProps): React.JSX.Element {
  const grouped = React.useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + daysAhead);

    const days: Map<string, GroupedDay> = new Map();

    for (let d = new Date(now); d <= endDate; d.setDate(d.getDate() + 1)) {
      const key = d.toDateString();
      days.set(key, formatGroup(new Date(d), locale));
    }

    for (const task of tasks) {
      const taskDate = new Date(Date.UTC(task.primaryYear, task.primaryMonth - 1, task.primaryDay));
      const taskKey = taskDate.toDateString();
      const group = days.get(taskKey);
      if (group) {
        group.tasks.push(task);
      }
    }

    return Array.from(days.values()).filter((g) => g.tasks.length > 0);
  }, [tasks, daysAhead]);

  if (isLoading) {
    return (
      <div className={`flex flex-col gap-6 ${className}`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <div className="h-5 w-40 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-2" />
            <div className="flex flex-col gap-1.5">
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="h-16 bg-gray-50 dark:bg-gray-800/30 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (grouped.length === 0) {
    return <>{emptyState ?? <ZemenEmptyState message="No upcoming tasks" description={`Tasks in the next ${daysAhead} days will appear here`} className={className} />}</>;
  }

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {grouped.map((day) => (
        <div key={day.date.toISOString()}>
          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-sm font-bold ${day.isToday ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-gray-100'}`}>
              {day.label}
            </span>
            <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
              {day.sublabel}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {day.tasks.map((task) => (
              <ZemenTaskCard key={task.id} task={task} onClick={onTaskClick} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
