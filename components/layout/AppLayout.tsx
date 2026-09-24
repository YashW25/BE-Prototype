'use client';

import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/lib/auth/context';
import { Shield, Info } from 'lucide-react';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      {/* System Prototype Banner */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-1.5 text-center text-xs text-slate-300 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-[11px]">
          <Info className="w-3 h-3 text-amber-400" /> PROTOTYPE ENVIRONMENT
        </span>
        <span className="hidden md:inline text-slate-400 text-[11px]">
          Demonstration platform for SIH26190. Simulated Police Station API & Mock Blockchain Ledger Abstraction.
        </span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {user && (
          <Sidebar
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />
        )}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950/90">{children}</main>
      </div>
    </div>
  );
};
