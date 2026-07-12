'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { PackageOpen, ArrowRight, ShieldCheck, Zap, BarChart3 } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden relative font-sans">
      {/* Background gradients */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-indigo-400/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-purple-400/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="bg-indigo-500/10 p-2 rounded-xl shadow-lg shadow-indigo-500/10 border border-indigo-500/20">
            <PackageOpen className="w-6 h-6 text-indigo-600" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">AssetFlow</span>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            Sign in
          </Link>
          <Link href="/signup" className="text-sm font-medium bg-indigo-600/10 text-indigo-700 border border-indigo-600/20 px-5 py-2.5 rounded-full hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
            Get Started
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block"
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 text-sm font-medium mb-4 backdrop-blur-md shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
              Enterprise Hackathon Edition
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 drop-shadow-sm">
            Intelligent Asset & <br className="hidden md:block" /> Resource Management
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate allocation conflicts, track high-value assets seamlessly, and maintain perfect audit cycles with our next-generation ERP.
          </p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <Link 
              href="/login" 
              className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-indigo-600/10 text-indigo-700 border border-indigo-600/20 px-8 py-4 rounded-full font-semibold hover:bg-indigo-600 hover:text-white transition-all shadow-md active:scale-95"
            >
              Enter Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating Mockup Image */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, type: "spring" }}
          className="mt-16 relative max-w-5xl mx-auto perspective-1000"
        >
          <div className="absolute inset-0 bg-indigo-400/20 blur-[100px] rounded-[3rem] -z-10" />
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden border border-slate-200/50 shadow-2xl shadow-indigo-900/10"
          >
            <img 
              src="/hero-isometric.png" 
              alt="AssetFlow Dashboard Mockup" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto text-left"
        >
          <motion.div whileHover={{ y: -5 }} className="p-6 rounded-3xl bg-white/70 border border-slate-200 backdrop-blur-xl hover:bg-white transition-all shadow-xl shadow-slate-200/50">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4 border border-indigo-100">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Conflict Resolution</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Smart mathematical overlap detection prevents double-booking of shared resources instantly.</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="p-6 rounded-3xl bg-white/70 border border-slate-200 backdrop-blur-xl hover:bg-white transition-all shadow-xl shadow-slate-200/50">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mb-4 border border-purple-100">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Automated Mutability</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Assets automatically update their states when sent for maintenance or flagged in audits.</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="p-6 rounded-3xl bg-white/70 border border-slate-200 backdrop-blur-xl hover:bg-white transition-all shadow-xl shadow-slate-200/50">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4 border border-emerald-100">
              <BarChart3 className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Live Insights</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Real-time KPI aggregation and critical red alert banners for overdue allocations.</p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
