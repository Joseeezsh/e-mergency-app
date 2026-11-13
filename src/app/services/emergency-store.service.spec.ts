import { TestBed } from '@angular/core/testing';

import { DEFAULT_SETTINGS } from '../models/emergency.model';
import type { EmergencyAlert } from '../models/emergency.model';

import { EmergencyStoreService } from './emergency-store.service';

describe('EmergencyStoreService', () => {
  let service: EmergencyStoreService;

  const sampleAlert: EmergencyAlert = {
    id: 'SOS-100001',
    category: 'Medical',
    note: 'Lobby entrance',
    lat: 14.5995,
    lng: 120.9842,
    accuracy: 15,
    address: 'Manila, Philippines',
    timestamp: '2026-11-11T09:00:00.000Z',
    status: 'Active',
    callMode: 'safe-test',
    dialedNumber: '911 (BLOCKED - Safe Test Mode)',
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmergencyStoreService);
  });

  it('initializes with default settings and empty alerts', async () => {
    await service.init();
    expect(service.alerts()).toEqual([]);
    expect(service.settings()).toEqual(DEFAULT_SETTINGS);
    expect(service.activeCount()).toBe(0);
  });

  it('persists new alerts and updates status to Acknowledged and Resolved', async () => {
    await service.addAlert(sampleAlert);
    expect(service.alerts().length).toBe(1);
    expect(service.activeCount()).toBe(1);

    await service.updateAlertStatus(sampleAlert.id, 'Acknowledged');
    expect(service.alerts()[0].status).toBe('Acknowledged');
    expect(service.activeCount()).toBe(0);

    await service.updateAlertStatus(sampleAlert.id, 'Resolved');
    expect(service.alerts()[0].status).toBe('Resolved');
    expect(service.alerts()[0].resolvedAt).toBeTruthy();
  });

  it('updates settings and clears alert logs', async () => {
    await service.updateSettings({ safeTestMode: false, countdownSeconds: 10 });
    expect(service.settings()).toEqual({
      safeTestMode: false,
      countdownSeconds: 10,
      soundEnabled: true,
    });

    await service.addAlert(sampleAlert);
    await service.clearAllAlerts();
    expect(service.alerts()).toEqual([]);
  });
});
