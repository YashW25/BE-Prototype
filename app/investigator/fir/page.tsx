'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PoliceStationService } from '@/lib/services/police';
import { CaseService } from '@/lib/services/cases';
import { FIRRecord } from '@/types/nyaya';
import {
  FileSearch,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Download,
  Loader2,
  Zap,
} from 'lucide-react';

export default function FIRImportPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [firNumber, setFirNumber] = useState('FIR/2026/01842');
  const [policeStation, setPoliceStation] = useState('Shivajinagar Police Station');
  const [loadingState, setLoadingState] = useState<'IDLE' | 'CONNECTING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [statusMessage, setStatusMessage] = useState('');
  const [firData, setFirData] = useState<FIRRecord | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const sampleFIRPresets = [
    { number: 'FIR/2026/01842', station: 'Shivajinagar Police Station', type: 'Theft' },
    { number: 'FIR/2026/01791', station: 'Pune Division Central PS', type: 'Financial Fraud' },
    { number: 'FIR/2026/01905', station: 'Cyber Crime Cell HQ', type: 'Cyber Extortion' },
  ];

  const fetchFIRWithParams = async (targetNumber: string, targetStation: string) => {
    setLoadingState('CONNECTING');
    setStatusMessage('Connecting to Police Station Integration Layer...');
    setFirData(null);

    try {
      const res = await PoliceStationService.fetchFIR(targetNumber, targetStation);
      if (res.success && res.data) {
        setStatusMessage('FIR Retrieved Successfully from Demo Police Station Integration');
        setFirData(res.data);
        setLoadingState('SUCCESS');
      } else {
        setStatusMessage(res.message);
        setLoadingState('ERROR');
      }
    } catch (err: any) {
      setStatusMessage(err.message || 'Failed to connect to Police Station API');
      setLoadingState('ERROR');
    }
  };

  const handleFetchFIR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firNumber) return;
    fetchFIRWithParams(firNumber, policeStation);
  };

  const handleSelectPreset = (preset: typeof sampleFIRPresets[0]) => {
    setFirNumber(preset.number);
    setPoliceStation(preset.station);
    fetchFIRWithParams(preset.number, preset.station);
  };

  const handleImportToNyayaVault = async () => {
    if (!firData) return;
    setIsImporting(true);

    try {
      const newCase = await CaseService.createCaseFromFIR(
        firData,
        user?.id,
        user?.full_name
      );
      router.push(`/cases/${newCase.id}`);
    } catch (err: any) {
      alert(`Import Failed: ${err.message}`);
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Header Banner */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            POLICE STATION FIR INTEGRATION
          </h1>
          <Badge variant="blue" size="md">
            DEMO INTEGRATION LAYER
          </Badge>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Fetch official First Information Records (FIRs) from simulated police station API and synthesize new NYAYAVAULT investigation cases.
        </p>
      </div>

      {/* 1-CLICK SAMPLE PRESET CHIPS */}
      <Card className="border-amber-500/30 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" /> 1-CLICK DEMO SAMPLES (CLICK ANY CHIP TO INSTANTLY FETCH)
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Test immediate integration with pre-registered police station records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {sampleFIRPresets.map((p) => (
              <button
                key={p.number}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 hover:bg-slate-800 text-xs font-mono font-bold text-slate-200 transition-all flex items-center gap-1.5"
              >
                <span>{p.number}</span>
                <Badge variant="blue" size="sm" className="text-[9px] py-0 px-1">
                  {p.type}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Card */}
        <Card className="md:col-span-1 space-y-4">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-blue-400" /> Search FIR Registry
            </CardTitle>
            <CardDescription>Enter registered FIR reference details</CardDescription>
          </CardHeader>

          <form onSubmit={handleFetchFIR} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">FIR Number</label>
              <input
                type="text"
                value={firNumber}
                onChange={(e) => setFirNumber(e.target.value)}
                placeholder="FIR/2026/01842"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-blue-500 focus:outline-none font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" /> Police Station Jurisdiction
              </label>
              <select
                value={policeStation}
                onChange={(e) => setPoliceStation(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-blue-500 focus:outline-none"
              >
                <option value="Shivajinagar Police Station">Shivajinagar Police Station</option>
                <option value="Pune Division Central PS">Pune Division Central PS</option>
                <option value="Cyber Crime Cell HQ">Cyber Crime Cell HQ</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loadingState === 'CONNECTING'}
              className="w-full text-xs font-semibold uppercase tracking-wider"
            >
              FETCH FIR RECORD
            </Button>
          </form>
        </Card>

        {/* Results Card */}
        <Card className="md:col-span-2 flex flex-col justify-between">
          <div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> FIR Payload & Record Preview
                </CardTitle>
                <Badge variant="amber" size="sm">
                  Demo Police Integration
                </Badge>
              </div>
              <CardDescription>
                Retrieved official record payload ready for NYAYAVAULT case synthesis
              </CardDescription>
            </CardHeader>

            {/* Loading State Animation */}
            {loadingState === 'CONNECTING' && (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-xs font-semibold text-blue-400 animate-pulse">{statusMessage}</p>
                <p className="text-[11px] text-slate-400">
                  Verifying cryptographic signature with Police Station Node...
                </p>
              </div>
            )}

            {/* Error State */}
            {loadingState === 'ERROR' && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div>
                  <div className="font-bold">Retrieval Failed</div>
                  <div>{statusMessage}</div>
                </div>
              </div>
            )}

            {/* Idle State */}
            {loadingState === 'IDLE' && (
              <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                <FileSearch className="w-10 h-10 mx-auto text-slate-600" />
                <p>Click &quot;FETCH FIR RECORD&quot; or any sample chip above to test integration.</p>
              </div>
            )}

            {/* Success Details Preview */}
            {loadingState === 'SUCCESS' && firData && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{statusMessage}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div className="font-mono text-sm font-bold text-slate-100">
                      {firData.fir_number}
                    </div>
                    <Badge variant="blue" size="sm">
                      {firData.case_type}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <span className="text-slate-400">Police Station:</span>
                      <div className="font-semibold text-slate-200">{firData.police_station}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Registration Date:</span>
                      <div className="font-semibold text-slate-200">
                        {new Date(firData.registration_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400">Complainant Name:</span>
                      <div className="font-semibold text-slate-200">{firData.complainant_name}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Investigating Officer:</span>
                      <div className="font-semibold text-slate-200">{firData.investigating_officer}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-900">
                    <span className="text-slate-400 text-[11px] font-semibold">FIR Offense Summary:</span>
                    <p className="mt-1 text-slate-300 leading-relaxed">{firData.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Import CTA Button */}
          {loadingState === 'SUCCESS' && firData && (
            <div className="pt-6 border-t border-slate-800">
              <Button
                variant="primary"
                size="lg"
                onClick={handleImportToNyayaVault}
                isLoading={isImporting}
                className="w-full shadow-lg shadow-blue-600/20 text-xs uppercase tracking-wider font-semibold"
              >
                <Download className="w-4 h-4 mr-2" /> IMPORT INTO NYAYAVAULT CASE REGISTRY
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
