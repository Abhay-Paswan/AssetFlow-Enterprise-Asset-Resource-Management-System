"use client"
import React, { useState, useEffect } from 'react';
import { Search, Filter, Box, Plus } from 'lucide-react';
import AssetForm from './AssetForm';
import AllocationModal from './AllocationModal';
import AssetHistoryModal from './AssetHistoryModal';
import ReturnModal from './ReturnModal';

export default function AssetDirectory() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [allocateAssetId, setAllocateAssetId] = useState<string | null>(null);
  const [historyAssetId, setHistoryAssetId] = useState<string | null>(null);
  const [returnAllocationId, setReturnAllocationId] = useState<string | null>(null);
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.append('search', search);
      if (statusFilter) q.append('status', statusFilter);
      
      const res = await fetch(`/api/assets?${q.toString()}`);
      const data = await res.json();
      setAssets(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [search, statusFilter]);

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'Available': 'bg-green-100 text-green-800',
      'Allocated': 'bg-blue-100 text-blue-800',
      'Reserved': 'bg-purple-100 text-purple-800',
      'Under Maintenance': 'bg-orange-100 text-orange-800',
      'Lost': 'bg-red-100 text-red-800'
    };
    const css = colors[status] || 'bg-slate-100 text-slate-800';
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${css}`}>{status}</span>;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Asset Directory</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and allocate organization assets</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          {showForm ? 'Close Form' : 'Register Asset'}
        </button>
      </div>

      {showForm && <AssetForm onCreated={fetchAssets} />}

      <div className="bg-white p-4 rounded-t-lg border-b border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by tag, name or serial..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 outline-none border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
          />
        </div>
        <div className="relative w-full sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 outline-none border border-slate-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm appearance-none"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Allocated">Allocated</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-b-lg shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-xs">
            <tr>
              <th className="px-6 py-4">Asset Detail</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading assets...</td></tr>
            ) : assets.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500">No assets found.</td></tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 p-2 rounded-md text-slate-500">
                        <Box size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{asset.name}</div>
                        <div className="text-xs text-slate-500">{asset.tag} | SN: {asset.serialNumber || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{asset.category?.name || 'Uncategorized'}</td>
                  <td className="px-6 py-4">{getStatusBadge(asset.status)}</td>
                  <td className="px-6 py-4">{asset.location || '-'}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setHistoryAssetId(asset.id)}
                      className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors mr-3"
                    >
                      History
                    </button>
                    <button 
                      onClick={() => setAllocateAssetId(asset.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors mr-3"
                    >
                      Allocate
                    </button>
                    {asset.status === 'Allocated' && (
                        <button 
                          onClick={() => {
                             const aid = asset.allocations[0]?.id;
                             if(aid) {
                               setReturnAllocationId(aid);
                             }
                          }}
                          className="text-amber-600 hover:text-amber-800 font-medium text-sm transition-colors"
                        >
                          Return
                        </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {allocateAssetId && (
        <AllocationModal 
          assetId={allocateAssetId} 
          onClose={() => setAllocateAssetId(null)} 
          onSuccess={fetchAssets} 
        />
      )}
      {historyAssetId && (
        <AssetHistoryModal 
          assetId={historyAssetId} 
          onClose={() => setHistoryAssetId(null)} 
        />
      )}
      {returnAllocationId && (
        <ReturnModal 
          allocationId={returnAllocationId} 
          onClose={() => setReturnAllocationId(null)} 
          onSuccess={fetchAssets} 
        />
      )}
    </div>
  );
}
