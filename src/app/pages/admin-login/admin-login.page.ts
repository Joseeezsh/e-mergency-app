import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonNote,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  eyeOffOutline,
  eyeOutline,
  flashOutline,
  lockClosedOutline,
  personOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';

import { AdminAuthService, PRESET_ADMIN } from '../../services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  templateUrl: './admin-login.page.html',
  styleUrls: ['./admin-login.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonNote,
    IonSpinner,
    IonText,
    IonTitle,
    IonToolbar,
  ],
})
export class AdminLoginPage {
  private readonly auth = inject(AdminAuthService);
  private readonly router = inject(Router);
  private readonly toastCtrl = inject(ToastController);

  readonly username = signal<string>('');
  readonly password = signal<string>('');
  readonly showPassword = signal<boolean>(false);
  readonly loggingIn = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  readonly presetInfo = PRESET_ADMIN;

  constructor() {
    addIcons({
      arrowBackOutline,
      eyeOffOutline,
      eyeOutline,
      flashOutline,
      lockClosedOutline,
      personOutline,
      shieldCheckmarkOutline,
    });
  }

  quickFillPreset(): void {
    this.username.set(PRESET_ADMIN.email);
    this.password.set(PRESET_ADMIN.password);
    this.errorMessage.set(null);
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  async onLogin(): Promise<void> {
    const user = this.username().trim();
    const pass = this.password().trim();

    if (!user || !pass) {
      this.errorMessage.set('Please enter both username and password.');
      return;
    }

    this.loggingIn.set(true);
    this.errorMessage.set(null);

    try {
      const res = await this.auth.login(user, pass);
      if (res.success) {
        const toast = await this.toastCtrl.create({
          message: 'Welcome, Dispatcher! Logged in successfully.',
          duration: 2000,
          color: 'success',
          position: 'top',
        });
        await toast.present();
        await this.router.navigate(['/admin/dashboard'], { replaceUrl: true });
      } else {
        this.errorMessage.set(res.message ?? 'Authentication failed.');
      }
    } finally {
      this.loggingIn.set(false);
    }
  }

  backToCitizen(): void {
    void this.router.navigate(['/tabs/sos']);
  }
}

