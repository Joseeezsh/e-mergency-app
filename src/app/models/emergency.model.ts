export type EmergencyCategory = 'Medical' | 'Fire' | 'Accident' | 'Security' | 'General';

export type AlertStatus = 'Active' | 'Acknowledged' | 'Resolved';

export type CallMode = 'safe-test' | 'live-911';

export interface GeoLocationFix {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: string;
}

export interface EmergencyAlert {
  id: string;
  category: EmergencyCategory;
  note: string;
  lat: number;
  lng: number;
  accuracy: number;
  address: string;
  timestamp: string;
  status: AlertStatus;
  callMode: CallMode;
  dialedNumber: string;
  photoDataUrl?: string;
  resolvedAt?: string;
}

export interface AppSettings {
  safeTestMode: boolean;
  countdownSeconds: number;
  soundEnabled: boolean;
  autoDialOnDispatch: boolean;
  primaryEmergencyNumber: string;
}

export type PermissionStateValue = 'granted' | 'prompt' | 'denied';

export type LocationIssueKind = 'services-disabled' | 'permission-denied' | 'unavailable';

export interface PermissionSummary {
  locationPermission: PermissionStateValue;
  notificationsPermission: PermissionStateValue;
  locationServicesEnabled: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  safeTestMode: true,
  countdownSeconds: 5,
  soundEnabled: true,
  autoDialOnDispatch: true,
  primaryEmergencyNumber: '911',
};

export const EMERGENCY_CATEGORIES: EmergencyCategory[] = ['Medical', 'Fire', 'Accident', 'Security', 'General'];
