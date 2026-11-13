import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const ADMIN_SESSION_KEY = 'emergency_admin_session_v1';

export interface AdminUser {
  username: string;
  role: string;
  loginTime: string;
}

export const PRESET_ADMIN = {
  email: 'admin@emergency.ph',
  alias: 'admin',
  password: 'Emergency2026!',
  fallbackPassword: 'admin123',
};

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly isAuthenticatedSignal = signal<boolean>(false);
  private readonly currentUserSignal = signal<AdminUser | null>(null);
  private initialized = false;

  readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  readonly currentUser = this.currentUserSignal.asReadonly();

  async init(): Promise<void> {
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    try {
      const { value } = await Preferences.get({ key: ADMIN_SESSION_KEY });
      if (value) {
        const parsed = JSON.parse(value) as AdminUser;
        if (parsed?.username) {
          this.currentUserSignal.set(parsed);
          this.isAuthenticatedSignal.set(true);
        }
      }
    } catch {
      this.clearLocalSession();
    }
  }

  async login(userOrEmail: string, pass: string): Promise<{ success: boolean; message?: string }> {
    await this.init();

    const normalizedUser = userOrEmail.trim().toLowerCase();
    const cleanPass = pass.trim();

    const matchesUser =
      normalizedUser === PRESET_ADMIN.email.toLowerCase() ||
      normalizedUser === PRESET_ADMIN.alias.toLowerCase();

    const matchesPass =
      cleanPass === PRESET_ADMIN.password ||
      cleanPass === PRESET_ADMIN.fallbackPassword;

    if (!matchesUser || !matchesPass) {
      return {
        success: false,
        message: 'Invalid administrator credentials. Please check your username or password.',
      };
    }

    const session: AdminUser = {
      username: PRESET_ADMIN.email,
      role: 'Emergency Dispatcher & System Admin',
      loginTime: new Date().toISOString(),
    };

    this.currentUserSignal.set(session);
    this.isAuthenticatedSignal.set(true);

    try {
      await Preferences.set({
        key: ADMIN_SESSION_KEY,
        value: JSON.stringify(session),
      });
    } catch {
      // In case storage fails, memory state is still valid.
    }

    return { success: true };
  }

  async logout(): Promise<void> {
    this.clearLocalSession();
    try {
      await Preferences.remove({ key: ADMIN_SESSION_KEY });
    } catch {
      // Ignore
    }
  }

  private clearLocalSession(): void {
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
  }
}

