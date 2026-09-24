-- NYAYAVAULT Schema Initial Migration
-- SIH Problem Statement SIH26190

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'INVESTIGATOR', 'LEGAL', 'FORENSIC', 'COURT')),
  department TEXT NOT NULL DEFAULT 'General',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CASES TABLE
CREATE TABLE IF NOT EXISTS public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  fir_number TEXT NOT NULL,
  police_station TEXT NOT NULL,
  case_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'UNDER_INVESTIGATION', 'IN_REVIEW', 'COURT_HEARING', 'CLOSED')),
  assigned_officer UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('FIR', 'INVESTIGATION_REPORT', 'FORENSIC_REPORT', 'EVIDENCE_RECORD', 'CHARGE_SHEET', 'LEGAL_NOTICE', 'COURT_ORDER')),
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  sha256 TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'VERIFIED', 'FLAGGED', 'ARCHIVED')),
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. INTEGRITY_RECORDS TABLE (Mock Ledger / Blockchain Abstraction)
CREATE TABLE IF NOT EXISTS public.integrity_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  document_hash TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  transaction_id TEXT NOT NULL,
  action TEXT NOT NULL,
  recorded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. AUDIT_LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. FIR_RECORDS TABLE (Simulated Police Integration)
CREATE TABLE IF NOT EXISTS public.fir_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fir_number TEXT UNIQUE NOT NULL,
  police_station TEXT NOT NULL,
  registration_date TIMESTAMPTZ NOT NULL,
  case_type TEXT NOT NULL,
  complainant_name TEXT NOT NULL,
  description TEXT NOT NULL,
  investigating_officer TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'REGISTERED',
  source TEXT NOT NULL DEFAULT 'DEMO_POLICE_STATION_API',
  raw_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_cases_assigned ON public.cases(assigned_officer);
CREATE INDEX IF NOT EXISTS idx_documents_case ON public.documents(case_id);
CREATE INDEX IF NOT EXISTS idx_integrity_doc ON public.integrity_records(document_id);
CREATE INDEX IF NOT EXISTS idx_audit_case ON public.audit_logs(case_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_fir_number ON public.fir_records(fir_number);

-- RLS POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrity_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fir_records ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view profiles
CREATE POLICY "Allow authenticated view profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to view cases
CREATE POLICY "Allow authenticated view cases" ON public.cases
  FOR SELECT TO authenticated USING (true);

-- Allow investigators & admins to insert/update cases
CREATE POLICY "Allow insert cases" ON public.cases
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow update cases" ON public.cases
  FOR UPDATE TO authenticated USING (true);

-- Allow authenticated users to view documents
CREATE POLICY "Allow authenticated view documents" ON public.documents
  FOR SELECT TO authenticated USING (true);

-- Allow upload documents
CREATE POLICY "Allow insert documents" ON public.documents
  FOR INSERT TO authenticated WITH CHECK (true);

-- Integrity records RLS
CREATE POLICY "Allow authenticated view integrity" ON public.integrity_records
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow insert integrity" ON public.integrity_records
  FOR INSERT TO authenticated WITH CHECK (true);

-- Audit logs RLS
CREATE POLICY "Allow authenticated view audit" ON public.audit_logs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow insert audit" ON public.audit_logs
  FOR INSERT TO authenticated WITH CHECK (true);

-- FIR records RLS
CREATE POLICY "Allow authenticated view fir" ON public.fir_records
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow insert fir" ON public.fir_records
  FOR INSERT TO authenticated WITH CHECK (true);

-- TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cases_timestamp BEFORE UPDATE ON public.cases
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_documents_timestamp BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_profiles_timestamp BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
