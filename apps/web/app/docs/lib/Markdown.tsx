'use client';

import * as React from 'react';

function renderLine(line: string, index: number): React.ReactNode {
  const trimmed = line.trim();

  if (trimmed.startsWith('```')) return null;

  const processed: React.ReactNode[] = [];
  const parts = trimmed.split(/(`[^`]+`)/g);
  for (const part of parts) {
    if (part.startsWith('`') && part.endsWith('`')) {
      processed.push(
        <code key={part} className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[13px] font-medium text-emerald-600 dark:text-emerald-400 font-mono">
          {part.slice(1, -1)}
        </code>,
      );
    } else if (part.includes('**')) {
      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      for (const bp of boldParts) {
        if (bp.startsWith('**') && bp.endsWith('**')) {
          processed.push(<strong key={bp} className="font-semibold text-gray-900 dark:text-gray-100">{bp.slice(2, -2)}</strong>);
        } else if (bp) {
          processed.push(bp);
        }
      }
    } else if (part) {
      processed.push(part);
    }
  }

  return <p key={index} className="leading-relaxed text-gray-600 dark:text-gray-400">{processed}</p>;
}

export function Markdown({ text }: { text: string }): React.JSX.Element {
  const lines = text.trim().split('\n');
  const blocks: React.ReactNode[] = [];
  let inCode = false;
  let codeLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      if (inCode) {
        blocks.push(
          <pre key={`code-${i}`} className="overflow-x-auto rounded-lg bg-gray-900 dark:bg-gray-950 p-4 text-sm text-gray-100 font-mono leading-relaxed my-4">
            <code>{codeLines.join('\n')}</code>
          </pre>,
        );
        codeLines = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
      const bulletText = trimmed.replace(/^[•\-*]\s*/, '');
      blocks.push(
        <li key={`li-${i}`} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
          <span>{bulletText}</span>
        </li>,
      );
      continue;
    }

    if (trimmed === '') {
      blocks.push(<div key={`spacer-${i}`} className="h-3" />);
      continue;
    }

    blocks.push(renderLine(line, i));
  }

  if (inCode) {
    blocks.push(
      <pre key="code-unclosed" className="overflow-x-auto rounded-lg bg-gray-900 dark:bg-gray-950 p-4 text-sm text-gray-100 font-mono leading-relaxed my-4">
        <code>{codeLines.join('\n')}</code>
      </pre>,
    );
  }

  return <div className="space-y-2">{blocks}</div>;
}
