'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AuditService } from '@/lib/services/audit';
import { AuditLogRecord } from '@/types/nyaya';
import { History, Search, Filter, ShieldCheck, Terminal } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadLogs() {
      setLoading(true);
      const data = await AuditService.getAuditLogs({
        action: actionFilter,
        searchQuery,
      });
      setLogs(data);
      setLoading(false);
    }
    loadLogs();
  }, [actionFilter, searchQuery]);

  const actionsList = [
    'ALL',
    'LOGIN',
    'LOGOUT',
    'FIR_FETCHED',
    'FIR_IMPORTED',
    'CASE_CREATED',
    'DOCUMENT_UPLOADED',
    'HASH_GENERATED',
    'INTEGRITY_RECORDED',
    'DOCUMENT_VERIFIED',
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <History className="w-6 h-6 text-purple-400" /> SYSTEM AUDIT TRAIL
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable system event log capturing user authentication, FIR imports, document SHA-256 hash commitments, and verification events.
          </p>
        </div>

        <Badge variant="purple" size="md">
          {logs.length} AUDIT RECORDS
        </Badge>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit descriptions, users, cases..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">Filter Action:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-blue-500 focus:outline-none font-mono"
            >
              {actionsList.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" /> Security Event Stream
          </CardTitle>
          <CardDescription>Chronological system activity ordered by timestamp</CardDescription>
        </CardHeader>

        <div className="space-y-2">
          {logs.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">No audit logs matching criteria.</div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 hover:border-slate-700 transition-all text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="blue" size="sm" className="font-mono font-bold">
                      {log.action}
                    </Badge>
                    <span className="font-semibold text-slate-200">{log.user_name || 'System / Officer'}</span>
                    {log.case_number && (
                      <Badge variant="slate" size="sm">
                        {log.case_number}
                      </Badge>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>

                <p className="text-slate-300 font-medium text-xs leading-relaxed">{log.description}</p>

                {log.metadata && Object.keys(log.metadata).length > 0 && (
                  <div className="p-2 rounded bg-slate-900 border border-slate-800/80 font-mono text-[10px] text-slate-400 overflow-x-auto">
                    <code>{JSON.stringify(log.metadata, null, 2)}</code>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
