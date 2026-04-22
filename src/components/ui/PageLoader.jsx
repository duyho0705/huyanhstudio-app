import React from 'react';
import { motion } from 'framer-motion';

const PageLoader = () => {
  return (
    <div className="w-full min-h-screen bg-slate-50/50 p-6 sm:p-10 space-y-8 animate-pulse">
      {/* Skeleton Navbar Height */}
      <div className="h-16 w-full bg-white rounded-2xl border border-slate-100 mb-8" />
      
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Skeleton Header */}
        <div className="flex justify-between items-end">
          <div className="space-y-3">
            <div className="h-8 w-64 bg-slate-200 rounded-lg" />
            <div className="h-4 w-40 bg-slate-100 rounded-lg" />
          </div>
          <div className="hidden md:flex gap-3">
             <div className="h-10 w-24 bg-slate-200 rounded-xl" />
             <div className="h-10 w-24 bg-slate-200 rounded-xl" />
          </div>
        </div>

        {/* Skeleton Grid (For Dashboard or Content) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-white rounded-[24px] border border-slate-100 shadow-sm" />
          ))}
        </div>

        {/* Skeleton Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 h-[400px] bg-white rounded-[32px] border border-slate-100 shadow-sm" />
           <div className="h-[400px] bg-white rounded-[32px] border border-slate-100 shadow-sm" />
        </div>
      </div>

      {/* Floating Spinner in corner to show progress */}
      <div className="fixed bottom-10 right-10 flex items-center justify-center p-3 sm:p-4 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50">
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
           className="w-5 h-5 rounded-full border-2 border-blue-500/20 border-t-blue-500"
        />
      </div>
    </div>
  );
};

export default PageLoader;
