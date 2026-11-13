import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { EmergencyAlert } from '../../models/emergency.model';
import { EmergencyStoreService } from '../../services/emergency-store.service';

import { AdminPage } from './admin.page';

describe('AdminPage', () => {
  let component: AdminPage;
  let fixture: ComponentFixture<AdminPage>;
  let store: EmergencyStoreService;

  const activeAlert: EmergencyAlert = {
    id: 'SOS-111111',
    category: 'Medical',
    note: 'Gate 1',
    lat: 14.5995,
    lng: 120.9842,
    accuracy: 10,
    address: 'Manila, Philippines',
    timestamp: '2026-11-11T09:00:00.000Z',
    status: 'Active',
    callMode: 'safe-test',
    dialedNumber: '911 (BLOCKED - Safe Test Mode)',
  };

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [AdminPage],
    }).compileComponents();

    store = TestBed.inject(EmergencyStoreService);
    await store.addAlert(activeAlert);

    fixture = TestBed.createComponent(AdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('filters alerts and updates status to Acknowledged and Resolved', async () => {
    expect(component.filteredAlerts().length).toBe(1);
    expect(component.selectedAlert()?.id).toBe('SOS-111111');

    await component.setStatus(activeAlert, 'Acknowledged');
    component.onFilterChange('Active');
    expect(component.filteredAlerts().length).toBe(0);

    component.onFilterChange('Acknowledged');
    expect(component.filteredAlerts().length).toBe(1);

    await component.setStatus(activeAlert, 'Resolved');
    component.onFilterChange('Resolved');
    expect(component.filteredAlerts().length).toBe(1);
  });
});
