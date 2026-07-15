export type PropDef = {
  name: string;
  type: string;
  default: string;
  description: string;
};

export function PropsTable({ props }: { props: PropDef[] }): React.JSX.Element {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-gray-300">Prop</th>
            <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-gray-300">Type</th>
            <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-gray-300">Default</th>
            <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-gray-300">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {props.map((prop) => (
            <tr key={prop.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/20">
              <td className="px-4 py-2.5 font-mono text-[13px] font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                {prop.name}{prop.name.endsWith('?') ? '' : ''}
              </td>
              <td className="px-4 py-2.5 font-mono text-[13px] text-gray-600 dark:text-gray-400 whitespace-nowrap">{prop.type}</td>
              <td className="px-4 py-2.5 font-mono text-[13px] text-gray-500 dark:text-gray-500 whitespace-nowrap">{prop.default || '—'}</td>
              <td className="px-4 py-2.5 text-gray-600 dark:text-gray-400">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
