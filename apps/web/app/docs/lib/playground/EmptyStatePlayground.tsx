'use client';

import * as React from 'react';
import { ZemenEmptyState } from '@zemen/react';
import { ComponentPlayground } from './ComponentPlayground';
import type { ControlDef, ControlState, CodeGenerator } from './types';

const CONTROLS: ControlDef[] = [
  { type: 'text', prop: 'message', label: 'Message', defaultValue: 'No tasks found' },
  { type: 'text', prop: 'description', label: 'Description', defaultValue: 'Create a new task to get started.' },
];

const generateCode: CodeGenerator = (state: ControlState): string => {
  const lines: string[] = ['<ZemenEmptyState'];
  if (state.message) {
    lines.push(`  message="${state.message}"`);
  }
  if (state.description) {
    lines.push(`  description="${state.description}"`);
  }
  lines.push('/>');
  return lines.join('\n');
};

export function ZemenEmptyStatePlayground(): React.JSX.Element {
  return (
    <ComponentPlayground
      component={ZemenEmptyState}
      controls={CONTROLS}
      generateCode={generateCode}
    />
  );
}
