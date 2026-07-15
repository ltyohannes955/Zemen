'use client';

import * as React from 'react';
import { PlaygroundControls } from './controls';
import type { ControlDef, ControlState, CodeGenerator } from './types';

function highlightJSX(code: string): (React.ReactNode | string)[] {
  const tokens: (React.ReactNode | string)[] = [];
  const regex = /(&lt;\/?)([\w]+)|(\s+)(\w+)(=)(&quot;)([^&]*)(&quot;)|(\s+)(\w+)(=)(\{)/g;

  const replacements: { index: number; length: number; node: React.ReactNode }[] = [];

  for (const match of code.matchAll(regex)) {
    const full = match[0];
    const idx = match.index;
    if (idx === undefined) continue;

    if (match[1] && match[2]) {
      replacements.push({ index: idx, length: match[1].length, node: <span key={`tag-${idx}`} className="text-emerald-400">{match[1]}</span> });
      replacements.push({ index: idx + match[1].length, length: match[2].length, node: <span key={`tagname-${idx}`} className="text-emerald-300 font-semibold">{match[2]}</span> });
    }
    if (match[4] && match[5] !== undefined) {
      const wsIdx = idx + full.indexOf(match[4]);
      const eqIdx = wsIdx + match[4].length;
      const valIdx = eqIdx + 1;
      replacements.push({ index: wsIdx, length: match[4].length, node: <span key={`prop-${idx}`} className="text-amber-300">{match[4]}</span> });
      replacements.push({ index: eqIdx, length: 1, node: <span key={`eq-${idx}`} className="text-gray-500">{'='}</span> });
      if (match[6]) {
        const qlen = match[6]?.length ?? 0;
        replacements.push({ index: valIdx, length: qlen, node: <span key={`q1-${idx}`} className="text-gray-500">{match[6]}</span> });
        if (match[7]) {
          replacements.push({ index: valIdx + qlen, length: match[7].length, node: <span key={`str-${idx}`} className="text-green-300">{match[7]}</span> });
        }
        if (match[8]) {
          replacements.push({ index: valIdx + qlen + (match[7]?.length ?? 0), length: match[8].length, node: <span key={`q2-${idx}`} className="text-gray-500">{match[8]}</span> });
        }
      }
    }
    if (match[9] && match[10] && match[11] && match[12]) {
      const wsIdx = idx + full.indexOf(match[10]);
      const eqIdx = wsIdx + match[10].length;
      replacements.push({ index: wsIdx, length: match[10].length, node: <span key={`prop2-${idx}`} className="text-amber-300">{match[10]}</span> });
      replacements.push({ index: eqIdx, length: 1, node: <span key={`eq2-${idx}`} className="text-gray-500">{'='}</span> });
      replacements.push({ index: eqIdx + 1, length: 1, node: <span key={`brace-${idx}`} className="text-blue-400">{'{'}</span> });
    }
  }

  if (replacements.length === 0) {
    return [code];
  }

  replacements.sort((a, b) => a.index - b.index);
  let ptr = 0;
  for (const r of replacements) {
    if (r.index > ptr) {
      tokens.push(code.slice(ptr, r.index));
    }
    tokens.push(r.node);
    ptr = r.index + r.length;
  }
  if (ptr < code.length) {
    tokens.push(code.slice(ptr));
  }

  return tokens;
}

function CodeSnippet({ code }: { code: string }): React.JSX.Element {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [code]);

  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return (
    <div className="group relative">
      <pre className="overflow-x-auto rounded-lg bg-gray-900 dark:bg-gray-950 p-4 text-sm font-mono leading-relaxed">
        <code>{highlightJSX(escaped)}</code>
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

export type ComponentPlaygroundProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  defaultProps?: Record<string, unknown>;
  controls: ControlDef[];
  generateCode: CodeGenerator;
  mockTasks?: Record<string, unknown>[];
  tasksProp?: string;
  children?: React.ReactNode;
};

export function ComponentPlayground({
  component: Component,
  defaultProps = {},
  controls,
  generateCode,
  mockTasks,
  tasksProp = 'tasks',
  children,
}: ComponentPlaygroundProps): React.JSX.Element {
  const initial = React.useMemo(() => {
    const s: ControlState = {};
    for (const c of controls) {
      s[c.prop] = c.defaultValue;
    }
    return s;
  }, [controls]);

  const [state, setState] = React.useState<ControlState>(initial);
  const [tasks, setTasks] = React.useState(mockTasks);

  const setControl = React.useCallback((prop: string, value: unknown) => {
    setState((prev) => ({ ...prev, [prop]: value }));
  }, []);

  const previewProps: Record<string, unknown> = { ...defaultProps };
  for (const c of controls) {
    previewProps[c.prop] = state[c.prop];
  }

  if (tasks && tasksProp && state.showTasks !== false) {
    previewProps[tasksProp] = tasks;
    if (!previewProps['onTaskReschedule']) {
      previewProps['onTaskReschedule'] = (task: Record<string, unknown>, newDate: Record<string, unknown>) => {
        setTasks((prev) => {
          if (!prev) return prev;
          return prev.map((t) =>
            t.id === task.id
              ? { ...t, primaryYear: newDate.year, primaryMonth: newDate.month, primaryDay: newDate.day }
              : t,
          );
        });
      };
    }
  }

  const code = React.useMemo(() => generateCode(state), [state, generateCode]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 min-h-[300px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111827] p-4 overflow-hidden">
          <div className="w-full h-full">
            <Component {...previewProps} />
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 p-4">
            <PlaygroundControls controls={controls} state={state} onChange={setControl} />
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-0 overflow-hidden">
            <CodeSnippet code={code} />
          </div>
        </div>
      </div>

      {children && <div>{children}</div>}
    </div>
  );
}
