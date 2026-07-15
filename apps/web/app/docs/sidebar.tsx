'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { SidebarGroup } from './lib/sidebar';

export function DocSidebar({ groups, onNav }: { groups: SidebarGroup[]; onNav?: () => void }): React.JSX.Element {
  const pathname = usePathname();
  const currentSlug = pathname.replace(/^\/docs\/?/, '') || 'introduction';

  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(() => {
    const active = new Set<string>();
    for (const group of groups) {
      if (group.items.some((item) => item.slug === currentSlug)) {
        active.add(group.title);
      }
    }
    if (active.size === 0 && groups.length > 0) active.add(groups[0].title);
    return active;
  });

  const toggleGroup = React.useCallback((title: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }, []);

  return (
    <nav className="space-y-1">
      {groups.map((group) => {
        const isExpanded = expandedGroups.has(group.title);

        return (
          <div key={group.title}>
            <button
              onClick={() => toggleGroup(group.title)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-expanded={isExpanded}
            >
              {group.title}
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                aria-hidden="true"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {isExpanded && (
              <div className="ml-2 mt-0.5 space-y-0.5 border-l-2 border-gray-100 dark:border-gray-800 pl-2">
                {group.items.map((item) => {
                  const active = item.slug === currentSlug;
                  return (
                    <Link
                      key={item.slug}
                      href={`/docs/${item.slug}`}
                      onClick={onNav}
                      className={`block rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                        active
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
