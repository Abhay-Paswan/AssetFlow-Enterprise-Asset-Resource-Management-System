'use client';

import { useEffect, useState, use } from 'react';
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuditChecklistPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [cycle, setCycle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    fetchCycle();
  }, [id]);

  const fetchCycle = () => {
    fetch('/api/audits/cycles/' + id)
      .then(res => res.json())
      .then(data => {
        setCycle(data);
        setLoading(false);
      })
      .catch(console.error);
  };

  const updateItemStatus = async (itemId: string, status: string) => {
    try {
      await fetch(`/api/audits/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchCycle();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseCycle = async () => {
    if (!confirm('Are you sure you want to close this audit cycle? This will mutate asset statuses for missing/damaged items.')) return;
    setClosing(true);
    try {
      const res = await fetch(`/api/audits/cycles/${id}/close`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        router.push('/audits');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setClosing(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  if (!cycle) return <div className="p-8">Audit cycle not found</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Link href="/audits" className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Audits
      </Link>
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{cycle.name} Checklist</h1>
          <p className="text-slate-600">
            Scope: {cycle.scopeType} - {cycle.scopeValue} | Status:{' '}
            <span className={`font-medium ${cycle.status === 'Active' ? 'text-emerald-600' : 'text-slate-600'}`}>
              {cycle.status}
            </span>
          </p>
        </div>
        {cycle.status === 'Active' && (
          <button 
            onClick={handleCloseCycle} 
            disabled={closing}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {closing ? 'Closing...' : 'Close Audit Cycle'}
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <ul className="divide-y divide-slate-200">
          {cycle.items?.map((item: any) => (
            <li key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div>
                <p className="font-medium text-slate-900">Asset: {item.asset?.name || item.assetId}</p>
                <p className="text-sm text-slate-500">Current Status: {item.status}</p>
              </div>
              {cycle.status === 'Active' && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => updateItemStatus(item.id, 'Verified')}
                    className={`px-3 py-1 text-sm rounded border flex items-center gap-1 ${item.status === 'Verified' ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-white border-slate-300 hover:bg-slate-50'}`}
                  >
                    <CheckCircle className="w-4 h-4" /> Verified
                  </button>
                  <button 
                    onClick={() => updateItemStatus(item.id, 'Damaged')}
                    className={`px-3 py-1 text-sm rounded border flex items-center gap-1 ${item.status === 'Damaged' ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-slate-300 hover:bg-slate-50'}`}
                  >
                    <AlertTriangle className="w-4 h-4" /> Damaged
                  </button>
                  <button 
                    onClick={() => updateItemStatus(item.id, 'Missing')}
                    className={`px-3 py-1 text-sm rounded border flex items-center gap-1 ${item.status === 'Missing' ? 'bg-red-100 border-red-300 text-red-800' : 'bg-white border-slate-300 hover:bg-slate-50'}`}
                  >
                    <XCircle className="w-4 h-4" /> Missing
                  </button>
                </div>
              )}
            </li>
          ))}
          {(!cycle.items || cycle.items.length === 0) && (
            <li className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
              <Info className="w-6 h-6 text-slate-400" />
              No items in this audit cycle.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
