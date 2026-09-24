export type UserRole = 'ADMIN' | 'INVESTIGATOR' | 'LEGAL' | 'FORENSIC' | 'COURT';

export type CaseStatus = 'OPEN' | 'UNDER_INVESTIGATION' | 'IN_REVIEW' | 'COURT_HEARING' | 'CLOSED';

export type DocumentType = 
  | 'FIR' 
  | 'INVESTIGATION_REPORT' 
  | 'FORENSIC_REPORT' 
  | 'EVIDENCE_RECORD' 
  | 'CHARGE_SHEET' 
  | 'LEGAL_NOTICE' 
  | 'COURT_ORDER';

export type DocumentStatus = 'ACTIVE' | 'VERIFIED' | 'FLAGGED' | 'ARCHIVED';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CaseRecord {
  id: string;
  case_number: string;
  title: string;
  description: string;
  fir_number: string;
  police_station: string;
  case_type: string;
  status: CaseStatus;
  assigned_officer?: string | null;
  assigned_officer_name?: string;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentRecord {
  id: string;
  case_id: string;
  name: string;
  document_type: DocumentType;
  storage_path: string;
  mime_type: string;
  file_size: number;
  sha256: string;
  version: number;
  status: DocumentStatus;
  uploaded_by?: string | null;
  uploaded_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface IntegrityRecord {
  id: string;
  document_id: string;
  document_hash: string;
  version: number;
  transaction_id: string;
  action: string;
  recorded_by?: string | null;
  created_at: string;
}

export interface AuditLogRecord {
  id: string;
  user_id?: string | null;
  user_name?: string | null;
  case_id?: string | null;
  case_number?: string | null;
  document_id?: string | null;
  document_name?: string | null;
  action: string;
  description: string;
  metadata?: Record<string, any>;
  ip_address?: string | null;
  created_at: string;
}

export interface FIRRecord {
  id: string;
  fir_number: string;
  police_station: string;
  registration_date: string;
  case_type: string;
  complainant_name: string;
  description: string;
  investigating_officer: string;
  status: string;
  source: string;
  raw_data?: Record<string, any>;
  created_at: string;
}
