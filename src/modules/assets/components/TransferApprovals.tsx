"use client"
import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Check, X } from 'lucide-react';

export default function TransferApprovals() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/transfers?status=Requested');
      const data = await res.json();
      setRequests(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await fetch('/api/transfers/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transferRequestId: id })
      });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-sm text-slate-500">Loading transfer requests...</div>;
  if (requests.length === 0) return null; // hide if none

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <ArrowLeftRight size={20} className="text-blue-500" />
        Pending Transfer Requests
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map(req => (
          <div key={req.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900">{req.asset?.name}</h3>
            <p className="text-xs text-slate-500 mb-3">{req.asset?.tag}</p>
            
            <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-slate-500">From User:</span>
                <span className="font-medium">{req.fromUserId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Requesting:</span>
                <span className="font-medium">{req.toUserId}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => handleApprove(req.id)}
                className="flex-1 flex justify-center items-center gap-1 bg-green-50 text-green-700 hover:bg-green-100 py-2 rounded-md text-sm font-medium transition-colors"
                title="Approve"
              >
                <Check size={16} /> Approve
              </button>
              {/* Note: Reject endpoint is not requested by prompt explicitly, but let's allow hiding */}
              <button 
                className="flex-none px-3 flex justify-center items-center bg-slate-50 text-slate-600 hover:bg-slate-100 py-2 rounded-md transition-colors"
                title="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
