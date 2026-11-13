import { TestBed } from '@angular/core/testing';
import { Haptics } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';

import { EmergencyDispatchService } from './emergency-dispatch.service';
import { EmergencyStoreService } from './emergency-store.service';

vi.mock('@capacitor/haptics', () => ({
  ImpactStyle: { Medium: 'MEDIUM' },
  NotificationType: { Warning: 'WARNING' },
  Haptics: {
    impact: vi.fn().mockResolvedValue(undefined),
    notification: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('@capacitor/local-notifications', () => ({
  LocalNotifications: {
    checkPermissions: vi.fn().mockResolvedValue({ display: 'granted' }),
    requestPermissions: vi.fn().mockResolvedValue({ display: 'granted' }),
    schedule: vi.fn().mockResolvedValue({ notifications: [] }),
  },
}));

describe('EmergencyDispatchService', () => {
  let service: EmergencyDispatchService;
  let store: EmergencyStoreService;

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmergencyDispatchService);
    store = TestBed.inject(EmergencyStoreService);
  });

  it('logs alert, schedules notification, and blocks 911 dialer in Safe Test Mode', async () => {
    const dialSpy = vi
      .spyOn(service as unknown as { openDialer: (n: string) => void }, 'openDialer')
      .mockImplementation(() => undefined);

    const alert = await service.dispatchEmergency({
      category: 'Fire',
      note: '2nd floor hallway',
      location: { lat: 14.6, lng: 120.98, accuracy: 12, timestamp: '2026-11-11T09:00:00.000Z' },
      address: 'Manila City Hall',
    });

    expect(alert.callMode).toBe('safe-test');
    expect(alert.dialedNumber).toBe('911 (BLOCKED - Safe Test Mode)');
    expect(store.alerts().length).toBe(1);
    expect(Haptics.notification).toHaveBeenCalledTimes(1);
    expect(LocalNotifications.schedule).toHaveBeenCalledTimes(1);
    expect(dialSpy).not.toHaveBeenCalled();
  });

  it('invokes openDialer with 911 when Safe Test Mode is disabled', async () => {
    await store.updateSettings({ safeTestMode: false });
    const dialSpy = vi
      .spyOn(service as unknown as { openDialer: (n: string) => void }, 'openDialer')
      .mockImplementation(() => undefined);

    const alert = await service.dispatchEmergency({
      category: 'Medical',
      note: '',
      location: { lat: 14.6, lng: 120.98, accuracy: 10, timestamp: '2026-11-11T09:00:00.000Z' },
      address: 'Manila City Hall',
    });

    expect(alert.callMode).toBe('live-911');
    expect(alert.dialedNumber).toBe('911');
    expect(dialSpy).toHaveBeenCalledWith('911');
  });
});
