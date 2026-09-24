import { FIRRecord } from '@/types/nyaya';
import { INITIAL_FIR_RECORDS } from '@/lib/supabase/mockData';
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client';

let mockFirStore: FIRRecord[] = [...INITIAL_FIR_RECORDS];

export class PoliceStationService {
  /**
   * Fetches simulated FIR record from Demo Police Station Integration Layer.
   */
  static async fetchFIR(firNumber: string, policeStation?: string): Promise<{
    success: boolean;
    data: FIRRecord | null;
    message: string;
  }> {
    // Artificial delay to simulate government integration layer handshake
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const formattedNumber = firNumber.trim().toUpperCase();

    // Check Supabase if configured
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      let query = supabase.from('fir_records').select('*').eq('fir_number', formattedNumber);
      if (policeStation) {
        query = query.ilike('police_station', `%${policeStation}%`);
      }
      const { data } = await query.single();
      if (data) {
        return {
          success: true,
          data: data as FIRRecord,
          message: 'FIR retrieved successfully from Demo Police Station Integration API',
        };
      }
    }

    // Check mock store
    const found = mockFirStore.find(
      (f) => f.fir_number.toLowerCase() === formattedNumber.toLowerCase()
    );

    if (found) {
      return {
        success: true,
        data: found,
        message: 'FIR retrieved successfully from Demo Police Station Integration API',
      };
    }

    // Dynamic generation if user searches a new custom FIR number format (e.g. FIR/2026/9999)
    if (formattedNumber.startsWith('FIR/')) {
      const customFir: FIRRecord = {
        id: `fir-${Date.now()}`,
        fir_number: formattedNumber,
        police_station: policeStation || 'Shivajinagar Police Station',
        registration_date: new Date().toISOString(),
        case_type: 'General Theft & Property Loss',
        complainant_name: 'Anand Vardhan',
        description: `Simulated crime record for ${formattedNumber}. Confidential law-enforcement report registered at ${policeStation || 'Shivajinagar Police Station'}.`,
        investigating_officer: 'INS-102 (Insp. Rajesh Varma)',
        status: 'INVESTIGATION',
        source: 'Demo Police Station Integration API',
        created_at: new Date().toISOString(),
        raw_data: {
          simulated: true,
          query_timestamp: new Date().toISOString(),
        }
      };

      mockFirStore.push(customFir);
      return {
        success: true,
        data: customFir,
        message: 'FIR record synthesized by Demo Police Station Integration Gateway',
      };
    }

    return {
      success: false,
      data: null,
      message: `FIR record ${formattedNumber} not found in Demo Police Station Registry. Please use format 'FIR/2026/01842'.`,
    };
  }

  /**
   * Retrieves all available demo FIR records.
   */
  static async getAllFIRs(): Promise<FIRRecord[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data } = await supabase.from('fir_records').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) return data as FIRRecord[];
    }
    return mockFirStore;
  }
}
