'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { getDocSidebar } from './lib/content';

type SidebarItem = ReturnType<typeof getDocSidebar>[number];

export function DocSidebar({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();
  const currentSlug = pathname.split('/').pop() || 'introduction';

  return (
    <aside className="hidden lg:block w-56 flex-shrink-0">
      <nav className="sticky top-24 space-y-1">
        {items.map((item) => {
          const active = item.slug === currentSlug;
          return (
            <Link
              key={item.slug}
              href={`/docs/${item.slug}`}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
