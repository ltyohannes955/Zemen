import { notFound } from 'next/navigation';
import { getDocPage, DOC_PAGES } from '../lib/content';
import { DocTOC } from './toc';
import { DocContent } from './content';

export function generateStaticParams() {
  return DOC_PAGES.map((p) => ({ slug: p.slug }));
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

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
              <DocContent content={section.content} />
            </section>
          ))}
        </div>
      </article>
      <DocTOC sections={page.sections} />
    </div>
  );
}
