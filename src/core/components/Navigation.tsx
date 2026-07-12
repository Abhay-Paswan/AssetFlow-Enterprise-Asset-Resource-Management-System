import Link from 'next/link';
import { PackageOpen, Users, LayoutDashboard, Settings } from 'lucide-react';
import { getSession } from '@/core/auth/jwt';

export async function Navigation() {
  const session = await getSession();
  
  if (!session) return null;

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-slate-900">
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-slate-900">
          <PackageOpen className="h-8 w-8 text-indigo-500" />
          <span className="ml-2 text-white text-xl font-bold">AssetFlow</span>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            <Link
              href="/dashboard"
              className="text-slate-300 hover:bg-slate-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              <LayoutDashboard className="text-slate-400 group-hover:text-slate-300 mr-3 flex-shrink-0 h-6 w-6" />
              Dashboard
            </Link>
            
            {session.role === 'Admin' && (
              <Link
                href="/organization"
                className="text-slate-300 hover:bg-slate-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              >
                <Settings className="text-slate-400 group-hover:text-slate-300 mr-3 flex-shrink-0 h-6 w-6" />
                Organization Setup
              </Link>
            )}
            <Link href="/assets" className="text-slate-300 hover:bg-slate-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
              <PackageOpen className="text-slate-400 group-hover:text-slate-300 mr-3 flex-shrink-0 h-6 w-6" />
              Assets Directory
            </Link>
            <Link href="/operations/bookings" className="text-slate-300 hover:bg-slate-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
              <Users className="text-slate-400 group-hover:text-slate-300 mr-3 flex-shrink-0 h-6 w-6" />
              Resource Bookings
            </Link>
            <Link href="/operations/maintenance" className="text-slate-300 hover:bg-slate-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
              <Settings className="text-slate-400 group-hover:text-slate-300 mr-3 flex-shrink-0 h-6 w-6" />
              Maintenance
            </Link>
            {(session.role === 'Admin' || session.role === 'Asset Manager') && (
              <Link href="/audits" className="text-slate-300 hover:bg-slate-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                <LayoutDashboard className="text-slate-400 group-hover:text-slate-300 mr-3 flex-shrink-0 h-6 w-6" />
                Audits
              </Link>
            )}
            <Link href="/activity" className="text-slate-300 hover:bg-slate-700 hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
              <LayoutDashboard className="text-slate-400 group-hover:text-slate-300 mr-3 flex-shrink-0 h-6 w-6" />
              Activity Logs
            </Link>
          </nav>
        </div>
        <div className="flex-shrink-0 flex bg-slate-800 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div>
                <Users className="inline-block h-9 w-9 rounded-full text-slate-300" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{session.email}</p>
                <p className="text-xs font-medium text-slate-300 group-hover:text-slate-200">
                  {session.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
