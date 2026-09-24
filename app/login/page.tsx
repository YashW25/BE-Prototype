'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Shield, Lock, Mail, KeyRound, AlertCircle, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { UserRole } from '@/types/nyaya';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('investigator@nyayavault.demo');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('INVESTIGATOR');
  const [error, setError] = useState<string | null>(null);

  const demoAccounts: { email: string; role: UserRole; name: string; dept: string; color: 'blue' | 'amber' | 'cyan' | 'green' | 'purple' }[] = [
    {
      email: 'investigator@nyayavault.demo',
      role: 'INVESTIGATOR',
      name: 'Insp. Rajesh Varma',
      dept: 'Crime Investigation Dept (CID)',
      color: 'blue',
    },
    {
      email: 'legal@nyayavault.demo',
      role: 'LEGAL',
      name: 'Adv. Ananya Roy',
      dept: 'Prosecution Division',
      color: 'amber',
    },
    {
      email: 'forensic@nyayavault.demo',
      role: 'FORENSIC',
      name: 'Dr. Suresh Nair',
      dept: 'Digital Forensic Lab',
      color: 'cyan',
    },
    {
      email: 'court@nyayavault.demo',
      role: 'COURT',
      name: 'Registrar P. K. Shastri',
      dept: 'Judicial Registry',
      color: 'green',
    },
    {
      email: 'admin@nyayavault.demo',
      role: 'ADMIN',
      name: 'Dr. Vikrant Mehta',
      dept: 'System Security Oversight',
      color: 'purple',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, selectedRole);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    }
  };

  const handle1ClickLogin = async (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setSelectedRole(acc.role);
    await login(acc.email, acc.role);
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-8 px-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400">
            <Shield className="h-6 w-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-100">
            NYAYAVAULT SYSTEM AUTHENTICATION
          </h1>
          <p className="text-xs text-slate-400">
            Click any role card below to log in instantly, or use standard email/password authentication.
          </p>
        </div>

        {/* 1-CLICK INSTANT LOGIN CARDS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" /> 1-CLICK INSTANT DEMO LOGIN (NO TYPING REQUIRED)
            </span>
            <Badge variant="amber" size="sm">
              FAST PASS
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handle1ClickLogin(acc)}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/60 hover:bg-slate-800/80 transition-all text-left group flex flex-col justify-between space-y-3 shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Badge variant={acc.color} size="sm">
                      {acc.role}
                    </Badge>
                    <CheckCircle2 className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div className="font-bold text-slate-100 text-sm group-hover:text-blue-400 transition-colors">
                    {acc.name}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">{acc.dept}</div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-blue-400">
                  <span>Log in as {acc.role}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Standard Email / Password Box */}
        <Card className="border-slate-800/80 max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" /> Manual Credential Login
            </CardTitle>
            <CardDescription className="text-[11px]">
              Or enter custom official credentials below.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Official Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <Button
              type="submit"
              variant="outline"
              size="md"
              isLoading={loading}
              className="w-full text-xs font-semibold"
            >
              Sign In with Custom Email
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
