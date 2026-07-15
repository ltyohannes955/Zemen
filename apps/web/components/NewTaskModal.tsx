'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ZemenDatePicker, type SelectedDateInfo } from '@zemen/react';

export function NewTaskModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dateType: 'gregorian',
    dateObj: null as SelectedDateInfo | null,
    time: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        dateType: formData.dateType,
        time: formData.time || undefined,
      };

      if (formData.dateObj) {
        payload.primaryYear = formData.dateType === 'gregorian' ? formData.dateObj.gregYear : formData.dateObj.ethYear;
        payload.primaryMonth = formData.dateType === 'gregorian' ? formData.dateObj.gregMonth : formData.dateObj.ethMonth;
        payload.primaryDay = formData.dateType === 'gregorian' ? formData.dateObj.gregDay : formData.dateObj.ethDay;
        
        payload.secondaryYear = formData.dateType === 'gregorian' ? formData.dateObj.ethYear : formData.dateObj.gregYear;
        payload.secondaryMonth = formData.dateType === 'gregorian' ? formData.dateObj.ethMonth : formData.dateObj.gregMonth;
        payload.secondaryDay = formData.dateType === 'gregorian' ? formData.dateObj.ethDay : formData.dateObj.gregDay;
      } else {
        const d = new Date();
        payload.primaryYear = d.getFullYear();
        payload.primaryMonth = d.getMonth() + 1;
        payload.primaryDay = d.getDate();
        payload.secondaryYear = d.getFullYear();
        payload.secondaryMonth = d.getMonth() + 1;
        payload.secondaryDay = d.getDate();
      }

      const res = await fetch('http://localhost:4000/api/v1/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('zemen_access_token')}`
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setFormData({ title: '', description: '', priority: 'medium', dateType: 'gregorian', dateObj: null, time: '' });
        onClose();
        router.refresh();
      } else {
        alert('Failed to create task');
      }
    } catch (err) {
      alert('Error creating task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0B3D16]/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-[500px] rounded-[24px] shadow-[0_16px_40px_rgba(11,61,22,0.15)] border border-[#F6E1C3]/50 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-[20px] font-bold text-[#0B3D16]">Create New Task</h2>
            <p className="text-gray-500 text-[13px] mt-1">Add a new task to your schedule.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-1.5">Task Title *</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0B3D16] focus:border-transparent outline-none transition-all text-[14px] text-gray-900"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Quarterly Review Meeting"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-1.5">Description</label>
            <textarea
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0B3D16] focus:border-transparent outline-none transition-all resize-none text-[14px] text-gray-900"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Add details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-1.5">Priority</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0B3D16] focus:border-transparent outline-none transition-all bg-white text-[14px] text-gray-900"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-1.5">Time</label>
              <input
                type="time"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0B3D16] focus:border-transparent outline-none transition-all text-[14px] text-gray-900"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-50">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-1.5">Calendar</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0B3D16] focus:border-transparent outline-none transition-all bg-white text-[14px] text-gray-900"
                value={formData.dateType}
                onChange={(e) => setFormData({...formData, dateType: e.target.value})}
              >
                <option value="gregorian">Gregorian</option>
                <option value="ethiopian">Ethiopian</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-1.5">Date *</label>
              <ZemenDatePicker
                value={formData.dateObj}
                onChange={(date) => setFormData({...formData, dateObj: date})}
                themeColor="#0B3D16"
              />
            </div>
          </div>
          <button type="submit" className="hidden" />
        </form>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 rounded-b-[24px] bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-200/50 transition-colors text-[14px]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.dateObj}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-b from-[#0B3D16] to-[#07290f] hover:from-[#0d4a1b] hover:to-[#093513] text-white font-bold shadow-[0_4px_14px_rgba(11,61,22,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-[14px]"
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
