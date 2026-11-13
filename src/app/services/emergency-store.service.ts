import { Injectable, computed, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

import type { AlertStatus, AppSettings, EmergencyAlert } from '../models/emergency.model';
import { DEFAULT_SETTINGS } from '../models/emergency.model';

const ALERTS_STORAGE_KEY = 'emergency_alerts_v1';
const SETTINGS_STORAGE_KEY = 'emergency_settings_v1';

/**
 * Manages persistent local storage for emergency alerts and app settings via Capacitor Preferences.
 */
@Injectable({ providedIn: 'root' })
export class EmergencyStoreService {
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
  }

  async addAlert(alert: EmergencyAlert): Promise<void> {
    await this.init();
    const updated = [alert, ...this.alertsSignal()];
    this.alertsSignal.set(updated);
    await Preferences.set({
      key: ALERTS_STORAGE_KEY,
      value: JSON.stringify(updated),
    });
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
