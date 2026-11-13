import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToggle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  callOutline,
  chevronForwardOutline,
  locateOutline,
  lockClosedOutline,
  shieldCheckmarkOutline,
  trashOutline,
} from 'ionicons/icons';

import type { PermissionSummary } from '../../models/emergency.model';
import { EmergencyDispatchService } from '../../services/emergency-dispatch.service';
import { EmergencyStoreService } from '../../services/emergency-store.service';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToggle,
    IonToolbar,
  ],
})
export class SettingsPage {
  readonly store = inject(EmergencyStoreService);
  private readonly locationService = inject(LocationService);
  private readonly dispatchService = inject(EmergencyDispatchService);
  private readonly toastCtrl = inject(ToastController);
  private readonly router = inject(Router);

  readonly permissionSummary = signal<PermissionSummary>({
    locationPermission: 'prompt',
    notificationsPermission: 'prompt',
    locationServicesEnabled: true,
  });

  readonly hotlines = [
    { name: 'National Emergency Hotline', number: '911', desc: 'Police, Fire, Medical, Rescue' },
    { name: 'Philippine Red Cross', number: '143', desc: 'Ambulance, Blood, Disaster Relief' },
    { name: 'PNP Hotline (Patrol 117)', number: '117', desc: 'Police Emergency Response' },
    { name: 'Bureau of Fire Protection', number: '0284260219', display: '(02) 8426-0219', desc: 'Metro Manila Fire Dispatch' },
  ];

  readonly groupMembers = [
    'Gregorio, Maricar F.',
    'Marcelo, Ana Leah D.',
    'Olinares III, Jose A.',
    'Villamia, Beatriz D.',
  ];

  constructor() {
    addIcons({
      callOutline,
      chevronForwardOutline,
      locateOutline,
      lockClosedOutline,
      shieldCheckmarkOutline,
      trashOutline,
    });
  }

  ionViewDidEnter(): void {
    void this.store.init();
    void this.refreshPermissions();
  }

  async refreshPermissions(): Promise<void> {
    if (typeof this.locationService.checkPermissionsSummary === 'function') {
      this.permissionSummary.set(await this.locationService.checkPermissionsSummary());
    }
  }

  async requestPermissions(): Promise<void> {
    if (typeof this.locationService.requestAllPermissions === 'function') {
      const summary = await this.locationService.requestAllPermissions();
      this.permissionSummary.set(summary);
      const toast = await this.toastCtrl.create({
        message: summary.locationServicesEnabled
          ? `Location: ${summary.locationPermission} | Notifications: ${summary.notificationsPermission}`
          : 'Please enable Device Location Services (GPS) in your phone settings.',
        duration: 2600,
        position: 'top',
      });
      await toast.present();
    }
  }

  async toggleSafeTestMode(enabled: boolean): Promise<void> {
    await this.store.updateSettings({ safeTestMode: enabled });
  }

  async toggleSoundEnabled(enabled: boolean): Promise<void> {
    await this.store.updateSettings({ soundEnabled: enabled });
  }

  async toggleAutoDial(enabled: boolean): Promise<void> {
    await this.store.updateSettings({ autoDialOnDispatch: enabled });
  }

  async changeCountdown(seconds: number): Promise<void> {
    await this.store.updateSettings({ countdownSeconds: seconds });
  }

  callHotline(number: string): void {
    this.dispatchService.directCall(number);
  }

  openAdminPortal(): void {
    void this.router.navigate(['/admin/dashboard']);
  }

  async clearAlerts(): Promise<void> {
    await this.store.clearAllAlerts();
    const toast = await this.toastCtrl.create({
      message: 'Local emergency alert history cleared.',
      duration: 2200,
      position: 'top',
    });
    await toast.present();
  }
}
