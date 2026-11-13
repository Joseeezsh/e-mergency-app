import { Injectable, computed, inject, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

import type { AlertStatus, AppSettings, EmergencyAlert } from '../models/emergency.model';
import { DEFAULT_SETTINGS } from '../models/emergency.model';

import { SupabaseService } from './supabase.service';

const ALERTS_STORAGE_KEY = 'emergency_alerts_v1';
const SETTINGS_STORAGE_KEY = 'emergency_settings_v1';

/**
 * Manages hybrid persistent storage for emergency alerts and app settings:
 * 1. Fast local offline persistence via Capacitor Preferences.
 * 2. Real-time multi-device cloud synchronization via Supabase.
 */
@Injectable({ providedIn: 'root' })
export class EmergencyStoreService {
  private readonly supabase = inject(SupabaseService);

  private readonly alertsSignal = signal<EmergencyAlert[]>([]);
  private readonly settingsSignal = signal<AppSettings>(DEFAULT_SETTINGS);
  private initialized = false;

  readonly alerts = this.alertsSignal.asReadonly();
  readonly settings = this.settingsSignal.asReadonly();
  readonly activeCount = computed(() => this.alertsSignal().filter((alert) => alert.status === 'Active').length);

  async init(): Promise<void> {
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    // 1. Instant local load
    const [alertsRes, settingsRes] = await Promise.all([
      Preferences.get({ key: ALERTS_STORAGE_KEY }),
      Preferences.get({ key: SETTINGS_STORAGE_KEY }),
    ]);

    if (alertsRes.value) {
      try {
        const parsed = JSON.parse(alertsRes.value) as EmergencyAlert[];
        if (Array.isArray(parsed)) {
          this.alertsSignal.set(parsed);
        }
      } catch {
        this.alertsSignal.set([]);
      }
    }

    if (settingsRes.value) {
      try {
        const parsed = JSON.parse(settingsRes.value) as Partial<AppSettings>;
        this.settingsSignal.set({ ...DEFAULT_SETTINGS, ...parsed });
      } catch {
        this.settingsSignal.set(DEFAULT_SETTINGS);
      }
    }

    // 2. Cloud synchronization & Realtime subscription via Supabase
    if (this.supabase.isConfigured()) {
      void this.syncFromSupabase();
      this.setupRealtimeSubscription();
    }
  }

  private async syncFromSupabase(): Promise<void> {
    const remote = await this.supabase.fetchAllAlerts();
    if (remote.length > 0) {
      const local = this.alertsSignal();
      const map = new Map<string, EmergencyAlert>();

      // Put remote alerts first
      for (const item of remote) {
        map.set(item.id, item);
      }
      // Merge local alerts if not in remote
      for (const item of local) {
        if (!map.has(item.id)) {
          map.set(item.id, item);
        }
      }

      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      this.alertsSignal.set(merged);
      void Preferences.set({
        key: ALERTS_STORAGE_KEY,
        value: JSON.stringify(merged),
      });
    }
  }

  private setupRealtimeSubscription(): void {
    this.supabase.subscribeToLiveAlerts((eventType, alert) => {
      if (eventType === 'INSERT') {
        this.alertsSignal.update((current) => {
          if (current.some((a) => a.id === alert.id)) {
            return current;
          }
          return [alert, ...current];
        });
      } else if (eventType === 'UPDATE') {
        this.alertsSignal.update((current) =>
          current.map((a) => (a.id === alert.id ? { ...a, ...alert } : a))
        );
      } else if (eventType === 'DELETE') {
        this.alertsSignal.update((current) => current.filter((a) => a.id !== alert.id));
      }

      // Keep local storage fresh
      void Preferences.set({
        key: ALERTS_STORAGE_KEY,
        value: JSON.stringify(this.alertsSignal()),
      });
    });
  }

  async addAlert(alert: EmergencyAlert): Promise<void> {
    await this.init();
    const updated = [alert, ...this.alertsSignal()];
    this.alertsSignal.set(updated);

    await Preferences.set({
      key: ALERTS_STORAGE_KEY,
      value: JSON.stringify(updated),
    });

    // Push to Supabase cloud
    if (this.supabase.isConfigured()) {
      void this.supabase.insertAlert(alert);
    }
  }

  async updateAlertStatus(id: string, status: AlertStatus): Promise<void> {
    await this.init();
    const resolvedAt = status === 'Resolved' ? new Date().toISOString() : undefined;
    const updated = this.alertsSignal().map((alert) => (alert.id === id ? { ...alert, status, resolvedAt } : alert));
    this.alertsSignal.set(updated);

    await Preferences.set({
      key: ALERTS_STORAGE_KEY,
      value: JSON.stringify(updated),
    });

    // Update in Supabase cloud
    if (this.supabase.isConfigured()) {
      void this.supabase.updateStatus(id, status);
    }
  }

  async clearAllAlerts(): Promise<void> {
    await this.init();
    this.alertsSignal.set([]);
    await Preferences.remove({ key: ALERTS_STORAGE_KEY });
  }

  async updateSettings(partial: Partial<AppSettings>): Promise<void> {
    await this.init();
    const next = { ...this.settingsSignal(), ...partial };
    this.settingsSignal.set(next);
    await Preferences.set({
      key: SETTINGS_STORAGE_KEY,
      value: JSON.stringify(next),
    });
  }
}
