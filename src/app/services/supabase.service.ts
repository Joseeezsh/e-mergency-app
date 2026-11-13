import { Injectable } from '@angular/core';
import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

import { environment } from '../../environments/environment';
import type { AlertStatus, CallMode, EmergencyAlert, EmergencyCategory } from '../models/emergency.model';

export interface DbEmergencyRow {
  id: string;
  category: string;
  note: string | null;
  lat: number;
  lng: number;
  accuracy: number | null;
  address: string | null;
  status: string | null;
  call_mode: string | null;
  dialed_number: string | null;
  photo_data_url: string | null;
  created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private client: SupabaseClient | null = null;
  private channel: RealtimeChannel | null = null;

  constructor() {
    this.initClient();
  }

  private initClient(): void {
    if (environment.supabaseUrl && environment.supabaseKey) {
      try {
        this.client = createClient(environment.supabaseUrl, environment.supabaseKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        });
      } catch (err) {
        console.warn('[SupabaseService] Failed to initialize Supabase client:', err);
      }
    }
  }

  isConfigured(): boolean {
    return !!this.client;
  }

  async fetchAllAlerts(): Promise<EmergencyAlert[]> {
    if (!this.client) {
      return [];
    }

    try {
      const { data, error } = await this.client
        .from('emergencies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[SupabaseService] fetchAllAlerts error:', error.message);
        return [];
      }

      return (data as DbEmergencyRow[]).map((row) => this.rowToAlert(row));
    } catch (err) {
      console.warn('[SupabaseService] Network error during fetchAllAlerts:', err);
      return [];
    }
  }

  async insertAlert(alert: EmergencyAlert): Promise<boolean> {
    if (!this.client) {
      return false;
    }

    try {
      const row: DbEmergencyRow = {
        id: alert.id,
        category: alert.category,
        note: alert.note || null,
        lat: alert.lat,
        lng: alert.lng,
        accuracy: alert.accuracy,
        address: alert.address || null,
        status: alert.status,
        call_mode: alert.callMode,
        dialed_number: alert.dialedNumber,
        photo_data_url: alert.photoDataUrl || null,
      };

      const { error } = await this.client.from('emergencies').insert([row]);
      if (error) {
        console.warn('[SupabaseService] insertAlert error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[SupabaseService] Network error during insertAlert:', err);
      return false;
    }
  }

  async updateStatus(id: string, status: AlertStatus): Promise<boolean> {
    if (!this.client) {
      return false;
    }

    try {
      const { error } = await this.client
        .from('emergencies')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.warn('[SupabaseService] updateStatus error:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[SupabaseService] Network error during updateStatus:', err);
      return false;
    }
  }

  subscribeToLiveAlerts(onChange: (event: 'INSERT' | 'UPDATE' | 'DELETE', alert: EmergencyAlert) => void): void {
    if (!this.client || this.channel) {
      return;
    }

    try {
      this.channel = this.client
        .channel('public:emergencies')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'emergencies' },
          (payload) => {
            const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';
            const row = (payload.new && Object.keys(payload.new).length > 0
              ? payload.new
              : payload.old) as DbEmergencyRow;

            if (row?.id) {
              onChange(eventType, this.rowToAlert(row));
            }
          }
        )
        .subscribe();
    } catch (err) {
      console.warn('[SupabaseService] Subscription error:', err);
    }
  }

  unsubscribe(): void {
    if (this.channel && this.client) {
      void this.client.removeChannel(this.channel);
      this.channel = null;
    }
  }

  private rowToAlert(row: DbEmergencyRow): EmergencyAlert {
    return {
      id: row.id,
      category: (row.category as EmergencyCategory) || 'General',
      note: row.note || '',
      lat: row.lat,
      lng: row.lng,
      accuracy: row.accuracy ?? 10,
      address: row.address || 'Location coordinates detected',
      timestamp: row.created_at || new Date().toISOString(),
      status: (row.status as AlertStatus) || 'Active',
      callMode: (row.call_mode as CallMode) || 'live-911',
      dialedNumber: row.dialed_number || '911',
      photoDataUrl: row.photo_data_url || undefined,
    };
  }
}

