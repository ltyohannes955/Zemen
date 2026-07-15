'use client';

import type { ViewTask } from '../types';

export type ZemenTaskCardProps = {
  task: ViewTask;
  onClick?: (task: ViewTask) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, task: ViewTask) => void;
  isMoveMode?: boolean;
  className?: string;
};

const PRIORITY_STYLES: Record<string, string> = {
  urgent: 'border-l-red-500 bg-red-50 dark:bg-red-900/20',
  high: 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20',
  medium: 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
  low: 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20',
};

const PRIORITY_LABELS: Record<string, string> = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export function ZemenTaskCard({
  task,
  onClick,
  onKeyDown,
  draggable: isDraggable = false,
  onDragStart,
  isMoveMode = false,
  className = '',
}: ZemenTaskCardProps): React.JSX.Element {
  const borderStyle = PRIORITY_STYLES[task.priority] || 'border-l-gray-300 dark:border-l-gray-600 bg-gray-50 dark:bg-gray-800/30';
  const ariaLabel = [
    task.title,
    task.time ? `at ${task.time}` : '',
    `Priority: ${PRIORITY_LABELS[task.priority] || task.priority}`,
    `Status: ${task.status.replace('_', ' ')}`,
  ].filter(Boolean).join(', ');

  return (
    <button
      data-task-id={task.id}
      draggable={isDraggable}
      onDragStart={(e) => onDragStart?.(e, task)}
      onClick={() => onClick?.(task)}
      onKeyDown={onKeyDown}
      aria-label={ariaLabel}
      className={`w-full text-left flex items-start gap-3 rounded-lg border-l-4 p-3 shadow-sm transition-all hover:shadow-md ${borderStyle} ${
        isMoveMode ? 'ring-2 ring-emerald-400 dark:ring-emerald-500 ring-offset-1' : ''
      } ${className}`}
    >
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {task.title}
        </div>
        {task.time && (
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
            {task.time}
          </div>
        )}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {task.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
          task.priority === 'urgent' || task.priority === 'high'
            ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300'
            : task.priority === 'medium'
              ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300'
              : task.priority === 'low'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
                : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
        }`}>
          {PRIORITY_LABELS[task.priority] || task.priority}
        </span>
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
          task.status === 'done'
            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300'
            : task.status === 'in_progress'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
        }`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>
    </button>
  );
}
