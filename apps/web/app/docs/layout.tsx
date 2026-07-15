import { getSidebar } from './lib/sidebar';
import { DocsShell } from './docs-shell';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const groups = getSidebar();

  return (
    <div className="mx-auto flex max-w-7xl px-4 sm:px-6 py-4 sm:py-8 gap-8 min-h-[calc(100vh-4rem)]">
      <aside className="hidden lg:block w-56 flex-shrink-0">
        <div className="sticky top-24 overflow-y-auto max-h-[calc(100vh-8rem)]">
          <DocsShell groups={groups} />
        </div>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
