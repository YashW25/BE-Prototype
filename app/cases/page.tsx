'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Briefcase, Search, Filter, PlusCircle, ArrowRight, Building2 } from 'lucide-react';
import { CaseService } from '@/lib/services/cases';
import { CaseRecord } from '@/types/nyaya';

export default function CasesListPage() {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCases() {
      setLoading(true);
      const data = await CaseService.getCases({ status: statusFilter, searchQuery });
      setCases(data);
      setLoading(false);
    }
    fetchCases();
  }, [statusFilter, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-400" /> CENTRAL CASE DIRECTORY
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse, search, and inspect digital investigation cases and associated case documents.
          </p>
        </div>

        <Link href="/investigator/fir">
          <Button variant="primary" size="md">
            <PlusCircle className="w-4 h-4 mr-1.5" /> IMPORT NEW CASE (VIA FIR)
          </Button>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by case #, title, or station..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-slate-100 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="UNDER_INVESTIGATION">UNDER_INVESTIGATION</option>
              <option value="IN_REVIEW">IN_REVIEW</option>
              <option value="COURT_HEARING">COURT_HEARING</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Cases Grid */}
      <div className="space-y-3">
        {cases.length === 0 ? (
          <Card className="py-12 text-center text-slate-400 text-xs">
            No cases match the search query or status filter.
          </Card>
        ) : (
          cases.map((c) => (
            <Card key={c.id} className="hover:border-slate-700 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-base font-mono">
                      {c.case_number}
                    </span>
                    <Badge variant="blue" size="sm">
                      {c.case_type}
                    </Badge>
                    <Badge variant="slate" size="sm">
                      {c.status}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-slate-200 text-sm">{c.title}</h3>
                  <p className="text-slate-400 text-xs max-w-3xl leading-relaxed">{c.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> {c.police_station}
                    </span>
                    <span>FIR Reference: <strong className="text-slate-300 font-mono">{c.fir_number}</strong></span>
                    <span>Created: {new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/cases/${c.id}`}>
                    <Button variant="primary" size="sm" className="text-xs">
                      Open Case Workspace <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
