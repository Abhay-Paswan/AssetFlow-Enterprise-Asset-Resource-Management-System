'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardList, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewAuditCyclePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    scopeType: 'Department',
    scopeValue: '',
    startDate: '',
    endDate: '',
    auditorIds: [] as string[]
  });

  useEffect(() => {
    fetch('/api/organization/users')
      .then(res => res.json())
      .then(setUsers)
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/audits/cycles/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        router.push('/audits');
      } else {
        alert('Failed to create audit cycle');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAuditorToggle = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      auditorIds: prev.auditorIds.includes(userId) 
        ? prev.auditorIds.filter(id => id !== userId)
        : [...prev.auditorIds, userId]
    }));
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/audits" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2 text-sm font-medium mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Audits
        </Link>
        <div className="flex items-center gap-3">
          <ClipboardList className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-slate-900">Create Audit Cycle</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cycle Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Q3 IT Equipment Audit"
              className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Scope Type</label>
              <select 
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.scopeType}
                onChange={e => setFormData({...formData, scopeType: e.target.value})}
              >
                <option value="Department">Department</option>
                <option value="Location">Location</option>
                <option value="Category">Category</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Scope Value</label>
              <input 
                required
                type="text" 
                placeholder="e.g. IT Department or HQ Building"
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.scopeValue}
                onChange={e => setFormData({...formData, scopeValue: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input 
                required
                type="date" 
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input 
                required
                type="date" 
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.endDate}
                onChange={e => setFormData({...formData, endDate: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Assign Auditors</label>
            <div className="border border-slate-200 rounded-lg max-h-48 overflow-y-auto p-4 space-y-2">
              {users.map(user => (
                <label key={user.id} className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    checked={formData.auditorIds.includes(user.id)}
                    onChange={() => handleAuditorToggle(user.id)}
                  />
                  <div>
                    <span className="block text-sm font-medium text-gray-900">{user.name}</span>
                    <span className="block text-xs text-gray-500">{user.role}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => router.push('/audits')}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Cycle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
