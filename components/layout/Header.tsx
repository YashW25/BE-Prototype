'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Shield,
  UserCheck,
  LogOut,
  Menu,
  Zap,
  FileSearch,
  Briefcase,
  ShieldCheck,
  History,
  ArrowRight,
} from 'lucide-react';
import { UserRole } from '@/types/nyaya';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout, switchRole } = useAuth();
  const pathname = usePathname();

  const roleColors: Record<UserRole, 'purple' | 'blue' | 'amber' | 'cyan' | 'green'> = {
    ADMIN: 'purple',
    INVESTIGATOR: 'blue',
    LEGAL: 'amber',
    FORENSIC: 'cyan',
    COURT: 'green',
  };

  const workflowSteps = [
    { label: '1. Login', href: '/login' },
    { label: '2. Import FIR', href: '/investigator/fir' },
    { label: '3. Case Workspace', href: '/cases/case-001' },
    { label: '4. Verify Hash', href: '/documents/doc-001/verify' },
    { label: '5. Audit Trail', href: '/audit' },
  ];

  return (
    <header className="sticky top-0 z-40 flex flex-col w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur-md">
      {/* Top Navbar */}
      <div className="flex h-16 w-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <Button variant="ghost" size="sm" onClick={onToggleSidebar} className="md:hidden p-1 text-slate-400">
              <Menu className="w-6 h-6" />
            </Button>
          )}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 group-hover:bg-blue-600/30 transition-all">
              <Shield className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-slate-100 text-base">NYAYAVAULT</span>
                <Badge variant="amber" size="sm" className="hidden sm:inline-flex text-[10px] py-0 px-1.5 font-semibold">
                  PROTOTYPE
                </Badge>
              </div>
              <span className="hidden md:block text-[11px] text-slate-400 font-medium">
                Secure Digital Document Management System
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* 1-Click Role Switcher */}
          {user && (
            <div className="hidden xl:flex items-center gap-1 bg-slate-950/70 border border-slate-800 rounded-lg p-1 text-xs">
              <span className="text-[11px] text-slate-400 px-2 font-medium flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-blue-400" /> Quick Role:
              </span>
              {(['INVESTIGATOR', 'LEGAL', 'FORENSIC', 'COURT', 'ADMIN'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  className={`px-2 py-1 rounded font-semibold text-[10px] transition-all ${
                    user.role === r
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-slate-200">{user.full_name}</div>
                <Badge variant={roleColors[user.role]} size="sm">
                  {user.role}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="text-xs px-2.5 py-1 text-slate-300 hover:text-red-400 hover:border-red-500/50"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5 sm:mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="sm">
                LOGIN TO SYSTEM
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* 1-Click Workflow Navigation Bar for Extreme Simplicity */}
      <div className="bg-slate-950 border-t border-slate-800/80 px-4 py-1.5 flex items-center justify-between text-xs overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1 mr-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> 1-CLICK DEMO FLOW:
          </span>
          {workflowSteps.map((step, idx) => {
            const isActive = pathname === step.href;
            return (
              <React.Fragment key={step.href}>
                <Link
                  href={step.href}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {step.label}
                </Link>
                {idx < workflowSteps.length - 1 && (
                  <span className="text-slate-600 text-[10px] font-bold">&rarr;</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400">
          <span>Click any step above to jump straight to it!</span>
        </div>
      </div>
    </header>
  );
};
