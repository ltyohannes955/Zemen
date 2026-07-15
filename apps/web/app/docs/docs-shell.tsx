'use client';

import * as React from 'react';
import { DocSidebar } from './sidebar';
import type { SidebarGroup } from './lib/sidebar';

export function DocsShell({ groups }: { groups: SidebarGroup[] }): React.JSX.Element {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      <DocSidebar groups={groups} />

      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-4 right-4 z-30 flex lg:hidden h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 transition-colors"
        aria-label="Open documentation navigation"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#0a0e17] border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 ease-in-out lg:hidden overflow-y-auto ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-800">
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">Documentation</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close navigation"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-3 py-4">
          <DocSidebar groups={groups} onNav={() => setMobileOpen(false)} />
        </div>
      </aside>
    </>
  );
}
