import { isSupabaseConfigured, createClient } from '@/lib/supabase/client';

export const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
];
export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export class DocumentStorageService {
  /**
   * Validates file type, extension, and file size before upload.
   */
  static validateFile(file: File): FileValidationResult {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return {
        valid: false,
        error: `Invalid file extension '${ext}'. Allowed types: PDF, DOC, DOCX, JPG, JPEG, PNG.`,
      };
    }

    if (file.type && !ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return {
        valid: false,
        error: `Invalid MIME type '${file.type}'. Allowed types: PDF, Word document, JPG, PNG images.`,
      };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        error: `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds maximum prototype limit of 15 MB.`,
      };
    }

    return { valid: true };
  }

  /**
   * Uploads file to Supabase Storage bucket 'documents' under path `cases/{caseId}/{documentId}/{filename}`.
   * If Supabase is unconfigured, returns simulated storage path for local evaluation.
   */
  static async uploadDocumentFile(params: {
    caseId: string;
    documentId: string;
    file: File;
  }): Promise<{ storagePath: string; publicUrl?: string }> {
    const sanitizedFileName = params.file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `cases/${params.caseId}/${params.documentId}/${sanitizedFileName}`;

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(storagePath, params.file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('Supabase Storage Upload Error:', error);
        throw new Error(`Supabase Storage Upload Failed: ${error.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from('documents')
        .getPublicUrl(storagePath);

      return {
        storagePath: data.path,
        publicUrl: publicUrlData.publicUrl,
      };
    }

    // Mock fallback storage URL
    return {
      storagePath,
      publicUrl: `https://storage.nyayavault.demo/${storagePath}`,
    };
  }
}
