import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.Register)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard]
  },
  {
    path: 'reclamations',
    loadComponent: () => import('./pages/reclamations/reclamation-list/reclamation-list').then(m => m.ReclamationList),
    canActivate: [authGuard]
  },
  {
    path: 'reclamations/new',
    loadComponent: () => import('./pages/reclamations/reclamation-form/reclamation-form').then(m => m.ReclamationForm),
    canActivate: [authGuard],
    data: { roles: ['client'] }
  },
  {
    path: 'chat/:reclamationId',
    loadComponent: () => import('./pages/chat/chat').then(m => m.Chat),
    canActivate: [authGuard]
  },
  {
    path: 'admin/users',
    loadComponent: () => import('./pages/admin/manage-users/manage-users').then(m => m.ManageUsers),
    canActivate: [authGuard],
    data: { roles: ['admin'] }
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
