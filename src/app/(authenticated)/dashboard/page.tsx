'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, ArrowRight, Activity, Calendar, Wrench, Box, Repeat, BellRing } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/dashboard')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Operational Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/assets" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2">
            <Box className="w-4 h-4" /> Register Asset
          </Link>
          <Link href="/operations/bookings" className="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Book Resource
          </Link>
          <Link href="/operations/maintenance" className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 flex items-center gap-2">
            <Wrench className="w-4 h-4" /> Raise Maintenance
          </Link>
        </div>
      </div>

      {data?.overdueAllocations?.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <h3 className="text-red-800 font-medium">Overdue Allocations Alert</h3>
          </div>
          <div className="mt-2 text-sm text-red-700">
            {data.overdueAllocations.map((alloc: any) => (
              <div key={alloc.id} className="mt-1">
                Asset {alloc.asset?.tag} ({alloc.asset?.name}) was due on {new Date(alloc.expectedReturnDate).toLocaleDateString()}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Assets Available" value={data?.kpis?.assetsAvailable || 0} icon={<Box />} color="bg-emerald-100 text-emerald-700" />
        <StatCard title="Assets Allocated" value={data?.kpis?.assetsAllocated || 0} icon={<ArrowRight />} color="bg-blue-100 text-blue-700" />
        <StatCard title="Maintenance Today" value={data?.kpis?.maintenanceToday || 0} icon={<Wrench />} color="bg-amber-100 text-amber-700" />
        <StatCard title="Active Bookings" value={data?.kpis?.activeBookings || 0} icon={<Calendar />} color="bg-indigo-100 text-indigo-700" />
        <StatCard title="Pending Transfers" value={data?.kpis?.pendingTransfers || 0} icon={<Repeat />} color="bg-purple-100 text-purple-700" />
        <StatCard title="Upcoming Returns" value={data?.kpis?.upcomingReturns || 0} icon={<BellRing />} color="bg-slate-100 text-slate-700" />
        <StatCard title="Pending Approvals" value={data?.kpis?.pendingMaintenanceApprovals || 0} icon={<Activity />} color="bg-orange-100 text-orange-700" />
        <StatCard title="Audit Discrepancies" value={data?.kpis?.openAuditDiscrepancies || 0} icon={<AlertCircle />} color="bg-red-100 text-red-700" />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: any, color: string }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex items-center space-x-4">
      <div className={`p-4 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
