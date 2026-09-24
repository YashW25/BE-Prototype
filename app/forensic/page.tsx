'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Cpu, FileCode, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { CaseService } from '@/lib/services/cases';
import { DocumentService } from '@/lib/services/documents';
import { CaseRecord, DocumentRecord } from '@/types/nyaya';

export default function ForensicDashboard() {
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
              STATE DIGITAL FORENSIC LABORATORY
            </h1>
            <Badge variant="cyan" size="md">
              FORENSIC DIVISION
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Digital evidence intake, SHA-256 fingerprint logging, forensic report generation, and chain-of-custody verification.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-cyan-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Digital Evidence Received</span>
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">{documents.length} Artifacts</div>
          <div className="mt-1 text-[11px] text-cyan-400 font-medium">Encrypted & Hashed</div>
        </Card>

        <Card className="border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pending Examination</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">1 Case Drive</div>
          <div className="mt-1 text-[11px] text-amber-400 font-medium">In Queue for Analysis</div>
        </Card>

        <Card className="border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Reports Submitted</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-100">4 Reports</div>
          <div className="mt-1 text-[11px] text-emerald-400 font-medium">Ledger Locked & Signed</div>
        </Card>
      </div>

      {/* Forensic Evidence Log */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileCode className="w-4 h-4 text-cyan-400" /> Digital Evidence & Artifact Fingerprints
          </CardTitle>
          <CardDescription>Cryptographic evidence log tied to active investigation cases</CardDescription>
        </CardHeader>

        <div className="space-y-3 text-xs">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-4"
            >
              <div className="space-y-1 truncate">
                <div className="font-bold text-slate-200 truncate">{doc.name}</div>
                <div className="font-mono text-[10px] text-slate-400 truncate">
                  SHA-256: {doc.sha256}
                </div>
              </div>

              <Link href={`/documents/${doc.id}/verify`}>
                <Button variant="outline" size="sm" className="text-xs shrink-0">
                  Verify Fingerprint <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
