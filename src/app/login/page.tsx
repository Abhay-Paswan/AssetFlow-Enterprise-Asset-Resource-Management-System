'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PackageOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <Link href="/" className="flex justify-center text-indigo-400 hover:text-indigo-300 transition-colors">
          <PackageOpen size={56} strokeWidth={1.5} />
        </Link>
        <h2 className="mt-6 text-center text-4xl font-extrabold text-white tracking-tight">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">AssetFlow</span>
        </h2>
        <p className="mt-3 text-center text-sm text-slate-400 font-medium">
          Sign in to your enterprise account
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-slate-900/50 backdrop-blur-xl py-8 px-4 shadow-2xl border border-slate-800 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-4"
              >
                <p className="text-sm text-red-400 text-center font-medium">{error}</p>
              </motion.div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl shadow-sm placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <a href="#" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl shadow-sm placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:opacity-50 transition-all"
              >
                {loading ? 'Signing in...' : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400">
              New to AssetFlow?{' '}
              <Link href="/signup" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
