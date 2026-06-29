'use client';

import * as React from 'react';
import type { DocSection } from '../lib/content';

export function DocTOC({ sections }: { sections: DocSection[] }) {
  const [activeId, setActiveId] = React.useState<string>('');

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  return (
    <aside className="hidden xl:block w-52 flex-shrink-0">
      <div className="sticky top-24">
        <div className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          On this page
        </div>
        <nav className="space-y-1">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`block text-sm transition-colors ${
                activeId === section.id
                  ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {section.heading}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
