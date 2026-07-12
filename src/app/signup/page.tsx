'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PackageOpen, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Signup failed');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
      
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
          Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">AssetFlow</span>
        </h2>
        <p className="mt-3 text-center text-sm text-slate-400 font-medium">
          Create an employee account to get started
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-slate-900/50 backdrop-blur-xl py-8 px-4 shadow-2xl border border-slate-800 sm:rounded-2xl sm:px-10">
          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="text-emerald-500 w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Account Created!</h3>
              <p className="text-slate-400">Redirecting you to sign in...</p>
            </motion.div>
          ) : (
            <form className="space-y-6" onSubmit={handleSignup}>
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
                <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl shadow-sm placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>

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
                <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
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
                  {loading ? 'Creating account...' : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {!success && (
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-400">
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                  Sign in instead
                </Link>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
