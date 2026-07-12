'use client';

import { useEffect, useState } from 'react';
import { Activity, Clock } from 'lucide-react';

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/activity')
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-slate-900">Activity Log</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <ul className="divide-y divide-slate-200">
          {logs.map(log => (
            <li key={log.id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex space-x-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-slate-900">{log.action}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm text-slate-600">
                    {log.message}
                  </p>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded">
                      User: {log.user?.name || 'System'}
                    </span>
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded">
                      {log.entityType} ({log.entityId.slice(0, 8)}...)
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
          {logs.length === 0 && (
            <li className="p-8 text-center text-slate-500">No recent activity.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
