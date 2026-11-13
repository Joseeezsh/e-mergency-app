import { Injectable, inject } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';

import type { CallMode, EmergencyAlert, EmergencyCategory, GeoLocationFix } from '../models/emergency.model';

import { EmergencyStoreService } from './emergency-store.service';
import { SoundFeedbackService } from './sound-feedback.service';

export interface DispatchRequest {
  category: EmergencyCategory;
  note: string;
  location: GeoLocationFix;
  address: string;
  photoDataUrl?: string;
}

/**
 * Coordinates Haptics & audio feedback, local alert persistence, Admin notification, and Safe-guarded 911 dial.
 */
@Injectable({ providedIn: 'root' })
export class EmergencyDispatchService {
  private readonly store = inject(EmergencyStoreService);
  private readonly soundFeedback = inject(SoundFeedbackService);

  async triggerCountdownTickHaptic(secondsRemaining = 5): Promise<void> {
    if (this.store.settings().soundEnabled) {
      this.soundFeedback.playCountdownTick(secondsRemaining);
    }

    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      // Haptics unavailable on desktop browsers; ignore cleanly.
    }
  }

  triggerCancelFeedback(): void {
    this.soundFeedback.stopAll();
    if (this.store.settings().soundEnabled) {
      this.soundFeedback.playCancelTone();
    }
  }

  stopFeedback(): void {
    this.soundFeedback.stopAll();
  }

  async dispatchEmergency(request: DispatchRequest): Promise<EmergencyAlert> {
    await this.store.init();
    const { safeTestMode, soundEnabled } = this.store.settings();
    const callMode: CallMode = safeTestMode ? 'safe-test' : 'live-911';
    const dialedNumber = safeTestMode ? '911 (BLOCKED - Safe Test Mode)' : '911';

    const alert: EmergencyAlert = {
      id: `SOS-${Date.now().toString().slice(-6)}`,
      category: request.category,
      note: request.note.trim(),
      lat: request.location.lat,
      lng: request.location.lng,
      accuracy: request.location.accuracy,
      address: request.address,
      timestamp: new Date().toISOString(),
      status: 'Active',
      callMode,
      dialedNumber,
      photoDataUrl: request.photoDataUrl,
    };

    if (soundEnabled) {
      this.soundFeedback.playDispatchAlert();
    }

    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch {
      // Ignore on web environments without Haptics.
    }

    await this.store.addAlert(alert);
    await this.notifyAdmin(alert);

    if (!safeTestMode && this.store.settings().autoDialOnDispatch) {
      this.openDialer(this.store.settings().primaryEmergencyNumber || '911');
    }

    return alert;
  }

  /**
   * Directly opens the native phone dialer with 911 or a specified emergency contact.
   */
  directCall(phoneNumber = '911'): void {
    this.openDialer(phoneNumber);
  }

  /** Opens the device dialer pre-filled with the emergency number without auto-dialing. */
  protected openDialer(phoneNumber: string): void {
    window.location.href = `tel:${phoneNumber}`;
  }

  private async notifyAdmin(alert: EmergencyAlert): Promise<void> {
    try {
      if (Capacitor.isNativePlatform()) {
        const permission = await LocalNotifications.checkPermissions();
        if (permission.display !== 'granted') {
          const requested = await LocalNotifications.requestPermissions();
          if (requested.display !== 'granted') {
            return;
          }
        }
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            id: Math.floor(Date.now() % 100000),
            title: `SOS Alert (${alert.category}) — ${alert.id}`,
            body: `${alert.address} | GPS: ${alert.lat.toFixed(5)}, ${alert.lng.toFixed(5)}`,
            schedule: { at: new Date(Date.now() + 250) },
          },
        ],
      });
    } catch {
      // Local notifications may be blocked in web preview; alert still persists in Admin Monitor.
    }
  }
}
