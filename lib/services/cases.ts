import { CaseRecord, FIRRecord } from '@/types/nyaya';
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client';
import { INITIAL_CASES } from '@/lib/supabase/mockData';
import { AuditService } from './audit';

let mockCasesStore: CaseRecord[] = [...INITIAL_CASES];

export class CaseService {
  /**
   * Retrieves all cases.
   */
  static async getCases(filters?: { status?: string; searchQuery?: string }): Promise<CaseRecord[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      let query = supabase.from('cases').select('*').order('created_at', { ascending: false });

      if (filters?.status && filters.status !== 'ALL') {
        query = query.eq('status', filters.status);
      }

      const { data } = await query;
      if (data && data.length > 0) return data as CaseRecord[];
    }

    let cases = [...mockCasesStore];
    if (filters?.status && filters.status !== 'ALL') {
      cases = cases.filter((c) => c.status === filters.status);
    }
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      cases = cases.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.case_number.toLowerCase().includes(q) ||
          c.fir_number.toLowerCase().includes(q) ||
          c.police_station.toLowerCase().includes(q)
      );
    }
    return cases;
  }

  /**
   * Retrieves a single case by ID.
   */
  static async getCaseById(id: string): Promise<CaseRecord | null> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data } = await supabase.from('cases').select('*').eq('id', id).single();
      if (data) return data as CaseRecord;
    }
    return mockCasesStore.find((c) => c.id === id) || null;
  }

  /**
   * Creates a case from an imported FIR record.
   */
  static async createCaseFromFIR(
    fir: FIRRecord,
    userId?: string,
    userName?: string
  ): Promise<CaseRecord> {
    // Generate case number CASE-2026-XXXXX
    const caseNumber = fir.fir_number.replace('FIR/', 'CASE-');
    
    const newCase: CaseRecord = {
      id: `case-${Date.now()}`,
      case_number: caseNumber,
      title: `${fir.police_station.replace('Police Station', '').trim()} ${fir.case_type} Investigation`,
      description: fir.description,
      fir_number: fir.fir_number,
      police_station: fir.police_station,
      case_type: fir.case_type,
      status: 'UNDER_INVESTIGATION',
      assigned_officer: userId || 'usr-inv-002',
      assigned_officer_name: userName || fir.investigating_officer || 'Insp. Rajesh Varma',
      created_by: userId || 'usr-inv-002',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('cases')
        .insert({
          case_number: newCase.case_number,
          title: newCase.title,
          description: newCase.description,
          fir_number: newCase.fir_number,
          police_station: newCase.police_station,
          case_type: newCase.case_type,
          status: newCase.status,
          assigned_officer: userId || null,
          created_by: userId || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase Case Creation Error:', error);
      } else if (data) {
        // Audit log creation
        await AuditService.createAuditLog({
          userId,
          userName,
          caseId: data.id,
          caseNumber: data.case_number,
          action: 'CASE_CREATED',
          description: `Created case ${data.case_number} from FIR ${fir.fir_number}`,
          metadata: { fir_number: fir.fir_number, police_station: fir.police_station }
        });
        return data as CaseRecord;
      }
    }

    mockCasesStore.unshift(newCase);

    await AuditService.createAuditLog({
      userId,
      userName,
      caseId: newCase.id,
      caseNumber: newCase.case_number,
      action: 'CASE_CREATED',
      description: `Created case ${newCase.case_number} from FIR ${fir.fir_number}`,
      metadata: { fir_number: fir.fir_number, police_station: fir.police_station }
    });

    return newCase;
  }
}
