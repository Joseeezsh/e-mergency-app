import type { AfterViewInit, ElementRef, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Component, Input, ViewChild } from '@angular/core';
import * as L from 'leaflet';

/**
 * Reusable Leaflet map component shared by User SOS and Admin Alert Inspector views.
 */
@Component({
  selector: 'app-emergency-map',
  standalone: true,
  template: `<div #mapHost class="map-host" [style.height]="height"></div>`,
  styles: [
    `
      .map-host {
        width: 100%;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid var(--ion-color-medium-tint, #d1d5db);
        background: #e5e7eb;
      }
    `,
  ],
})
export class EmergencyMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('mapHost', { static: true }) private mapHost!: ElementRef<HTMLDivElement>;

  @Input({ required: true }) lat!: number;
  @Input({ required: true }) lng!: number;
  @Input() accuracy = 25;
  @Input() label = 'Current Location';
  @Input() height = '240px';

  private map?: L.Map;
  private marker?: L.Marker;
  private accuracyCircle?: L.Circle;

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.map && (changes['lat'] || changes['lng'] || changes['accuracy'] || changes['label'])) {
      this.updateLocation();
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = undefined;
  }

  refreshSize(): void {
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 150);
  }

  private initMap(): void {
    const coords: L.LatLngExpression = [this.lat, this.lng];
    this.map = L.map(this.mapHost.nativeElement, {
      center: coords,
      zoom: 16,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.updateLocation();
    this.refreshSize();
  }

  private updateLocation(): void {
    if (!this.map) {
      return;
    }

    const coords: L.LatLngExpression = [this.lat, this.lng];
    const pulseIcon = L.divIcon({
      className: 'emergency-pin-wrapper',
      html: '<div class="emergency-pin-dot"></div>',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    if (this.marker) {
      this.marker.setLatLng(coords).setPopupContent(this.label);
    } else {
      this.marker = L.marker(coords, { icon: pulseIcon }).addTo(this.map).bindPopup(this.label);
    }

    const radius = Math.max(this.accuracy || 15, 10);
    if (this.accuracyCircle) {
      this.accuracyCircle.setLatLng(coords).setRadius(radius);
    } else {
      this.accuracyCircle = L.circle(coords, {
        radius,
        color: '#dc2626',
        fillColor: '#ef4444',
        fillOpacity: 0.16,
        weight: 1.5,
      }).addTo(this.map);
    }

    this.map.setView(coords, this.map.getZoom(), { animate: true });
  }
}
