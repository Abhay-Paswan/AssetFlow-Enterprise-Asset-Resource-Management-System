'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, X } from 'lucide-react';

export default function BookingsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    assetId: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: ''
  });

  useEffect(() => {
    // Fetch shared resources
    fetch('/api/assets?isSharedResource=true')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setAssets(data);
      })
      .catch(console.error);
      
    // Fetch bookings
    fetchBookings();
  }, []);
  
  const fetchBookings = () => {
      fetch('/api/operations/bookings')
      .then(res => res.json())
      .then(data => {
          if(Array.isArray(data)) setBookings(data);
      })
      .catch(console.error);
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await fetch(`/api/operations/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled' })
      });
      if (res.ok) {
        fetchBookings();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to cancel booking');
      }
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred');
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.date}T${formData.endTime}`);
    
    try {
      const res = await fetch('/api/operations/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId: formData.assetId,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          purpose: formData.purpose
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Failed to create booking');
        return;
      }
      
      setShowModal(false);
      fetchBookings();
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Resource Bookings</h1>
          <p className="text-slate-500">Manage shared resource reservations</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          New Booking
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <th className="p-4 font-semibold">Resource</th>
              <th className="p-4 font-semibold">Time</th>
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold">Purpose</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? bookings.map((booking: any) => (
              <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4">{booking.asset?.name || 'Unknown Asset'}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar size={16} />
                    {new Date(booking.startTime).toLocaleDateString()}
                    <Clock size={16} className="ml-2" />
                    {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                    {new Date(booking.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </td>
                <td className="p-4">{booking.user?.name || 'Unknown User'}</td>
                <td className="p-4">{booking.purpose}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                    booking.status === 'Ongoing' ? 'bg-green-100 text-green-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {booking.status}
                  </span>
                  {booking.status === 'Upcoming' && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="ml-4 text-xs font-medium text-red-600 hover:text-red-800 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            )) : (
                <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">No bookings found</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Book a Resource</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}
            
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Resource</label>
                <select 
                  required
                  className="w-full border border-slate-300 rounded-lg p-2"
                  value={formData.assetId}
                  onChange={(e) => setFormData({...formData, assetId: e.target.value})}
                >
                  <option value="">Select a resource...</option>
                  {assets.map((a: any) => (
                    <option key={a.id} value={a.id}>{a.name} ({a.tag})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input 
                  type="date" required
                  className="w-full border border-slate-300 rounded-lg p-2"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                  <input 
                    type="time" required
                    className="w-full border border-slate-300 rounded-lg p-2"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                  <input 
                    type="time" required
                    className="w-full border border-slate-300 rounded-lg p-2"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Purpose</label>
                <textarea 
                  required rows={3}
                  className="w-full border border-slate-300 rounded-lg p-2"
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
