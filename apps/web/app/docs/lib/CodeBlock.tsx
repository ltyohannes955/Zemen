'use client';

import * as React from 'react';

export function CodeBlock({ code, lang = '' }: { code: string; lang?: string }): React.JSX.Element {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [code]);

  return (
    <div className="group relative">
      <pre className="overflow-x-auto rounded-lg bg-gray-900 dark:bg-gray-950 p-4 text-sm text-gray-100 font-mono leading-relaxed">
        {lang && <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">{lang}</div>}
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md bg-gray-800/50 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-700 hover:text-gray-200 transition-all"
        aria-label={copied ? 'Copied' : 'Copy code'}
      >
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        )}
      </button>
    </div>
  );
}
