'use client';

import type { ViewTask } from '../types';

export type ZemenTaskPillProps = {
  task: ViewTask;
  onClick?: (task: ViewTask) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  showTime?: boolean;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, task: ViewTask) => void;
  isMoveMode?: boolean;
  className?: string;
};

const PILL_COLORS: Record<string, string> = {
  urgent: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border-l-red-400',
  high: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300 border-l-orange-400',
  medium: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-300 border-l-yellow-400',
  low: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border-l-blue-400',
};

export function ZemenTaskPill({
  task,
  onClick,
  onKeyDown,
  showTime = false,
  draggable: isDraggable = false,
  onDragStart,
  isMoveMode = false,
  className = '',
}: ZemenTaskPillProps): React.JSX.Element {
  const color = PILL_COLORS[task.priority] || 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-l-gray-300 dark:border-l-gray-600';
  const ariaLabel = [task.title, task.time, `Priority: ${task.priority}`].filter(Boolean).join(', ');

  return (
    <button
      data-task-id={task.id}
      draggable={isDraggable}
      onDragStart={(e) => onDragStart?.(e, task)}
      onClick={() => onClick?.(task)}
      onKeyDown={onKeyDown}
      aria-label={ariaLabel}
      className={`w-full text-left text-[11px] leading-tight truncate rounded px-1.5 py-0.5 border-l-2 font-medium transition-colors hover:opacity-80 ${color} ${
        isMoveMode ? 'ring-2 ring-emerald-400 dark:ring-emerald-500 ring-offset-1' : ''
      } ${className}`}
    >
      {showTime && task.time && (
        <span className="mr-1 opacity-60">{task.time}</span>
      )}
      {task.title}
    </button>
  );
}
