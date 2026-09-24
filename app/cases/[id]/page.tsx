'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { CaseService } from '@/lib/services/cases';
import { DocumentService } from '@/lib/services/documents';
import { AuditService } from '@/lib/services/audit';
import { calculateSHA256, formatHashShort } from '@/lib/services/hashing';
import { CaseRecord, DocumentRecord, DocumentType, AuditLogRecord } from '@/types/nyaya';
import {
  Briefcase,
  Building2,
  FileCheck2,
  FilePlus,
  ShieldCheck,
  History,
  Upload,
  ArrowLeft,
  FileText,
  Lock,
  CheckCircle2,
  AlertCircle,
  Zap,
} from 'lucide-react';

export default function CaseDetailsPage({ params }: { params: { id: string } }) {
  const caseId = params.id;
  const router = useRouter();
  const { user } = useAuth();

  const [caseItem, setCaseItem] = useState<CaseRecord | null>(null);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<DocumentType>('INVESTIGATION_REPORT');
  const [customDocName, setCustomDocName] = useState('');
  const [computingHash, setComputingHash] = useState(false);
  const [liveHash, setLiveHash] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadCaseData() {
      setLoading(true);
      const [c, dList, aList] = await Promise.all([
        CaseService.getCaseById(caseId),
        DocumentService.getDocumentsByCase(caseId),
        AuditService.getAuditLogs({ caseId }),
      ]);
      setCaseItem(c);
      setDocuments(dList);
      setAuditLogs(aList);
      setLoading(false);
    }
    loadCaseData();
  }, [caseId]);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    if (!customDocName) {
      setCustomDocName(file.name);
    }
    setComputingHash(true);
    setLiveHash(null);

    try {
      const hash = await calculateSHA256(file);
      setLiveHash(hash);
    } catch (err) {
      console.error('Hash calculation error:', err);
    } finally {
      setComputingHash(false);
    }
  };

  const handleCreateSamplePDF = () => {
    const sampleContent = `NYAYAVAULT DEMO EVIDENCE FILE\nCase: ${caseItem?.case_number || 'CASE-2026-01842'}\nTimestamp: ${new Date().toISOString()}\nAuthenticity Verified by NYAYAVAULT Cryptographic Ledger.`;
    const blob = new Blob([sampleContent], { type: 'application/pdf' });
    const file = new File([blob], `Evidence_Document_${Date.now().toString().slice(-4)}.pdf`, { type: 'application/pdf' });
    handleFileSelect(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !caseItem) return;

    setUploading(true);

    try {
      await DocumentService.uploadDocument({
        caseId: caseItem.id,
        caseNumber: caseItem.case_number,
        file: selectedFile,
        documentType: docType,
        customName: customDocName || selectedFile.name,
        uploadedBy: user?.id,
        uploadedByName: user?.full_name,
      });

      setIsUploadOpen(false);
      setSelectedFile(null);
      setLiveHash(null);
      setCustomDocName('');

      // Refresh list
      const updatedDocs = await DocumentService.getDocumentsByCase(caseItem.id);
      const updatedLogs = await AuditService.getAuditLogs({ caseId: caseItem.id });
      setDocuments(updatedDocs);
      setAuditLogs(updatedLogs);
    } catch (err: any) {
      alert(`Upload Failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400 text-xs">Loading case details...</div>;
  }

  if (!caseItem) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        Case not found or access restricted.
        <div className="mt-4">
          <Link href="/cases">
            <Button variant="outline" size="sm">
              Return to Cases List
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back Button & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <Link href="/cases" className="text-xs text-slate-400 hover:text-blue-400 inline-flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Case Directory
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100 font-mono">
              {caseItem.case_number}
            </h1>
            <Badge variant="blue" size="md">
              {caseItem.case_type}
            </Badge>
            <Badge variant="slate" size="md">
              {caseItem.status}
            </Badge>
          </div>
          <h2 className="text-sm font-semibold text-slate-300">{caseItem.title}</h2>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsUploadOpen(true)}
            className="shadow-md shadow-blue-600/20"
          >
            <Upload className="w-4 h-4 mr-1.5" /> UPLOAD CASE DOCUMENT
          </Button>
        </div>
      </div>

      {/* Case Details Banner */}
      <Card className="border-slate-800 bg-slate-900/90">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">FIR Reference:</span>
            <span className="font-bold text-slate-200 font-mono text-sm">{caseItem.fir_number}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Police Station:</span>
            <span className="font-semibold text-slate-200">{caseItem.police_station}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Assigned Officer:</span>
            <span className="font-semibold text-slate-200">{caseItem.assigned_officer_name || 'Insp. Rajesh Varma'}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Date Created:</span>
            <span className="font-semibold text-slate-200">{new Date(caseItem.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs">
          <span className="font-semibold text-slate-300">Case Description:</span>
          <p className="mt-1 text-slate-400 leading-relaxed">{caseItem.description}</p>
        </div>
      </Card>

      {/* Main Grid: Documents List & Case Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Registry */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" /> Case Document Registry
                </CardTitle>
                <CardDescription>
                  Digital evidence, FIRs, investigation reports, charge sheets & cryptographic proofs
                </CardDescription>
              </div>

              <Badge variant="green" size="sm">
                {documents.length} FILES
              </Badge>
            </CardHeader>

            <div className="space-y-3">
              {documents.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No documents uploaded to this case yet. Click &quot;UPLOAD CASE DOCUMENT&quot; to add files.
                </div>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 hover:border-slate-700 transition-all text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                        <span className="font-bold text-slate-100">{doc.name}</span>
                        <Badge variant="blue" size="sm">
                          {doc.document_type}
                        </Badge>
                        <Badge variant="green" size="sm">
                          v{doc.version} VERIFIED
                        </Badge>
                      </div>

                      <Link href={`/documents/${doc.id}/verify`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Verify Cryptographic Hash
                        </Button>
                      </Link>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-blue-400">
                        <Lock className="w-3.5 h-3.5" /> SHA-256:
                      </span>
                      <span className="truncate ml-2 text-slate-200">{doc.sha256}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Size: {(doc.file_size / 1024).toFixed(1)} KB</span>
                      <span>Uploaded by: {doc.uploaded_by_name || 'Insp. Rajesh Varma'}</span>
                      <span>{new Date(doc.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Audit Trail Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="w-4 h-4 text-amber-400" /> Case Audit Trail
              </CardTitle>
            </CardHeader>

            <div className="space-y-2.5 text-xs">
              {auditLogs.length === 0 ? (
                <div className="text-slate-400 text-xs py-4 text-center">No logs recorded yet.</div>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-400 text-[11px]">{log.action}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(log.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-normal">{log.description}</p>
                    <div className="text-[10px] text-slate-400 font-mono pt-0.5">Actor: {log.user_name || 'System'}</div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Investigation Document"
        description="Select document file or use 1-click sample document generator."
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          {/* 1-CLICK SAMPLE GENERATOR BANNER */}
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2">
            <div>
              <div className="font-bold text-slate-100 text-xs flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> QUICK DEMO FILE
              </div>
              <p className="text-[10px] text-slate-400">
                Don&apos;t have a PDF file on your computer? Click to generate sample PDF evidence.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCreateSamplePDF}
              className="shrink-0 text-xs text-amber-400 border-amber-500/40 hover:bg-amber-500/10"
            >
              ⚡ Add Sample PDF
            </Button>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Document Type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as DocumentType)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            >
              <option value="FIR">FIR (First Information Report)</option>
              <option value="INVESTIGATION_REPORT">INVESTIGATION_REPORT</option>
              <option value="FORENSIC_REPORT">FORENSIC_REPORT</option>
              <option value="EVIDENCE_RECORD">EVIDENCE_RECORD</option>
              <option value="CHARGE_SHEET">CHARGE_SHEET</option>
              <option value="LEGAL_NOTICE">LEGAL_NOTICE</option>
              <option value="COURT_ORDER">COURT_ORDER</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Display File Title</label>
            <input
              type="text"
              value={customDocName}
              onChange={(e) => setCustomDocName(e.target.value)}
              placeholder="e.g. Investigation_Report_Final.pdf"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Choose Local File</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileSelect(f);
              }}
              className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
            />
          </div>

          {/* Live SHA-256 Calculation Box */}
          {computingHash && (
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs animate-pulse">
              Computing Web Crypto SHA-256 fingerprint...
            </div>
          )}

          {liveHash && (
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                Calculated SHA-256 Digest
              </span>
              <div className="font-mono text-[11px] text-slate-200 break-all">{liveHash}</div>
            </div>
          )}

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={uploading}
              disabled={!selectedFile || computingHash}
            >
              Upload & Commit SHA-256 to Ledger
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
