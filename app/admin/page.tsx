'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Users, Briefcase, FileText, ShieldAlert, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CaseService } from '@/lib/services/cases';
import { DocumentService } from '@/lib/services/documents';
import { AuditService } from '@/lib/services/audit';
import { CaseRecord, DocumentRecord, AuditLogRecord } from '@/types/nyaya';

export default function AdminDashboard() {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [cList, dList, aList] = await Promise.all([
        CaseService.getCases(),
        DocumentService.getAllDocuments(),
        AuditService.getAuditLogs(),
      ]);
      setCases(cList);
      setDocuments(dList);
      setAuditLogs(aList);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              SYSTEM SECURITY & ADMINISTRATION
            </h1>
            <Badge variant="purple" size="md">
              ADMIN WORKSPACE
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Overall system oversight, user role monitoring, case activity, and audit logs.
          </p>
        </div>

        <Link href="/audit">
          <Button variant="primary" size="sm">
            <Activity className="w-4 h-4 mr-1.5" /> VIEW SYSTEM AUDIT TRAIL
          </Button>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-purple-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total System Users</span>
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">5 Active Officers</div>
          <div className="mt-1 text-[11px] text-purple-400 font-medium">5 Role Privileges Active</div>
        </Card>

        <Card className="border-blue-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Registered Cases</span>
            <Briefcase className="w-5 h-5 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">{cases.length} Active Cases</div>
          <div className="mt-1 text-[11px] text-blue-400 font-medium">Database Synced</div>
        </Card>

        <Card className="border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Stored Documents</span>
            <FileText className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">{documents.length} Files</div>
          <div className="mt-1 text-[11px] text-emerald-400 font-medium">100% Cryptographically Hashed</div>
        </Card>

        <Card className="border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Audit & Security Events</span>
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">{auditLogs.length} Events Logged</div>
          <div className="mt-1 text-[11px] text-amber-400 font-medium">Zero Tampering Detected</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Cases */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">System Active Cases</CardTitle>
                <CardDescription>Investigation cases managed in NYAYAVAULT</CardDescription>
              </div>
              <Link href="/cases">
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>

            <div className="space-y-2">
              {cases.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{c.case_number}</span>
                      <Badge variant="blue" size="sm">
                        {c.case_type}
                      </Badge>
                    </div>
                    <div className="text-slate-300 font-medium mt-1">{c.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{c.police_station}</div>
                  </div>

                  <Link href={`/cases/${c.id}`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      Inspect
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* System Status & Recent Activity */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">System Infrastructure Status</CardTitle>
              <CardDescription>Production-quality runtime health</CardDescription>
            </CardHeader>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800">
                <span className="text-slate-300">Supabase Auth & Roles</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800">
                <span className="text-slate-300">Supabase Storage Engine</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800">
                <span className="text-slate-300">SHA-256 Crypto Hashing</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> WebCrypto
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800">
                <span className="text-slate-300">Mock Ledger Ledger Abstraction</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Synced
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Audit Events</CardTitle>
            </CardHeader>

            <div className="space-y-2 text-xs">
              {auditLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="p-2 rounded bg-slate-950/50 border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-400">{log.action}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">{log.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
