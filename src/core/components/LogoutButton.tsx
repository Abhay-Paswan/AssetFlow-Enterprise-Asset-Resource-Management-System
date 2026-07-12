'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      if (res.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="ml-auto text-slate-400 hover:text-white p-2 rounded-md hover:bg-slate-700 transition-colors"
      title="Logout"
    >
      <LogOut className="h-5 w-5" />
    </button>
  );
}
