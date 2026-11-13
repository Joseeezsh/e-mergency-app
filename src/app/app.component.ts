import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';

import { EmergencyStoreService } from './services/emergency-store.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private readonly store = inject(EmergencyStoreService);

  ngOnInit(): void {
    void this.store.init();
  }
}
