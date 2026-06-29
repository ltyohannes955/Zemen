export function DocContent({ content }: { content: string }) {
  const blocks = parseContent(content);

  return (
    <div className="space-y-3 text-gray-600 dark:text-gray-400">
      {blocks.map((block, i) => {
        if (block.type === 'code') {
          return (
            <pre
              key={i}
              className="rounded-lg bg-gray-900 p-4 text-sm font-mono text-gray-300 overflow-x-auto"
            >
              <code>{block.text}</code>
            </pre>
          );
        }
        if (block.type === 'list') {
          return (
            <ul key={i} className="space-y-1.5">
              {block.items!.map((item, j) => (
                <li key={j} className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1 flex-shrink-0">•</span>
                  <span>{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="leading-relaxed">
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}

type Block =
  | { type: 'paragraph'; text: string }
  | { type: 'code'; text: string }
  | { type: 'list'; items: string[] };

function parseContent(content: string): Block[] {
  const lines = content.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      i++;
      continue;
    }

    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({ type: 'code', text: codeLines.join('\n') });
      continue;
    }

    if (line.trimStart().startsWith('•') || line.trimStart().startsWith('-') || line.trimStart().startsWith('*')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].trimStart().startsWith('•') || lines[i].trimStart().startsWith('-') || lines[i].trimStart().startsWith('*'))) {
        items.push(lines[i].trim().replace(/^[•\-*]\s*/, ''));
        i++;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('```')
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: 'paragraph', text: paraLines.join(' ') });
    } else {
      i++;
    }
  }

  return blocks;
}

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const code = part.slice(1, -1);
      return (
        <code
          key={i}
          className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm font-mono text-emerald-600 dark:text-emerald-400"
        >
          {code}
        </code>
      );
    }
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((bp, j) => {
      if (bp.startsWith('**') && bp.endsWith('**')) {
        return <strong key={`${i}-${j}`} className="font-semibold text-gray-900 dark:text-gray-100">{bp.slice(2, -2)}</strong>;
      }
      return <span key={`${i}-${j}`}>{bp}</span>;
    });
  });
}
