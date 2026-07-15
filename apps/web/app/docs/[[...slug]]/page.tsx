import { redirect, notFound } from 'next/navigation';
import { getDocPage, DOC_PAGES } from '../lib/content';
import { DocTOC } from '../lib/toc';

export function generateStaticParams() {
  return DOC_PAGES.map((p) => ({ slug: p.slug.split('/') }));
}

export default async function DocPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolved = await params;
  if (!resolved.slug || resolved.slug.length === 0) {
    redirect('/docs/introduction');
  }

  const slug = resolved.slug.join('/');

  const page = getDocPage(slug);
  if (!page) {
    notFound();
  }

  return (
    <div className="flex gap-8">
      <article className="flex-1 min-w-0 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{page.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{page.description}</p>
        <div className="space-y-8">
          {page.sections.map((section) => (
            <section key={section.id} id={section.id}>
              <h2 className="text-xl font-semibold tracking-tight mb-3">{section.heading}</h2>
              {section.content}
            </section>
          ))}
        </div>
      </article>
      <DocTOC sections={page.sections.map((s) => ({ id: s.id, heading: s.heading }))} />
    </div>
  );
}
