'use client';

import * as React from 'react';

export type ZemenEmptyStateProps = {
  message: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export function ZemenEmptyState({
  message,
  description,
  icon,
  action,
  className = '',
}: ZemenEmptyStateProps): React.JSX.Element {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500 ${className}`}>
      {icon ?? (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-40" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )}
      <div className="text-sm font-medium">{message}</div>
      {description && <div className="text-xs mt-1">{description}</div>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
