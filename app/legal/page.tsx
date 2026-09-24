'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Scale, FileCheck2, ShieldCheck, Briefcase, ArrowRight } from 'lucide-react';
import { CaseService } from '@/lib/services/cases';
import { DocumentService } from '@/lib/services/documents';
import { CaseRecord, DocumentRecord } from '@/types/nyaya';

export default function LegalDashboard() {
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
              LEGAL PROSECUTION WORKSPACE
            </h1>
            <Badge variant="amber" size="md">
              LEGAL OFFICERS & PROSECUTORS
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Access authorized investigation cases, review charge sheets and witness statements, and verify document cryptographic integrity.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Assigned Legal Cases</span>
            <Scale className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">{cases.length} Cases</div>
          <div className="mt-1 text-[11px] text-amber-400 font-medium">Authorized for Legal Review</div>
        </Card>

        <Card className="border-blue-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Documents to Review</span>
            <Briefcase className="w-5 h-5 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">{documents.length} Files</div>
          <div className="mt-1 text-[11px] text-blue-400 font-medium">Charge Sheets & FIR Filings</div>
        </Card>

        <Card className="border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Verified Documents</span>
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">
            {documents.filter((d) => d.status === 'VERIFIED').length} Verified
          </div>
          <div className="mt-1 text-[11px] text-emerald-400 font-medium">Cryptographically Validated</div>
        </Card>
      </div>

      {/* Authorized Cases List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Authorized Legal Cases</CardTitle>
          <CardDescription>Investigation cases assigned for legal prosecution review</CardDescription>
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
                  <Badge variant="amber" size="sm">
                    {c.case_type}
                  </Badge>
                  <Badge variant="slate" size="sm">
                    {c.status}
                  </Badge>
                </div>
                <h4 className="font-semibold text-slate-200">{c.title}</h4>
                <div className="text-[11px] text-slate-400">
                  Station: {c.police_station} | FIR: {c.fir_number}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/cases/${c.id}`}>
                  <Button variant="outline" size="sm" className="text-xs">
                    Inspect Documents <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
