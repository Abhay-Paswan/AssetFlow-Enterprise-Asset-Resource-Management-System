"use client"
import React, { useState } from 'react';

export default function AssetForm({ onCreated }: { onCreated: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    serialNumber: '',
    acquisitionDate: '',
    acquisitionCost: '',
    condition: 'New',
    location: '',
    imageUrl: '',
    isSharedResource: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create asset');
      onCreated();
      // reset
      setFormData({
        name: '', categoryId: '', serialNumber: '', acquisitionDate: '',
        acquisitionCost: '', condition: 'New', location: '', imageUrl: '',
        isSharedResource: false
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-sm mb-6 border border-slate-200">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">Register New Asset</h2>
      {error && <div className="p-3 bg-red-50 text-red-700 rounded mb-4 text-sm">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Name</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Category ID</label>
          <input required type="text" name="categoryId" value={formData.categoryId} onChange={handleChange} placeholder="e.g. UUID of 'Electronics'" className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Serial Number</label>
          <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleChange} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Condition</label>
          <select name="condition" value={formData.condition} onChange={handleChange} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none">
            <option value="New">New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Acquisition Date</label>
          <input type="date" name="acquisitionDate" value={formData.acquisitionDate} onChange={handleChange} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Acquisition Cost</label>
          <input type="number" step="0.01" name="acquisitionCost" value={formData.acquisitionCost} onChange={handleChange} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Image URL</label>
          <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none" />
        </div>
        <div className="flex items-center mt-6">
          <input id="shared" type="checkbox" name="isSharedResource" checked={formData.isSharedResource} onChange={handleChange} className="h-4 w-4 bg-white border-slate-300 rounded text-blue-600 focus:ring-blue-500" />
          <label htmlFor="shared" className="ml-2 block text-sm text-slate-700 shadow-none">Is Shared Resource (Can be booked)</label>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button disabled={loading} type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 disabled:opacity-50 text-sm font-medium transition-colors">
          {loading ? 'Submitting...' : 'Register Asset'}
        </button>
      </div>
    </form>
  );
}
