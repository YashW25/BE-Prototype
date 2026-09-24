'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  LayoutDashboard,
  Briefcase,
  FileSearch,
  ShieldCheck,
  History,
  FileText,
  UserCheck,
  LogOut,
  FolderGit2,
} from 'lucide-react';
import { UserRole } from '@/types/nyaya';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const pathname = usePathname();
  const { user, logout, getRoleDashboardPath } = useAuth();

  if (!user) return null;

  const dashboardPath = getRoleDashboardPath(user.role);

  const navItems = [
    {
      name: `${user.role} Dashboard`,
      href: dashboardPath,
      icon: LayoutDashboard,
      roles: ['ADMIN', 'INVESTIGATOR', 'LEGAL', 'FORENSIC', 'COURT'] as UserRole[],
    },
    {
      name: 'Import FIR',
      href: '/investigator/fir',
      icon: FileSearch,
      roles: ['INVESTIGATOR', 'ADMIN'] as UserRole[],
    },
    {
      name: 'Case Directory',
      href: '/cases',
      icon: Briefcase,
      roles: ['ADMIN', 'INVESTIGATOR', 'LEGAL', 'FORENSIC', 'COURT'] as UserRole[],
    },
    {
      name: 'System Audit Logs',
      href: '/audit',
      icon: History,
      roles: ['ADMIN', 'INVESTIGATOR', 'LEGAL', 'FORENSIC', 'COURT'] as UserRole[],
    },
  ];

  const content = (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-slate-800 bg-slate-900/95 p-4 backdrop-blur-md">
      <div className="space-y-6">
        {/* Role Workspace Banner */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            ACTIVE WORKSPACE
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-bold text-slate-100 text-sm">{user.role} DIVISION</span>
            <Badge variant="blue" size="sm">
              ROLE
            </Badge>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 truncate">{user.department}</div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-2">
            MAIN NAVIGATION
          </div>
          {navItems.map((item) => {
            if (!item.roles.includes(user.role)) return null;

            const isActive =
              pathname === item.href ||
              (item.href !== dashboardPath && item.href !== '/' && pathname.startsWith(item.href));

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Verification Shortcut */}
        <div className="rounded-lg border border-slate-800/80 bg-slate-950/50 p-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Integrity Verification
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Cryptographic SHA-256 validation & mock ledger audit lookup.
          </p>
          <Link href="/cases">
            <Button variant="outline" size="sm" className="mt-2.5 w-full text-[11px] py-1">
              Select Document
            </Button>
          </Link>
        </div>
      </div>

      {/* User Footer */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-200 text-xs border border-slate-700">
              {user.full_name.charAt(0)}
            </div>
            <div className="truncate">
              <div className="font-semibold text-slate-200 truncate">{user.full_name}</div>
              <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-start text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="w-3.5 h-3.5 mr-2" /> Sign Out
        </Button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-[calc(100vh-4rem)]">{content}</div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative z-10 w-64 max-w-xs">{content}</div>
        </div>
      )}
    </>
  );
};
