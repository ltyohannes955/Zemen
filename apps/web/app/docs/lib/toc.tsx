'use client';

import * as React from 'react';

type TOCSection = { id: string; heading: string };

export function DocTOC({ sections }: { sections: TOCSection[] }): React.JSX.Element {
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
      { rootMargin: '-80px 0px -60% 0px' },
    );

    for (const { id } of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  if (sections.length === 0) return <div />;

  return (
    <aside className="hidden xl:block w-48 flex-shrink-0">
      <nav className="sticky top-24 space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-3">On this page</div>
        {sections.map(({ id, heading }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`block text-[13px] leading-relaxed transition-colors ${
              activeId === id
                ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            {heading}
          </a>
        ))}
      </nav>
    </aside>
  );
}
