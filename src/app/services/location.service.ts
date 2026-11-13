import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';

import type {
  GeoLocationFix,
  LocationIssueKind,
  PermissionStateValue,
  PermissionSummary,
} from '../models/emergency.model';

export class LocationServiceError extends Error {
  constructor(
    public readonly kind: LocationIssueKind,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'LocationServiceError';
  }
}

/**
 * Wraps Capacitor Geolocation and LocalNotifications permissions with clear Location Services diagnostics.
 */
@Injectable({ providedIn: 'root' })
export class LocationService {
  async checkPermissionsSummary(): Promise<PermissionSummary> {
    let locationPermission: PermissionStateValue = 'prompt';
    let locationServicesEnabled = true;
    let notificationsPermission: PermissionStateValue;

    if (Capacitor.isNativePlatform()) {
      try {
        const locStatus = await Geolocation.checkPermissions();
        locationPermission = this.normalizePermission(
          locStatus.location === 'granted' || locStatus.coarseLocation === 'granted'
            ? 'granted'
            : locStatus.location === 'denied' && locStatus.coarseLocation === 'denied'
              ? 'denied'
              : 'prompt',
        );
      } catch (err) {
        if (this.isLocationServicesDisabledError(err)) {
          locationServicesEnabled = false;
        }
      }

      try {
        const notifStatus = await LocalNotifications.checkPermissions();
        notificationsPermission = this.normalizePermission(notifStatus.display);
      } catch {
        notificationsPermission = 'prompt';
      }
    } else {
      locationPermission = await this.checkWebGeolocationPermission();
      notificationsPermission = this.checkWebNotificationPermission();
    }

    return {
      locationPermission,
      notificationsPermission,
      locationServicesEnabled,
    };
  }

  async requestAllPermissions(): Promise<PermissionSummary> {
    let locationServicesEnabled = true;

    if (Capacitor.isNativePlatform()) {
      try {
        await Geolocation.requestPermissions({ permissions: ['location', 'coarseLocation'] });
      } catch (err) {
        if (this.isLocationServicesDisabledError(err)) {
          locationServicesEnabled = false;
        }
      }

      try {
        await LocalNotifications.requestPermissions();
      } catch {
        // Notification request may fail or be dismissed; app still continues.
      }
    } else if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch {
        // Ignore unsupported notification permission requests in browser previews.
      }
    }

    const summary = await this.checkPermissionsSummary();
    return {
      ...summary,
      locationServicesEnabled: summary.locationServicesEnabled && locationServicesEnabled,
    };
  }

  async getCurrentLocation(): Promise<GeoLocationFix> {
    if (Capacitor.isNativePlatform()) {
      try {
        const permissions = await Geolocation.checkPermissions();
        if (permissions.location !== 'granted' && permissions.coarseLocation !== 'granted') {
          const requested = await Geolocation.requestPermissions({
            permissions: ['location', 'coarseLocation'],
          });
          if (requested.location !== 'granted' && requested.coarseLocation !== 'granted') {
            throw new LocationServiceError(
              'permission-denied',
              'Location permission denied. Please grant Location access in Android App Settings.',
            );
          }
        }
      } catch (err) {
        if (err instanceof LocationServiceError) {
          throw err;
        }
        if (this.isLocationServicesDisabledError(err)) {
          // Fall through to getCurrentPosition so Play Services can prompt to turn on Location Services.
        } else {
          throw this.mapLocationError(err);
        }
      }
    }

    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 5000,
      });

      return {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: Math.round(position.coords.accuracy ?? 0),
        timestamp: new Date(position.timestamp).toISOString(),
      };
    } catch (err) {
      throw this.mapLocationError(err);
    }
  }

  private mapLocationError(err: unknown): LocationServiceError {
    if (err instanceof LocationServiceError) {
      return err;
    }
    const rawMsg = err instanceof Error ? err.message : String(err ?? '');
    if (this.isLocationServicesDisabledError(err)) {
      return new LocationServiceError(
        'services-disabled',
        'Device Location Services (GPS) are turned off. Please enable Location in your phone settings and tap Retry.',
        { cause: err },
      );
    }
    if (
      /denied|permission/i.test(rawMsg) ||
      this.hasErrorCode(err, 'OS-PLUG-GLOC-0003') ||
      this.hasErrorCode(err, 'OS-PLUG-GLOC-0009')
    ) {
      return new LocationServiceError(
        'permission-denied',
        'Location permission is required to acquire your emergency coordinates. Please allow Location access.',
        { cause: err },
      );
    }
    const message = rawMsg || 'Unable to determine GPS location.';
    return new LocationServiceError('unavailable', `GPS acquisition failed: ${message}`, {
      cause: err,
    });
  }

  private isLocationServicesDisabledError(err: unknown): boolean {
    const rawMsg = err instanceof Error ? err.message : String(err ?? '');
    return (
      this.hasErrorCode(err, 'OS-PLUG-GLOC-0007') ||
      this.hasErrorCode(err, 'OS-PLUG-GLOC-0017') ||
      /location services are not enabled|location is disabled|turned off/i.test(rawMsg)
    );
  }

  private hasErrorCode(err: unknown, code: string): boolean {
    return typeof err === 'object' && err !== null && 'code' in err && err.code === code;
  }

  private normalizePermission(state: string | undefined): PermissionStateValue {
    if (state === 'granted') {
      return 'granted';
    }
    if (state === 'denied') {
      return 'denied';
    }
    return 'prompt';
  }

  private async checkWebGeolocationPermission(): Promise<PermissionStateValue> {
    if (typeof navigator === 'undefined' || !navigator.permissions?.query) {
      return 'prompt';
    }
    try {
      const status = await navigator.permissions.query({ name: 'geolocation' });
      return this.normalizePermission(status.state);
    } catch {
      return 'prompt';
    }
  }

  private checkWebNotificationPermission(): PermissionStateValue {
    if (typeof Notification === 'undefined') {
      return 'granted';
    }
    return this.normalizePermission(Notification.permission);
  }
}
