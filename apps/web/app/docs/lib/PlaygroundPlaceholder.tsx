export function PlaygroundPlaceholder({ componentName }: { componentName: string }): React.JSX.Element {
  return (
    <div className="rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/20 p-8 flex flex-col items-center justify-center text-center">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 text-gray-300 dark:text-gray-600" aria-hidden="true">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
      <div className="text-sm font-medium text-gray-400 dark:text-gray-500">Live playground</div>
      <div className="text-xs text-gray-300 dark:text-gray-600 mt-1">
        Interactive {componentName} demo with prop controls — coming in Phase 9
      </div>
    </div>
  );
}
