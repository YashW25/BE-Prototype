'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Shield,
  FileCheck2,
  Lock,
  History,
  FileSearch,
  ArrowRight,
  Database,
  Cpu,
  Scale,
  Award,
} from 'lucide-react';
import { UserRole } from '@/types/nyaya';

export default function LandingPage() {
  const { user, getRoleDashboardPath, switchRole } = useAuth();

  const demoRoles: { role: UserRole; title: string; desc: string; color: 'purple' | 'blue' | 'amber' | 'cyan' | 'green' }[] = [
    {
      role: 'INVESTIGATOR',
      title: 'Investigator Workspace',
      desc: 'Import FIRs from Police Station integration, manage case documents, compute SHA-256 hashes.',
      color: 'blue',
    },
    {
      role: 'LEGAL',
      title: 'Legal Prosecution',
      desc: 'Review authorized case records, inspect charge sheets, verify document authenticity.',
      color: 'amber',
    },
    {
      role: 'FORENSIC',
      title: 'Forensic Examination',
      desc: 'Log digital evidence hashes, submit forensic analysis reports, maintain chain of custody.',
      color: 'cyan',
    },
    {
      role: 'COURT',
      title: 'Judicial Registry',
      desc: 'Access verified court case files, validate cryptographic integrity proofs before hearing.',
      color: 'green',
    },
    {
      role: 'ADMIN',
      title: 'System Security Oversight',
      desc: 'Monitor user access, audit security events, maintain system availability logs.',
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-16 max-w-6xl mx-auto py-6">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
          <Award className="w-4 h-4 text-blue-400" /> SIH Problem Statement SIH26190 — Software Edition
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight">
          NYAYAVAULT
          <span className="block text-2xl md:text-3xl text-blue-400 font-semibold mt-2">
            Secure Digital Document Management System
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-slate-300 text-sm md:text-base leading-relaxed">
          Case-centric document management with role-based access control, cryptographic SHA-256
          integrity verification, and complete auditability for legal and investigation records.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {user ? (
            <Link href={getRoleDashboardPath(user.role)}>
              <Button variant="primary" size="lg" className="shadow-lg shadow-blue-600/20">
                GO TO {user.role} DASHBOARD <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="lg" className="shadow-lg shadow-blue-600/20">
                LOGIN TO SYSTEM <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
          )}

          <Link href="/cases">
            <Button variant="outline" size="lg">
              VIEW DEMO CASE DIRECTORY
            </Button>
          </Link>
        </div>

        <div className="pt-2 flex items-center justify-center gap-6 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-400" /> Supabase Storage & Auth
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-blue-400" /> SHA-256 Hashing
          </span>
          <span className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-purple-400" /> Mock Ledger Abstraction
          </span>
        </div>
      </section>

      {/* Primary Workflow Demo Flow Banner */}
      <Card gradient className="border-blue-500/30">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="blue" size="md">
              PRIMARY END-TO-END DEMONSTRATION WORKFLOW
            </Badge>
            <span className="text-xs text-slate-400 font-mono">Prototype 1.0</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs font-mono pt-2">
            <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-slate-200">
              1. LOGIN
            </div>
            <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-slate-200">
              2. IMPORT FIR
            </div>
            <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-slate-200">
              3. CREATE CASE
            </div>
            <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-slate-200">
              4. UPLOAD DOC
            </div>
            <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-slate-200">
              5. VERIFY HASH
            </div>
            <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-slate-200">
              6. AUDIT LOG
            </div>
          </div>
        </div>
      </Card>

      {/* Feature Cards Grid */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-100">Key Architectural Features</h2>
          <p className="text-xs text-slate-400 mt-1">
            Engineered for Ministry of Home Affairs / NCRB investigation workflow standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <Lock className="w-8 h-8 text-blue-400 mb-3" />
            <CardTitle className="text-base">Role-Based Access</CardTitle>
            <CardDescription className="mt-2 text-slate-300">
              Strict access control dividing privileges across Admin, Investigator, Legal, Forensic, and Court officers.
            </CardDescription>
          </Card>

          <Card>
            <FileCheck2 className="w-8 h-8 text-emerald-400 mb-3" />
            <CardTitle className="text-base">Document Integrity</CardTitle>
            <CardDescription className="mt-2 text-slate-300">
              Cryptographic SHA-256 fingerprinting on document upload to immediately catch any unauthorized file modification.
            </CardDescription>
          </Card>

          <Card>
            <FileSearch className="w-8 h-8 text-amber-400 mb-3" />
            <CardTitle className="text-base">Simulated FIR Import</CardTitle>
            <CardDescription className="mt-2 text-slate-300">
              Demonstrates API integration layer fetching FIR records from Police Station database to automatically synthesize case files.
            </CardDescription>
          </Card>

          <Card>
            <History className="w-8 h-8 text-purple-400 mb-3" />
            <CardTitle className="text-base">Immutable Audit Trail</CardTitle>
            <CardDescription className="mt-2 text-slate-300">
              Comprehensive security activity logging capturing user ID, IP address, timestamps, and metadata for every action.
            </CardDescription>
          </Card>
        </div>
      </section>

      {/* Role Interactive Demo Selector */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-100">Explore Role-Specific Dashboards</h2>
          <p className="text-xs text-slate-400 mt-1">
            Click any role card below to test workspace dashboards in demonstration mode.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {demoRoles.map((item) => (
            <Card key={item.role} className="flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={item.color} size="md">
                    {item.role}
                  </Badge>
                  <Scale className="w-4 h-4 text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-100 text-sm">{item.title}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{item.desc}</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="mt-5 w-full justify-between text-xs"
                onClick={() => switchRole(item.role)}
              >
                Launch {item.role} View <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
