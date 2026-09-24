'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Briefcase,
  FileCheck2,
  FilePlus,
  FileSearch,
  ShieldCheck,
  History,
  ArrowRight,
  PlusCircle,
  Clock,
} from 'lucide-react';
import { CaseService } from '@/lib/services/cases';
import { DocumentService } from '@/lib/services/documents';
import { AuditService } from '@/lib/services/audit';
import { CaseRecord, DocumentRecord, AuditLogRecord } from '@/types/nyaya';

export default function InvestigatorDashboard() {
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

  const verifiedDocs = documents.filter((d) => d.status === 'VERIFIED');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              INVESTIGATOR WORKSPACE
            </h1>
            <Badge variant="blue" size="md">
              POLICE / CID DIVISION
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage investigation cases, import FIRs from police station API, upload case documents, and generate cryptographic SHA-256 proofs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/investigator/fir">
            <Button variant="primary" size="md" className="shadow-md shadow-blue-600/20">
              <FileSearch className="w-4 h-4 mr-1.5" /> IMPORT FIR RECORD
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Assigned Cases</span>
            <Briefcase className="w-5 h-5 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">{cases.length} Active</div>
          <div className="mt-1 text-[11px] text-blue-400 font-medium">Under Active Investigation</div>
        </Card>

        <Card className="border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pending Documents</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">
            {documents.length - verifiedDocs.length} Pending
          </div>
          <div className="mt-1 text-[11px] text-amber-400 font-medium">Awaiting Verification</div>
        </Card>

        <Card className="border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Verified Documents</span>
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">{verifiedDocs.length} Verified</div>
          <div className="mt-1 text-[11px] text-emerald-400 font-medium">SHA-256 Ledger Locked</div>
        </Card>

        <Card className="border-purple-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Access Requests</span>
            <ShieldCheck className="w-5 h-5 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">0 Pending</div>
          <div className="mt-1 text-[11px] text-purple-400 font-medium">Role Access Granted</div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases Column */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">My Investigation Cases</CardTitle>
                <CardDescription>Cases assigned to CID / Police Investigator</CardDescription>
              </div>
              <Link href="/investigator/fir">
                <Button variant="outline" size="sm" className="text-xs">
                  <PlusCircle className="w-3.5 h-3.5 mr-1" /> New Case (via FIR)
                </Button>
              </Link>
            </CardHeader>

            <div className="space-y-3">
              {cases.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-sm">{c.case_number}</span>
                      <Badge variant="blue" size="sm">
                        {c.case_type}
                      </Badge>
                      <Badge variant="slate" size="sm">
                        {c.status}
                      </Badge>
                    </div>
                    <Link href={`/cases/${c.id}`}>
                      <Button variant="primary" size="sm" className="text-xs">
                        Open Case <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>

                  <h4 className="font-semibold text-slate-200 text-xs">{c.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[11px] text-slate-400">
                    <span>Police Station: {c.police_station}</span>
                    <span>FIR Ref: {c.fir_number}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Documents & Activity Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Case Documents</CardTitle>
              <CardDescription>Uploaded & Cryptographically Hashed</CardDescription>
            </CardHeader>

            <div className="space-y-2">
              {documents.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 truncate">{doc.name}</span>
                    <Badge variant="green" size="sm">
                      VERIFIED
                    </Badge>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    SHA: {doc.sha256.slice(0, 16)}...
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400">
                      {(doc.file_size / 1024).toFixed(1)} KB
                    </span>
                    <Link href={`/documents/${doc.id}/verify`}>
                      <span className="text-[11px] text-blue-400 hover:underline font-medium">
                        Verify Integrity &rarr;
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Audit Trail</CardTitle>
              <Link href="/audit">
                <Button variant="ghost" size="sm" className="text-[11px]">
                  Full Logs
                </Button>
              </Link>
            </CardHeader>

            <div className="space-y-2 text-xs">
              {auditLogs.slice(0, 3).map((l) => (
                <div key={l.id} className="p-2.5 rounded bg-slate-950/50 border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-400">{l.action}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(l.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">{l.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
