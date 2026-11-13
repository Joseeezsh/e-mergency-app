import type { Routes } from '@angular/router';

import { adminAuthGuard } from './guards/admin-auth.guard';

export const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin-login/admin-login.page').then((m) => m.AdminLoginPage),
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./pages/admin/admin.page').then((m) => m.AdminPage),
    canActivate: [adminAuthGuard],
  },
  {
    path: 'admin',
    redirectTo: '/admin/dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: '/tabs/sos',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/tabs/sos',
  },
];
