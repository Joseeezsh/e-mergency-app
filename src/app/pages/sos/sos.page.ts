import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import type { OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import {
  AlertController,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonSpinner,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  callOutline,
  cameraOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  copyOutline,
  imageOutline,
  locateOutline,
  notificationsOutline,
  openOutline,
  shieldCheckmarkOutline,
  trashOutline,
  warningOutline,
} from 'ionicons/icons';

import { EmergencyMapComponent } from '../../components/emergency-map/emergency-map.component';
import { EMERGENCY_CATEGORIES } from '../../models/emergency.model';
import type {
  EmergencyAlert,
  EmergencyCategory,
  GeoLocationFix,
  LocationIssueKind,
  PermissionSummary,
} from '../../models/emergency.model';
import { EmergencyDispatchService } from '../../services/emergency-dispatch.service';
import { EmergencyStoreService } from '../../services/emergency-store.service';
import { GeocodingService } from '../../services/geocoding.service';
import { LocationService, LocationServiceError } from '../../services/location.service';
import { PhotoCaptureService } from '../../services/photo-capture.service';

@Component({
  selector: 'app-sos',
  standalone: true,
  templateUrl: './sos.page.html',
  styleUrls: ['./sos.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    EmergencyMapComponent,
    IonBadge,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonChip,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonSpinner,
    IonText,
    IonTextarea,
    IonTitle,
    IonToolbar,
  ],
})
export class SosPage implements OnDestroy {
  @ViewChild(EmergencyMapComponent) private emergencyMap?: EmergencyMapComponent;

  private readonly locationService = inject(LocationService);
  private readonly geocodingService = inject(GeocodingService);
  private readonly dispatchService = inject(EmergencyDispatchService);
  private readonly photoCapture = inject(PhotoCaptureService);
  private readonly toastCtrl = inject(ToastController);
  private readonly alertCtrl = inject(AlertController);
  readonly store = inject(EmergencyStoreService);

  readonly categories = EMERGENCY_CATEGORIES;

  readonly selectedCategory = signal<EmergencyCategory>('Medical');
  readonly note = signal<string>('');
  readonly attachedPhoto = signal<string | null>(null);
  readonly capturingPhoto = signal<boolean>(false);
  readonly loadingLocation = signal<boolean>(false);
  readonly locationError = signal<string | null>(null);
  readonly locationIssueKind = signal<LocationIssueKind | null>(null);
  readonly locationFix = signal<GeoLocationFix | null>(null);
  readonly address = signal<string>('Waiting for GPS fix...');

  readonly permissionSummary = signal<PermissionSummary>({
    locationPermission: 'prompt',
    notificationsPermission: 'prompt',
    locationServicesEnabled: true,
  });

  readonly needsPermissionAttention = computed(() => {
    const perms = this.permissionSummary();
    const missingLocation = perms.locationPermission !== 'granted' || !perms.locationServicesEnabled;
    const missingNativeNotif = Capacitor.isNativePlatform() && perms.notificationsPermission !== 'granted';
    return missingLocation || missingNativeNotif;
  });

  readonly countdownRemaining = signal<number | null>(null);
  readonly dispatching = signal<boolean>(false);
  readonly lastDispatchedAlert = signal<EmergencyAlert | null>(null);

  private countdownTimer?: ReturnType<typeof setInterval>;
  private hasShownPermissionPrompt = false;

  constructor() {
    addIcons({
      alertCircleOutline,
      callOutline,
      cameraOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      copyOutline,
      imageOutline,
      locateOutline,
      notificationsOutline,
      openOutline,
      shieldCheckmarkOutline,
      trashOutline,
      warningOutline,
    });
  }

  ionViewDidEnter(): void {
    void this.store.init();
    void this.initializeLocationAndPermissions();
  }

  ngOnDestroy(): void {
    this.stopCountdownTimer();
    this.dispatchService.stopFeedback?.();
  }

  async initializeLocationAndPermissions(): Promise<void> {
    if (typeof this.locationService.checkPermissionsSummary === 'function') {
      const summary = await this.locationService.checkPermissionsSummary();
      this.permissionSummary.set(summary);

      if (
        (summary.locationPermission !== 'granted' ||
          !summary.locationServicesEnabled ||
          (Capacitor.isNativePlatform() && summary.notificationsPermission !== 'granted')) &&
        !this.hasShownPermissionPrompt
      ) {
        this.hasShownPermissionPrompt = true;
        await this.presentPermissionNoticePrompt(summary);
        return;
      }
    }

    if (!this.locationFix() && !this.loadingLocation()) {
      await this.refreshLocation();
    } else {
      this.emergencyMap?.refreshSize();
    }
  }

  async presentPermissionNoticePrompt(summary?: PermissionSummary): Promise<void> {
    const current = summary ?? this.permissionSummary();
    const servicesOff = !current.locationServicesEnabled;
    const header = servicesOff ? 'Location Services & Permissions Required' : 'Permissions Notice';
    const message = servicesOff
      ? 'Device Location Services (GPS) appear to be turned off. E-mergency App also needs Location and Notification permissions so responders can locate you and Admin Monitor can alert you. Turn on Location Services if off, then tap Allow & Continue.'
      : 'E-mergency App needs Location Services (Precise GPS) to share your exact address during an emergency, and Notifications to trigger Admin Monitor alerts when an SOS is sent.';

    const alert = await this.alertCtrl.create({
      header,
      message,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Not Now',
          role: 'cancel',
          handler: () => {
            this.locationError.set(
              'Permission required: Tap "Grant Permissions & Locate" above to enable GPS emergency reporting.',
            );
          },
        },
        {
          text: 'Allow & Continue',
          handler: () => {
            void this.requestPermissionsAndLocate();
          },
        },
      ],
    });
    await alert.present();
  }

  async requestPermissionsAndLocate(): Promise<void> {
    if (typeof this.locationService.requestAllPermissions === 'function') {
      const summary = await this.locationService.requestAllPermissions();
      this.permissionSummary.set(summary);
    }
    await this.refreshLocation();
    if (typeof this.locationService.checkPermissionsSummary === 'function') {
      const latest = await this.locationService.checkPermissionsSummary();
      this.permissionSummary.set(latest);
    }
  }

  async refreshLocation(): Promise<void> {
    this.loadingLocation.set(true);
    this.locationError.set(null);
    this.locationIssueKind.set(null);

    try {
      const fix = await this.locationService.getCurrentLocation();
      this.locationFix.set(fix);
      this.address.set('Resolving street address...');
      const resolved = await this.geocodingService.reverseGeocode(fix.lat, fix.lng);
      this.address.set(resolved);
      if (typeof this.locationService.checkPermissionsSummary === 'function') {
        const latest = await this.locationService.checkPermissionsSummary();
        this.permissionSummary.set(latest);
      }
      this.emergencyMap?.refreshSize();
    } catch (err) {
      const kind = err instanceof LocationServiceError ? err.kind : 'unavailable';
      const msg = err instanceof Error ? err.message : 'Unable to fetch GPS location.';
      this.locationIssueKind.set(kind);
      this.locationError.set(msg);
      if (typeof this.locationService.checkPermissionsSummary === 'function') {
        const latest = await this.locationService.checkPermissionsSummary();
        this.permissionSummary.set(latest);
      }
    } finally {
      this.loadingLocation.set(false);
    }
  }

  startSosCountdown(): void {
    if (this.countdownRemaining() !== null || this.dispatching()) {
      return;
    }
    if (!this.locationFix()) {
      void this.presentToast(
        'Please grant Location permission and acquire GPS before sending an SOS alert.',
        'warning',
      );
      return;
    }

    const seconds = Math.max(1, this.store.settings().countdownSeconds);
    this.countdownRemaining.set(seconds);
    void this.dispatchService.triggerCountdownTickHaptic(seconds);

    this.countdownTimer = setInterval(() => {
      const current = this.countdownRemaining();
      if (current === null) {
        this.stopCountdownTimer();
        return;
      }
      if (current <= 1) {
        this.stopCountdownTimer();
        this.countdownRemaining.set(null);
        void this.completeDispatch();
      } else {
        const next = current - 1;
        this.countdownRemaining.set(next);
        void this.dispatchService.triggerCountdownTickHaptic(next);
      }
    }, 1000);
  }

  cancelSosCountdown(): void {
    this.stopCountdownTimer();
    this.countdownRemaining.set(null);
    this.dispatchService.triggerCancelFeedback?.();
    void this.presentToast('SOS canceled. No alert or call was sent.', 'medium');
  }

  callDirect(phoneNumber = '911'): void {
    this.dispatchService.directCall(phoneNumber);
  }

  async copySummary(alert: EmergencyAlert): Promise<void> {
    const mapLink = this.getMapUrl(alert.lat, alert.lng);
    const summary = [
      `E-MERGENCY ALERT (${alert.id})`,
      `Category: ${alert.category}`,
      `Address: ${alert.address}`,
      `GPS: ${alert.lat.toFixed(5)}, ${alert.lng.toFixed(5)} (±${alert.accuracy}m)`,
      `Map: ${mapLink}`,
      alert.note ? `Note: ${alert.note}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(summary);
      await this.presentToast('Emergency summary copied to clipboard.', 'success');
    } catch {
      await this.presentToast('Copy not supported on this device.', 'warning');
    }
  }

  async attachPhoto(source: 'camera' | 'gallery'): Promise<void> {
    if (this.capturingPhoto()) {
      return;
    }
    this.capturingPhoto.set(true);
    try {
      const dataUrl =
        source === 'camera'
          ? await this.photoCapture.takePhoto()
          : await this.photoCapture.chooseFromGallery();
      if (dataUrl) {
        this.attachedPhoto.set(dataUrl);
        await this.presentToast('Photo attached to SOS report.', 'success');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to attach photo.';
      await this.presentToast(msg, 'warning');
    } finally {
      this.capturingPhoto.set(false);
    }
  }

  removeAttachedPhoto(): void {
    this.attachedPhoto.set(null);
  }

  getMapUrl(lat: number, lng: number): string {
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;
  }

  private async completeDispatch(): Promise<void> {
    const fix = this.locationFix();
    if (!fix) {
      return;
    }

    this.dispatching.set(true);
    try {
      const alert = await this.dispatchService.dispatchEmergency({
        category: this.selectedCategory(),
        note: this.note(),
        location: fix,
        address: this.address(),
        photoDataUrl: this.attachedPhoto() ?? undefined,
      });
      this.lastDispatchedAlert.set(alert);
      this.note.set('');
      this.attachedPhoto.set(null);
      const modeMsg =
        alert.callMode === 'safe-test'
          ? 'SOS logged & Admin notified (911 blocked by Safe Test Mode).'
          : 'SOS logged, Admin notified, and 911 dialer opened.';
      await this.presentToast(modeMsg, 'success');
    } finally {
      this.dispatching.set(false);
    }
  }

  private stopCountdownTimer(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = undefined;
    }
  }

  private async presentToast(message: string, color: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2800,
      position: 'top',
      color,
    });
    await toast.present();
  }
}
