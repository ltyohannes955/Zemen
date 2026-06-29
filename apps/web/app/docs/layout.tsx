import { getDocSidebar } from './lib/content';
import { DocSidebar } from './sidebar';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const sidebar = getDocSidebar();

  return (
    <div className="mx-auto flex max-w-7xl px-6 py-8 gap-8">
      <DocSidebar items={sidebar} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
