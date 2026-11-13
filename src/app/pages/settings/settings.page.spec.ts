import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { EmergencyStoreService } from '../../services/emergency-store.service';

import { SettingsPage } from './settings.page';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let store: EmergencyStoreService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [SettingsPage],
    }).compileComponents();

    store = TestBed.inject(EmergencyStoreService);
    await store.init();

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('updates Safe Test Mode, countdown duration, and clears alerts', async () => {
    expect(component.groupMembers.length).toBe(4);
    expect(store.settings().safeTestMode).toBe(true);

    await component.toggleSafeTestMode(false);
    await component.changeCountdown(10);

    expect(store.settings().safeTestMode).toBe(false);
    expect(store.settings().countdownSeconds).toBe(10);

    await store.addAlert({
      id: 'SOS-222222',
      category: 'General',
      note: '',
      lat: 14.6,
      lng: 120.98,
      accuracy: 20,
      address: 'Manila',
      timestamp: '2026-11-11T09:00:00.000Z',
      status: 'Active',
      callMode: 'safe-test',
      dialedNumber: '911 (BLOCKED - Safe Test Mode)',
    });
    expect(store.alerts().length).toBe(1);

    await component.clearAlerts();
    expect(store.alerts().length).toBe(0);
  });
});
