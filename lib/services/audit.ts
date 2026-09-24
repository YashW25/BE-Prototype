import { AuditLogRecord } from '@/types/nyaya';
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client';
import { INITIAL_AUDIT_LOGS } from '@/lib/supabase/mockData';

let mockAuditLogs: AuditLogRecord[] = [...INITIAL_AUDIT_LOGS];

export interface CreateAuditLogParams {
  userId?: string | null;
  userName?: string | null;
  caseId?: string | null;
  caseNumber?: string | null;
  documentId?: string | null;
  documentName?: string | null;
  action: 
    | 'LOGIN'
    | 'LOGOUT'
    | 'FIR_FETCHED'
    | 'FIR_IMPORTED'
    | 'CASE_CREATED'
    | 'DOCUMENT_UPLOADED'
    | 'HASH_GENERATED'
    | 'INTEGRITY_RECORDED'
    | 'DOCUMENT_VERIFIED'
    | 'DOCUMENT_VIEWED'
    | 'DOCUMENT_DOWNLOADED';
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string | null;
}

export class AuditService {
  /**
   * Records a new audit trail event.
   */
  static async createAuditLog(params: CreateAuditLogParams): Promise<AuditLogRecord> {
    const newLog: AuditLogRecord = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id: params.userId || null,
      user_name: params.userName || 'System / Investigator',
      case_id: params.caseId || null,
      case_number: params.caseNumber || null,
      document_id: params.documentId || null,
      document_name: params.documentName || null,
      action: params.action,
      description: params.description,
      metadata: params.metadata || {},
      ip_address: params.ipAddress || '10.240.12.45',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('audit_logs')
        .insert({
          user_id: params.userId || null,
          case_id: params.caseId || null,
          document_id: params.documentId || null,
          action: params.action,
          description: params.description,
          metadata: params.metadata || {},
          ip_address: params.ipAddress || '10.240.12.45',
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase Audit Log Error:', error);
      } else if (data) {
        return {
          ...data,
          user_name: params.userName || 'System',
          case_number: params.caseNumber || null,
          document_name: params.documentName || null,
        } as AuditLogRecord;
      }
    }

    mockAuditLogs.unshift(newLog);
    return newLog;
  }

  /**
   * Retrieves audit logs with optional filtering.
   */
  static async getAuditLogs(filters?: {
    action?: string;
    userId?: string;
    caseId?: string;
    searchQuery?: string;
  }): Promise<AuditLogRecord[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      let query = supabase.from('audit_logs').select('*').order('created_at', { ascending: false });

      if (filters?.action) query = query.eq('action', filters.action);
      if (filters?.userId) query = query.eq('user_id', filters.userId);
      if (filters?.caseId) query = query.eq('case_id', filters.caseId);

      const { data } = await query;
      if (data && data.length > 0) return data as AuditLogRecord[];
    }

    let logs = [...mockAuditLogs];

    if (filters?.action && filters.action !== 'ALL') {
      logs = logs.filter((l) => l.action === filters.action);
    }
    if (filters?.userId) {
      logs = logs.filter((l) => l.user_id === filters.userId);
    }
    if (filters?.caseId) {
      logs = logs.filter((l) => l.case_id === filters.caseId);
    }
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.description.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          (l.user_name && l.user_name.toLowerCase().includes(q)) ||
          (l.case_number && l.case_number.toLowerCase().includes(q))
      );
    }

    return logs;
  }
}
