'use client';

import { useState, useEffect } from 'react';
import { ZemenCalendar } from '@zemen/react';
import { isAuthenticated } from '../../../lib/api-client';
import type { Task } from '@zemen/scheduler';
import { DatePill } from '../../../components/DatePill';

export default function TodayPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    async function load() {
      if (!isAuthenticated()) return;
      try {
        const res = await fetch(`http://localhost:4000/api/v1/tasks/upcoming?days=1`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('zemen_access_token')}` },
        });
        if (res.ok) {
          const data = await res.json();
          setTasks(Array.isArray(data) ? data : (data.data || []));
        } else {
          setTasks([]);
        }
      } catch (_) { 
        setTasks([]);
      }
    }
    load();
  }, []);

  const todaysTasks = tasks.filter((t) => t.status === 'pending');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-600 text-red-600 dark:text-red-400';
      case 'high': return 'border-yellow-500 text-yellow-600 dark:text-yellow-400';
      case 'medium': return 'border-green-600 text-green-700 dark:text-green-400';
      case 'low': return 'border-gray-400 text-gray-500 dark:text-gray-400';
      default: return 'border-gray-300 text-gray-500 dark:text-gray-400';
    }
  };

  return (
    <div className="py-8 px-8 max-w-[1200px] mx-auto">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <h1 className="text-[32px] font-bold text-[#0B3D16] dark:text-emerald-300 leading-none">Today</h1>
          <DatePill />
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-500"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              className="bg-white/60 dark:bg-white/10 focus:bg-white dark:focus:bg-white/20 border-0 rounded-full pl-9 pr-4 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 w-64 focus:ring-2 focus:ring-[#FDF4E5] dark:focus:ring-emerald-500/30 focus:outline-none transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#FCF5E3] dark:ring-gray-800" />
            </button>
            <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
        {/* Left Column: Schedule */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Schedule</h2>
              <span className="px-3 py-1 bg-[#FDF4E5] dark:bg-emerald-900/40 text-xs font-bold text-gray-600 dark:text-gray-300 rounded-full">
                {todaysTasks.length} Tasks Remaining
              </span>
            </div>
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
              <button className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              </button>
              <button className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="11" y2="14"/><line x1="21" y1="18" x2="15" y2="18"/></svg>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {todaysTasks.length === 0 ? (
              <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] dark:shadow-[0_2px_10px_rgb(0,0,0,0.2)] p-10 text-center border border-dashed border-[#F6E1C3] dark:border-emerald-900/30">
                <div className="w-16 h-16 bg-[#FDF4E5] dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-4 text-[#0B3D16] dark:text-emerald-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">You&apos;re all caught up!</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">No tasks remaining for today.</p>
              </div>
            ) : (
              todaysTasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`bg-white dark:bg-[#111827] rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] dark:shadow-[0_2px_10px_rgb(0,0,0,0.2)] p-5 flex items-center gap-4 border-l-[3px] ${getPriorityColor(task.priority).split(' ')[0]}`}
                >
                  <button className="text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-400 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"/></svg>
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {task.time || '12:00 PM'}
                      </span>
                      <span className={`flex items-center gap-1.5 uppercase tracking-wider ${getPriorityColor(task.priority).split(' ')[1]}`}>
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/></svg>
                        {task.priority}
                      </span>
                    </div>
                  </div>

                  <div className="px-3 py-1.5 bg-[#FDF4E5] dark:bg-emerald-900/40 rounded-md text-xs font-bold text-gray-700 dark:text-gray-200 border border-[#F6E1C3]/30 dark:border-emerald-800/30">
                    {task.dateType === 'ethiopian'
                      ? `🇪🇹 ${task.primaryMonth}/${task.primaryDay}`
                      : `🇬🇷 ${task.gregorianDate || `${task.primaryYear}-${String(task.primaryMonth).padStart(2, '0')}-${String(task.primaryDay).padStart(2, '0')}`}`}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Widgets */}
        <div className="space-y-6">
          
          {/* Calendar Widget */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] dark:shadow-[0_2px_10px_rgb(0,0,0,0.2)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-medium text-gray-900 dark:text-gray-100">June / Sēnē</h3>
              <div className="flex gap-2">
                <button className="p-1 hover:bg-gray-50 dark:hover:bg-white/10 rounded-md text-gray-400"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
                <button className="p-1 hover:bg-gray-50 dark:hover:bg-white/10 rounded-md text-gray-400"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>
              </div>
            </div>
            
            <div className="min-h-[200px]">
              <ZemenCalendar />
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-[11px] font-medium text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> Urgent</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-600"></span> Standard</div>
            </div>
          </div>

          {/* Quote Widget */}
          <div className="bg-[#1B5E20] rounded-2xl p-6 shadow-sm relative overflow-hidden text-white">
            <div className="relative z-10">
              <p className="text-[15px] italic font-medium leading-relaxed mb-4 text-emerald-50">
                &ldquo;Time is what we want most, but what we use worst.&rdquo;
              </p>
              <p className="text-[11px] font-bold tracking-wider text-emerald-400/80 uppercase">
                — William Penn
              </p>
            </div>
            {/* Decorative element */}
            <svg className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-emerald-900/50" fill="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="4" width="20" height="16" rx="2" strokeWidth="2" stroke="currentColor" fill="none" />
              <line x1="2" y1="9" x2="22" y2="9" strokeWidth="2" stroke="currentColor" />
            </svg>
          </div>

          {/* Did you know Widget */}
          <div className="bg-[#FFFDF9] dark:bg-[#1a1a2e] border border-[#F6E1C3] dark:border-emerald-900/30 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-yellow-600 dark:text-yellow-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Did you know?</h3>
            </div>
            <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed">
              The Ethiopian calendar has 13 months. The 13th month, <strong>Pagumē</strong>, usually has 5 days, or 6 in a leap year.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
