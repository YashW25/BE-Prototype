import { IntegrityRecord } from '@/types/nyaya';
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client';
import { INITIAL_INTEGRITY_RECORDS } from '@/lib/supabase/mockData';

// In-memory ledger fallback for prototype execution
let mockLedgerStore: IntegrityRecord[] = [...INITIAL_INTEGRITY_RECORDS];

export class BlockchainService {
  /**
   * Generates a deterministic-format transaction ID for the mock ledger.
   * Format: TX-2026-XXXXXX
   */
  private static generateTransactionId(): string {
    const randomHex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0');
    return `TX-2026-${randomHex}`;
  }

  /**
   * Records a new document cryptographic hash commitment to the ledger.
   */
  static async recordDocumentIntegrity(params: {
    documentId: string;
    documentHash: string;
    version: number;
    action: string;
    recordedBy?: string | null;
  }): Promise<IntegrityRecord> {
    const transactionId = this.generateTransactionId();

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('integrity_records')
        .insert({
          document_id: params.documentId,
          document_hash: params.documentHash,
          version: params.version,
          transaction_id: transactionId,
          action: params.action,
          recorded_by: params.recordedBy || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase Integrity Record Insert Error:', error);
      } else if (data) {
        return data as IntegrityRecord;
      }
    }

    // Fallback store
    const newRecord: IntegrityRecord = {
      id: `int-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      document_id: params.documentId,
      document_hash: params.documentHash,
      version: params.version,
      transaction_id: transactionId,
      action: params.action,
      recorded_by: params.recordedBy || null,
      created_at: new Date().toISOString(),
    };

    mockLedgerStore.unshift(newRecord);
    return newRecord;
  }

  /**
   * Verifies if a document hash exists and matches an existing transaction record on the ledger.
   */
  static async verifyDocumentIntegrity(documentId: string, currentHash: string): Promise<{
    isValid: boolean;
    record: IntegrityRecord | null;
    message: string;
  }> {
    let records: IntegrityRecord[] = [];

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data } = await supabase
        .from('integrity_records')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        records = data as IntegrityRecord[];
      }
    }

    if (records.length === 0) {
      records = mockLedgerStore.filter(r => r.document_id === documentId);
    }

    if (records.length === 0) {
      return {
        isValid: false,
        record: null,
        message: 'No registered ledger integrity record found for this document ID.',
      };
    }

    const latestRecord = records[0];
    const isMatch = latestRecord.document_hash.toLowerCase() === currentHash.toLowerCase();

    return {
      isValid: isMatch,
      record: latestRecord,
      message: isMatch
        ? 'SHA-256 Hash matches recorded ledger transaction.'
        : 'SHA-256 Hash MISMATCH detected! Document content may have been altered.',
    };
  }

  /**
   * Retrieves transaction record by transaction ID.
   */
  static async getTransaction(transactionId: string): Promise<IntegrityRecord | null> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data } = await supabase
        .from('integrity_records')
        .select('*')
        .eq('transaction_id', transactionId)
        .single();
      if (data) return data as IntegrityRecord;
    }

    return mockLedgerStore.find(r => r.transaction_id === transactionId) || null;
  }

  /**
   * Retrieves all integrity records for a document.
   */
  static async getDocumentHistory(documentId: string): Promise<IntegrityRecord[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data } = await supabase
        .from('integrity_records')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: false });
      if (data) return data as IntegrityRecord[];
    }

    return mockLedgerStore
      .filter(r => r.document_id === documentId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
}
