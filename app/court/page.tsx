'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Building2, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { CaseService } from '@/lib/services/cases';
import { DocumentService } from '@/lib/services/documents';
import { CaseRecord, DocumentRecord } from '@/types/nyaya';

export default function CourtDashboard() {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);

  useEffect(() => {
    async function load() {
      const [cList, dList] = await Promise.all([
        CaseService.getCases(),
        DocumentService.getAllDocuments(),
      ]);
      setCases(cList);
      setDocuments(dList);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              DISTRICT & SESSIONS JUDICIARY REGISTRY
            </h1>
            <Badge variant="green" size="md">
              COURT JUDICIARY WORKSPACE
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Judicial registry for reviewing verified charge sheets, FIR filings, and validating cryptographic document authenticity before court hearings.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Cases Received for Hearing</span>
            <Building2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">{cases.length} Cases</div>
          <div className="mt-1 text-[11px] text-emerald-400 font-medium">Judicial Registry Synced</div>
        </Card>

        <Card className="border-blue-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pending Judicial Verification</span>
            <ShieldCheck className="w-5 h-5 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">0 Pending</div>
          <div className="mt-1 text-[11px] text-blue-400 font-medium">All Filings Hash Verified</div>
        </Card>

        <Card className="border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Finalized Cases</span>
            <CheckCircle2 className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">1 Case</div>
          <div className="mt-1 text-[11px] text-amber-400 font-medium">Adjudication Complete</div>
        </Card>
      </div>

      {/* Court Registry Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Judicial Case Filings</CardTitle>
          <CardDescription>Verified case records ready for judicial bench examination</CardDescription>
        </CardHeader>

        <div className="space-y-3">
          {cases.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100 text-sm">{c.case_number}</span>
                  <Badge variant="green" size="sm">
                    COURT DOCKET
                  </Badge>
                </div>
                <h4 className="font-semibold text-slate-200">{c.title}</h4>
                <div className="text-[11px] text-slate-400">
                  Police Station: {c.police_station} | FIR: {c.fir_number}
                </div>
              </div>

              <Link href={`/cases/${c.id}`}>
                <Button variant="outline" size="sm" className="text-xs">
                  Review Court Docket <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
