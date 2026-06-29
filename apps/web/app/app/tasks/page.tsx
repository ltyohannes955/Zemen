'use client';

import { useState, useEffect } from 'react';
import { isAuthenticated } from '../../../lib/api-client';
import type { Task } from '@zemen/scheduler';
import { Calendar01Icon, Clock01Icon } from 'hugeicons-react';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    async function load() {
      if (!isAuthenticated()) return;
      try {
        const params = filter !== 'all' ? `?status=${filter}` : '';
        const res = await fetch(`http://localhost:4000/api/v1/tasks${params}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('zemen_access_token')}` },
        });
        if (res.ok) {
          const data = await res.json();
          setTasks(data.data || []);
        }
      } catch (_) { /* ignore fetch errors */ }
    }
    load();
  }, [filter]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">All Tasks</h1>

      <div className="flex gap-2">
        {['all', 'pending', 'completed', 'cancelled'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {tasks.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-gray-400 dark:text-gray-500">No tasks found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="card p-4 flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                task.priority === 'high' ? 'bg-red-500 dark:bg-red-400' :
                task.priority === 'medium' ? 'bg-yellow-500 dark:bg-yellow-400' :
                task.priority === 'low' ? 'bg-blue-500 dark:bg-blue-400' : 'bg-gray-300 dark:bg-gray-600'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium ${
                    task.status === 'completed'
                      ? 'line-through text-gray-400 dark:text-gray-500'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {task.title}
                  </p>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    task.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' :
                    task.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                    'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}>
                    {task.status}
                  </span>
                </div>
                {task.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{task.description}</p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar01Icon className="w-3 h-3" />
                    {task.dateType === 'ethiopian'
                      ? `Eth: ${task.primaryYear}-${String(task.primaryMonth).padStart(2, '0')}-${String(task.primaryDay).padStart(2, '0')}`
                      : `Greg: ${task.gregorianDate || `${task.primaryYear}-${String(task.primaryMonth).padStart(2, '0')}-${String(task.primaryDay).padStart(2, '0')}`}`
                    }
                  </span>
                  {task.time && (
                    <span className="flex items-center gap-1">
                      <Clock01Icon className="w-3 h-3" />
                      {task.time}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
