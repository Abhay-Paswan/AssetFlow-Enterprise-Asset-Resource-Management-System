'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Wrench, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function MaintenancePage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    assetId: '',
    issue: '',
    priority: 'Medium',
    photoUrl: ''
  });

  useEffect(() => {
    // Fetch all assets
    fetch('/api/assets')
      .then(res => res.json())
      .then(data => {
          if(Array.isArray(data)) setAssets(data);
      })
      .catch(console.error);
      
    fetchRequests();
  }, []);
  
  const fetchRequests = () => {
    fetch('/api/operations/maintenance')
      .then(res => res.json())
      .then(data => {
          if(Array.isArray(data)) setRequests(data);
      })
      .catch(console.error);
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // In a real app we'd get userId from session
    let mockUserId = '123';
    try {
        const usersRes = await fetch('/api/organization/users');
        const users = await usersRes.json();
        if(users && users.length > 0) {
            mockUserId = users[0].id;
        }
    } catch(e) {}
    
    try {
      const res = await fetch('/api/operations/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId: formData.assetId,
          userId: mockUserId, // To replace
          issue: formData.issue,
          priority: formData.priority,
          photoUrl: formData.photoUrl
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Failed to submit maintenance request');
        return;
      }
      
      setShowModal(false);
      setFormData({ assetId: '', issue: '', priority: 'Medium', photoUrl: '' });
      fetchRequests();
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
        let mockManagerId = 'admin-id';
        const res = await fetch(`/api/operations/maintenance/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus, managerId: mockManagerId })
        });
        
        if(res.ok) {
            fetchRequests();
        }
    } catch(e) {
        console.error("Failed to update status", e);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Maintenance Approvals</h1>
          <p className="text-slate-500">Manage asset repairs and maintenance requests</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          New Request
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Column */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-amber-500" /> Pending Requests
            </h2>
            <div className="space-y-4">
                {requests.filter((r: any) => r.status === 'Pending').map((req: any) => (
                    <div key={req.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-slate-800">{req.asset?.name || 'Unknown'}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                                req.priority === 'High' ? 'bg-red-100 text-red-800' :
                                req.priority === 'Medium' ? 'bg-amber-100 text-amber-800' :
                                'bg-green-100 text-green-800'
                            }`}>{req.priority}</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">{req.issue}</p>
                        <div className="flex gap-2 text-sm">
                            <button onClick={() => handleStatusChange(req.id, 'Approved')} className="flex-1 bg-indigo-50 text-indigo-700 font-medium py-1.5 rounded-md hover:bg-indigo-100">Approve</button>
                            <button onClick={() => handleStatusChange(req.id, 'Rejected')} className="flex-1 bg-red-50 text-red-700 font-medium py-1.5 rounded-md hover:bg-red-100">Reject</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Wrench size={18} className="text-blue-500" /> In Progress
            </h2>
            <div className="space-y-4">
                {requests.filter((r: any) => ['Approved', 'Technician Assigned', 'In Progress'].includes(r.status)).map((req: any) => (
                    <div key={req.id} className="bg-white p-4 rounded-lg shadow-sm border border-blue-200">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-slate-800">{req.asset?.name || 'Unknown'}</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">{req.status}</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">{req.issue}</p>
                        <button onClick={() => handleStatusChange(req.id, 'Resolved')} className="w-full bg-green-50 text-green-700 font-medium py-1.5 rounded-md hover:bg-green-100 flex items-center justify-center gap-2">
                            <CheckCircle size={16} /> Mark Resolved
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {/* Resolved Column */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                <CheckCircle size={18} className="text-green-500" /> Resolved / Rejected
            </h2>
            <div className="space-y-4">
                {requests.filter((r: any) => ['Resolved', 'Rejected'].includes(r.status)).map((req: any) => (
                    <div key={req.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 opacity-75">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-slate-800">{req.asset?.name || 'Unknown'}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                                req.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>{req.status}</span>
                        </div>
                        <p className="text-sm text-slate-600 truncate">{req.issue}</p>
                        <p className="text-xs text-slate-400 mt-2">{new Date(req.updatedAt).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Raise Maintenance Request</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}
            
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Asset</label>
                <select 
                  required
                  className="w-full border border-slate-300 rounded-lg p-2"
                  value={formData.assetId}
                  onChange={(e) => setFormData({...formData, assetId: e.target.value})}
                >
                  <option value="">Select an asset...</option>
                  {assets.map((a: any) => (
                    <option key={a.id} value={a.id}>{a.name} ({a.tag})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select 
                  required
                  className="w-full border border-slate-300 rounded-lg p-2"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Issue Description</label>
                <textarea 
                  required rows={3}
                  className="w-full border border-slate-300 rounded-lg p-2"
                  value={formData.issue}
                  onChange={(e) => setFormData({...formData, issue: e.target.value})}
                  placeholder="Describe what needs repair..."
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Photo URL (Optional)</label>
                <input 
                  type="url"
                  className="w-full border border-slate-300 rounded-lg p-2"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({...formData, photoUrl: e.target.value})}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
