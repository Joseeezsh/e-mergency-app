import { CommonModule } from '@angular/common';
import { Component, ViewChild, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  imageOutline,
  logOutOutline,
  mapOutline,
  notificationsOutline,
  timeOutline,
} from 'ionicons/icons';

import { EmergencyMapComponent } from '../../components/emergency-map/emergency-map.component';
import type { AlertStatus, EmergencyAlert } from '../../models/emergency.model';
import { AdminAuthService } from '../../services/admin-auth.service';
import { EmergencyStoreService } from '../../services/emergency-store.service';

type StatusFilter = 'All' | AlertStatus;

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  imports: [
    CommonModule,
    EmergencyMapComponent,
    IonBadge,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonText,
    IonTitle,
    IonToolbar,
  ],
})
export class AdminPage {
  @ViewChild(EmergencyMapComponent) private inspectorMap?: EmergencyMapComponent;

  readonly store = inject(EmergencyStoreService);
  readonly auth = inject(AdminAuthService);
  private readonly router = inject(Router);

  readonly statusFilter = signal<StatusFilter>('All');
  readonly selectedAlertId = signal<string | null>(null);

  readonly filteredAlerts = computed(() => {
    const filter = this.statusFilter();
    const all = this.store.alerts();
    return filter === 'All' ? all : all.filter((item) => item.status === filter);
  });

  readonly selectedAlert = computed(() => {
    const id = this.selectedAlertId();
    const list = this.filteredAlerts();
    if (!list.length) {
      return null;
    }
    return list.find((item) => item.id === id) ?? list[0];
  });

  constructor() {
    addIcons({
      checkmarkCircleOutline,
      imageOutline,
      logOutOutline,
      mapOutline,
      notificationsOutline,
      timeOutline,
    });
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigate(['/tabs/sos'], { replaceUrl: true });
  }

  ionViewDidEnter(): void {
    void this.store.init();
    this.inspectorMap?.refreshSize();
  }

  onFilterChange(value: string | number | undefined): void {
    if (value === 'All' || value === 'Active' || value === 'Acknowledged' || value === 'Resolved') {
      this.statusFilter.set(value);
      this.inspectorMap?.refreshSize();
    }
  }

  selectAlert(alert: EmergencyAlert): void {
    this.selectedAlertId.set(alert.id);
    this.inspectorMap?.refreshSize();
  }

  async setStatus(alert: EmergencyAlert, status: AlertStatus): Promise<void> {
    await this.store.updateAlertStatus(alert.id, status);
  }

  badgeColor(status: AlertStatus): string {
    switch (status) {
      case 'Active':
        return 'danger';
      case 'Acknowledged':
        return 'warning';
      case 'Resolved':
        return 'success';
    }
  }
}
