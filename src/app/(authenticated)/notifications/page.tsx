'use client';
import { useState, useEffect } from 'react';
import { Bell, Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app we'd get the user session, for now fetch the first user
    fetch('/api/organization/users')
      .then(res => res.json())
      .then(users => {
        if (users && users.length > 0) {
          return fetch(`/api/notifications?userId=${users[0].id}`);
        }
        return Promise.resolve({ json: () => [] });
      })
      .then(res => res.json())
      .then(data => {
        setNotifications(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Alert': return <AlertTriangle className="text-red-500" />;
      case 'Warning': return <AlertTriangle className="text-amber-500" />;
      case 'Success': return <CheckCircle className="text-green-500" />;
      default: return <Info className="text-blue-500" />;
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-100 rounded-lg">
          <Bell className="w-6 h-6 text-indigo-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500">Stay updated on your assets and bookings</p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="flex justify-center mb-4">
            <Bell className="w-12 h-12 text-slate-300" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">You're all caught up!</h3>
          <p className="text-slate-500 mt-1">You have no new notifications.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
          {notifications.map((notif: any) => (
            <div key={notif.id} className={`p-4 flex gap-4 transition-colors hover:bg-slate-50 ${!notif.isRead ? 'bg-indigo-50/30' : ''}`}>
              <div className="flex-shrink-0 mt-1">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{notif.message}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                  <Clock size={12} />
                  {new Date(notif.createdAt).toLocaleString()}
                </div>
              </div>
              {!notif.isRead && (
                <div className="flex-shrink-0 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
