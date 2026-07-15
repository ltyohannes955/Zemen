'use client';

import { useState, useEffect } from 'react';
import { isAuthenticated } from '../../../lib/api-client';
import type { Task } from '@zemen/scheduler';

function getTaskDate(task: Task): string {
  return task.gregorianDate || `${task.primaryYear}-${String(task.primaryMonth).padStart(2, '0')}-${String(task.primaryDay).padStart(2, '0')}`;
}

export default function UpcomingPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function load() {
      if (!isAuthenticated()) return;
      try {
        const res = await fetch(`http://localhost:4000/api/v1/tasks/upcoming?days=7`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('zemen_access_token')}` },
        });
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        }
      } catch (_) { /* ignore fetch errors */ }
    }
    load();
  }, []);

  const pending = tasks.filter((t) => t.status === 'pending');
  const completed = tasks.filter((t) => t.status === 'completed');
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Upcoming</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">Next 7 days</p>

      {pending.length === 0 && completed.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-gray-400 dark:text-gray-500">No upcoming tasks</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Pending ({pending.length})
              </h2>
              <div className="space-y-2">
                {pending.map((task) => (
                  <div key={task.id} className="card p-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{task.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Due: {getTaskDate(task) === today ? 'Today' : getTaskDate(task)}
                      {task.time && ` at ${task.time}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {completed.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Completed ({completed.length})
              </h2>
              <div className="space-y-2">
                {completed.map((task) => (
                  <div key={task.id} className="card p-3 opacity-60">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-through">{task.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
