"use client"
import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface Props {
  assetId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AllocationModal({ assetId, onClose, onSuccess }: Props) {
  const [assigneeId, setAssigneeId] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [conflict, setConflict] = useState<any>(null);

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setConflict(null);

    try {
      const res = await fetch('/api/allocations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId, assigneeId, expectedReturnDate })
      });
      const data = await res.json();
      
      if (res.status === 409) {
        setConflict(data);
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Allocation failed');
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTransferRequest = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/transfers/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId, toUserId: assigneeId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Transfer request failed');
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden relative">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">Allocate Asset</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full text-slate-500">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}
          
          {conflict ? (
            <div className="mb-6 p-4 border border-amber-200 bg-amber-50 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="text-amber-600 mt-0.5 mr-2" size={20} />
                <div>
                  <h4 className="font-semibold text-amber-800 mb-1">Conflict Detected</h4>
                  <p className="text-sm text-amber-700 mb-3">{conflict.error}</p>
                  {conflict.canRequestTransfer && (
                    <button 
                      onClick={handleTransferRequest}
                      disabled={loading}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md text-sm font-medium w-full transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Requesting...' : 'Request Transfer'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <form id="allocate-form" onSubmit={handleAllocate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Assignee ID (User or Dept)</label>
                  <input required type="text" value={assigneeId} onChange={e => setAssigneeId(e.target.value)} className="mt-1 block w-full outline-none rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Expected Return Date</label>
                  <input type="date" value={expectedReturnDate} onChange={e => setExpectedReturnDate(e.target.value)} className="mt-1 block w-full rounded-md outline-none border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
              </div>
            </form>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800">
            Cancel
          </button>
          {!conflict && (
            <button form="allocate-form" disabled={loading} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
              {loading ? 'Processing...' : 'Allocate'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
