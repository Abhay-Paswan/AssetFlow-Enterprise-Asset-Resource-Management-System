'use client';

import { useEffect, useState } from 'react';
import { ClipboardList, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AuditsPage() {
  const [cycles, setCycles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/audits/cycles')
      .then(res => res.json())
      .then(data => {
        setCycles(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-slate-900">Audit Cycles</h1>
        </div>
        <Link href="/audits/new" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Cycle
        </Link>
      </div>

      {loading ? (
        <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Scope</th>
                <th className="p-4 font-medium">Date Range</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {cycles.map(cycle => (
                <tr key={cycle.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">{cycle.name}</td>
                  <td className="p-4 text-slate-600">{cycle.scopeType}: {cycle.scopeValue}</td>
                  <td className="p-4 text-slate-600">
                    {new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${cycle.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                      {cycle.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{cycle._count?.items || 0}</td>
                  <td className="p-4">
                    <Link href={`/audits/${cycle.id}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                      View Checklist
                    </Link>
                  </td>
                </tr>
              ))}
              {cycles.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">No audit cycles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
