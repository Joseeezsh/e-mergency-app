import type { Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'sos',
        loadComponent: () => import('../pages/sos/sos.page').then((m) => m.SosPage),
      },
      {
        path: 'settings',
        loadComponent: () => import('../pages/settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: 'admin',
        redirectTo: '/admin/dashboard',
        pathMatch: 'full',
      },
      {
        path: '',
        redirectTo: 'sos',
        pathMatch: 'full',
      },
    ],
  },
];
