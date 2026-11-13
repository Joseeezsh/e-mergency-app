import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { GeocodingService } from './geocoding.service';

describe('GeocodingService', () => {
  let service: GeocodingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(GeocodingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('performs an HttpClient GET to Nominatim and returns display_name', async () => {
    const promise = service.reverseGeocode(14.5995, 120.9842);

    const req = httpMock.expectOne(
      'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=14.5995&lon=120.9842',
    );
    expect(req.request.method).toBe('GET');
    req.flush({ display_name: 'Intramuros, Manila, Metro Manila, Philippines' });

    await expect(promise).resolves.toBe('Intramuros, Manila, Metro Manila, Philippines');
  });

  it('falls back gracefully when the HTTP request fails', async () => {
    const promise = service.reverseGeocode(14.5995, 120.9842);

    const req = httpMock.expectOne((r) => r.url.startsWith('https://nominatim.openstreetmap.org/reverse'));
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    await expect(promise).resolves.toBe('GPS 14.59950, 120.98420 (Address unavailable offline)');
  });
});
