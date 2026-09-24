import { DocumentRecord, DocumentType } from '@/types/nyaya';
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client';
import { INITIAL_DOCUMENTS } from '@/lib/supabase/mockData';
import { calculateSHA256 } from './hashing';
import { DocumentStorageService } from './storage';
import { BlockchainService } from './blockchain';
import { AuditService } from './audit';

let mockDocumentsStore: DocumentRecord[] = [...INITIAL_DOCUMENTS];

export interface UploadDocumentParams {
  caseId: string;
  caseNumber?: string;
  file: File;
  documentType: DocumentType;
  customName?: string;
  uploadedBy?: string;
  uploadedByName?: string;
}

export class DocumentService {
  /**
   * Retrieves all documents for a specific case.
   */
  static async getDocumentsByCase(caseId: string): Promise<DocumentRecord[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data } = await supabase
        .from('documents')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) return data as DocumentRecord[];
    }

    return mockDocumentsStore
      .filter((d) => d.case_id === caseId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  /**
   * Retrieves a document by ID.
   */
  static async getDocumentById(id: string): Promise<DocumentRecord | null> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data } = await supabase.from('documents').select('*').eq('id', id).single();
      if (data) return data as DocumentRecord;
    }

    return mockDocumentsStore.find((d) => d.id === id) || null;
  }

  /**
   * Complete Document Upload Flow:
   * 1. Validate File
   * 2. Calculate SHA-256 Cryptographic Hash
   * 3. Upload File to Supabase Storage
   * 4. Save metadata entry in `documents`
   * 5. Record Cryptographic Proof in Blockchain Service (`integrity_records`)
   * 6. Create Audit Log entries
   */
  static async uploadDocument(params: UploadDocumentParams): Promise<DocumentRecord> {
    // 1. Validate file
    const validation = DocumentStorageService.validateFile(params.file);
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid document file');
    }

    const documentId = `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const documentName = params.customName || params.file.name;

    // 2. Calculate SHA-256
    const sha256 = await calculateSHA256(params.file);

    // Audit log for hash generation
    await AuditService.createAuditLog({
      userId: params.uploadedBy,
      userName: params.uploadedByName,
      caseId: params.caseId,
      caseNumber: params.caseNumber,
      documentId,
      documentName,
      action: 'HASH_GENERATED',
      description: `Generated SHA-256 hash (${sha256.slice(0, 12)}...) for ${documentName}`,
      metadata: { sha256, mimeType: params.file.type, size: params.file.size }
    });

    // 3. Upload File to Storage
    const { storagePath } = await DocumentStorageService.uploadDocumentFile({
      caseId: params.caseId,
      documentId,
      file: params.file,
    });

    const newDoc: DocumentRecord = {
      id: documentId,
      case_id: params.caseId,
      name: documentName,
      document_type: params.documentType,
      storage_path: storagePath,
      mime_type: params.file.type || 'application/octet-stream',
      file_size: params.file.size,
      sha256,
      version: 1,
      status: 'VERIFIED',
      uploaded_by: params.uploadedBy || 'usr-inv-002',
      uploaded_by_name: params.uploadedByName || 'Insp. Rajesh Varma',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('documents')
        .insert({
          case_id: params.caseId,
          name: documentName,
          document_type: params.documentType,
          storage_path: storagePath,
          mime_type: newDoc.mime_type,
          file_size: newDoc.file_size,
          sha256,
          version: 1,
          status: 'VERIFIED',
          uploaded_by: params.uploadedBy || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase Document Insert Error:', error);
      } else if (data) {
        // Record Blockchain integrity
        const integrityRecord = await BlockchainService.recordDocumentIntegrity({
          documentId: data.id,
          documentHash: sha256,
          version: 1,
          action: 'INITIAL_HASH_COMMITTED',
          recordedBy: params.uploadedBy,
        });

        // Audit Log for upload & integrity
        await AuditService.createAuditLog({
          userId: params.uploadedBy,
          userName: params.uploadedByName,
          caseId: params.caseId,
          caseNumber: params.caseNumber,
          documentId: data.id,
          documentName,
          action: 'DOCUMENT_UPLOADED',
          description: `Uploaded ${documentName} (${(params.file.size / 1024).toFixed(1)} KB) and committed hash to mock ledger`,
          metadata: {
            sha256,
            transaction_id: integrityRecord.transaction_id,
            storage_path: storagePath,
          }
        });

        await AuditService.createAuditLog({
          userId: params.uploadedBy,
          userName: params.uploadedByName,
          caseId: params.caseId,
          caseNumber: params.caseNumber,
          documentId: data.id,
          documentName,
          action: 'INTEGRITY_RECORDED',
          description: `Committed cryptographic proof transaction ${integrityRecord.transaction_id}`,
          metadata: { transaction_id: integrityRecord.transaction_id, hash: sha256 }
        });

        return data as DocumentRecord;
      }
    }

    mockDocumentsStore.unshift(newDoc);

    const integrityRecord = await BlockchainService.recordDocumentIntegrity({
      documentId: newDoc.id,
      documentHash: sha256,
      version: 1,
      action: 'INITIAL_HASH_COMMITTED',
      recordedBy: params.uploadedBy,
    });

    await AuditService.createAuditLog({
      userId: params.uploadedBy,
      userName: params.uploadedByName,
      caseId: params.caseId,
      caseNumber: params.caseNumber,
      documentId: newDoc.id,
      documentName,
      action: 'DOCUMENT_UPLOADED',
      description: `Uploaded ${documentName} (${(params.file.size / 1024).toFixed(1)} KB) and committed hash to mock ledger`,
      metadata: {
        sha256,
        transaction_id: integrityRecord.transaction_id,
        storage_path: storagePath,
      }
    });

    await AuditService.createAuditLog({
      userId: params.uploadedBy,
      userName: params.uploadedByName,
      caseId: params.caseId,
      caseNumber: params.caseNumber,
      documentId: newDoc.id,
      documentName,
      action: 'INTEGRITY_RECORDED',
      description: `Committed cryptographic proof transaction ${integrityRecord.transaction_id}`,
      metadata: { transaction_id: integrityRecord.transaction_id, hash: sha256 }
    });

    return newDoc;
  }

  /**
   * Retrieves all documents.
   */
  static async getAllDocuments(): Promise<DocumentRecord[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) return data as DocumentRecord[];
    }
    return mockDocumentsStore;
  }
}
