'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show back button on the main dashboard
  if (pathname === '/dashboard') {
    return null;
  }

  return (
    <button
      onClick={() => router.back()}
      className="mb-4 inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back
    </button>
  );
}
