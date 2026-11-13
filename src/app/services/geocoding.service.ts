import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, firstValueFrom, map, of, timeout } from 'rxjs';

interface NominatimResponse {
  display_name?: string;
}

/**
 * Resolves GPS coordinates into a human-readable street address via Angular HttpClient GET.
 */
@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private readonly http = inject(HttpClient);
  private readonly nominatimBaseUrl = 'https://nominatim.openstreetmap.org/reverse';

  async reverseGeocode(lat: number, lng: number): Promise<string> {
    const url = `${this.nominatimBaseUrl}?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`;

    return firstValueFrom(
      this.http.get<NominatimResponse>(url).pipe(
        timeout(6000),
        map((res) => res.display_name?.trim() || this.formatFallback(lat, lng)),
        catchError(() => of(this.formatFallback(lat, lng))),
      ),
    );
  }

  private formatFallback(lat: number, lng: number): string {
    return `GPS ${lat.toFixed(5)}, ${lng.toFixed(5)} (Address unavailable offline)`;
  }
}
