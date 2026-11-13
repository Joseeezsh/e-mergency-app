import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { EmergencyDispatchService } from '../../services/emergency-dispatch.service';
import { EmergencyStoreService } from '../../services/emergency-store.service';
import { GeocodingService } from '../../services/geocoding.service';
import { LocationService } from '../../services/location.service';

import { SosPage } from './sos.page';

describe('SosPage', () => {
  let component: SosPage;
  let fixture: ComponentFixture<SosPage>;
  let dispatchSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    localStorage.clear();
    dispatchSpy = vi.fn().mockResolvedValue({
      id: 'SOS-999999',
      category: 'Medical',
      note: 'Test note',
      lat: 14.5995,
      lng: 120.9842,
      accuracy: 12,
      address: 'Manila, Philippines',
      timestamp: '2026-11-11T09:00:00.000Z',
      status: 'Active',
      callMode: 'safe-test',
      dialedNumber: '911 (BLOCKED - Safe Test Mode)',
    });

    await TestBed.configureTestingModule({
      imports: [SosPage],
      providers: [
        {
          provide: LocationService,
          useValue: {
            checkPermissionsSummary: vi.fn().mockResolvedValue({
              locationPermission: 'granted',
              notificationsPermission: 'granted',
              locationServicesEnabled: true,
            }),
            requestAllPermissions: vi.fn().mockResolvedValue({
              locationPermission: 'granted',
              notificationsPermission: 'granted',
              locationServicesEnabled: true,
            }),
            getCurrentLocation: vi.fn().mockResolvedValue({
              lat: 14.5995,
              lng: 120.9842,
              accuracy: 12,
              timestamp: '2026-11-11T09:00:00.000Z',
            }),
          },
        },
        {
          provide: GeocodingService,
          useValue: {
            reverseGeocode: vi.fn().mockResolvedValue('Manila, Philippines'),
          },
        },
        {
          provide: EmergencyDispatchService,
          useValue: {
            triggerCountdownTickHaptic: vi.fn().mockResolvedValue(undefined),
            dispatchEmergency: dispatchSpy,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('creates the SOS page directly with no login gate', () => {
    expect(component).toBeTruthy();
  });

  it('cancels the SOS countdown without dispatching an alert', async () => {
    vi.useFakeTimers();
    const store = TestBed.inject(EmergencyStoreService);
    await store.updateSettings({ countdownSeconds: 3 });

    component.locationFix.set({
      lat: 14.5995,
      lng: 120.9842,
      accuracy: 12,
      timestamp: '2026-11-11T09:00:00.000Z',
    });

    component.startSosCountdown();
    expect(component.countdownRemaining()).toBe(3);

    await vi.advanceTimersByTimeAsync(1000);
    expect(component.countdownRemaining()).toBe(2);

    component.cancelSosCountdown();
    expect(component.countdownRemaining()).toBeNull();

    await vi.advanceTimersByTimeAsync(5000);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('dispatches the alert when the countdown completes', async () => {
    vi.useFakeTimers();
    const store = TestBed.inject(EmergencyStoreService);
    await store.updateSettings({ countdownSeconds: 3 });

    component.locationFix.set({
      lat: 14.5995,
      lng: 120.9842,
      accuracy: 12,
      timestamp: '2026-11-11T09:00:00.000Z',
    });
    component.address.set('Manila, Philippines');
    component.note.set('Test note');

    component.startSosCountdown();
    await vi.advanceTimersByTimeAsync(3000);

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(component.lastDispatchedAlert()?.id).toBe('SOS-999999');
  });

  it('prompts for permissions and Location Services when location is not yet granted', async () => {
    const locService = TestBed.inject(LocationService);
    vi.spyOn(locService, 'checkPermissionsSummary').mockResolvedValue({
      locationPermission: 'prompt',
      notificationsPermission: 'prompt',
      locationServicesEnabled: false,
    });
    const promptSpy = vi.spyOn(component, 'presentPermissionNoticePrompt').mockResolvedValue();

    await component.initializeLocationAndPermissions();

    expect(component.needsPermissionAttention()).toBe(true);
    expect(promptSpy).toHaveBeenCalledTimes(1);
  });
});
