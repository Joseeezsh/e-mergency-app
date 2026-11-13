import { TestBed } from '@angular/core/testing';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';

import type { LocationServiceError } from './location.service';
import { LocationService } from './location.service';

vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: vi.fn().mockReturnValue(true),
  },
}));

vi.mock('@capacitor/geolocation', () => ({
  Geolocation: {
    checkPermissions: vi.fn(),
    requestPermissions: vi.fn(),
    getCurrentPosition: vi.fn(),
  },
}));

vi.mock('@capacitor/local-notifications', () => ({
  LocalNotifications: {
    checkPermissions: vi.fn(),
    requestPermissions: vi.fn(),
  },
}));

describe('LocationService', () => {
  let service: LocationService;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationService);
  });

  it('reports locationServicesEnabled=false when native checkPermissions throws OS-PLUG-GLOC-0007', async () => {
    vi.mocked(Geolocation.checkPermissions).mockRejectedValue({
      code: 'OS-PLUG-GLOC-0007',
      message: 'Location services are not enabled.',
    });
    vi.mocked(LocalNotifications.checkPermissions).mockResolvedValue({ display: 'prompt' });

    const summary = await service.checkPermissionsSummary();

    expect(summary.locationServicesEnabled).toBe(false);
    expect(summary.locationPermission).toBe('prompt');
    expect(summary.notificationsPermission).toBe('prompt');
  });

  it('requests both location and notification permissions', async () => {
    vi.mocked(Geolocation.requestPermissions).mockResolvedValue({
      location: 'granted',
      coarseLocation: 'granted',
    });
    vi.mocked(LocalNotifications.requestPermissions).mockResolvedValue({ display: 'granted' });
    vi.mocked(Geolocation.checkPermissions).mockResolvedValue({
      location: 'granted',
      coarseLocation: 'granted',
    });
    vi.mocked(LocalNotifications.checkPermissions).mockResolvedValue({ display: 'granted' });

    const summary = await service.requestAllPermissions();

    expect(Geolocation.requestPermissions).toHaveBeenCalledWith({
      permissions: ['location', 'coarseLocation'],
    });
    expect(LocalNotifications.requestPermissions).toHaveBeenCalledTimes(1);
    expect(summary).toEqual({
      locationPermission: 'granted',
      notificationsPermission: 'granted',
      locationServicesEnabled: true,
    });
  });

  it('falls through to getCurrentPosition and maps disabled location services clearly', async () => {
    vi.mocked(Geolocation.checkPermissions).mockRejectedValue({
      code: 'OS-PLUG-GLOC-0007',
      message: 'Location services are not enabled.',
    });
    vi.mocked(Geolocation.getCurrentPosition).mockRejectedValue({
      code: 'OS-PLUG-GLOC-0007',
      message: 'Location services are not enabled.',
    });

    await expect(service.getCurrentLocation()).rejects.toMatchObject({
      name: 'LocationServiceError',
      kind: 'services-disabled',
    } satisfies Partial<LocationServiceError>);
  });

  it('returns coordinates when permissions and GPS succeed', async () => {
    vi.mocked(Geolocation.checkPermissions).mockResolvedValue({
      location: 'granted',
      coarseLocation: 'granted',
    });
    vi.mocked(Geolocation.getCurrentPosition).mockResolvedValue({
      timestamp: 1700000000000,
      coords: {
        latitude: 14.5995,
        longitude: 120.9842,
        accuracy: 11.4,
        altitude: null,
        altitudeAccuracy: null,
        speed: null,
        heading: null,
        magneticHeading: null,
        trueHeading: null,
        headingAccuracy: null,
        course: null,
      },
    });

    const fix = await service.getCurrentLocation();

    expect(fix.lat).toBe(14.5995);
    expect(fix.lng).toBe(120.9842);
    expect(fix.accuracy).toBe(11);
  });
});
