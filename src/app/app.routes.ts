import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { ShellComponent } from './core/layout/shell.component';

export const APP_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'impounds',
        loadComponent: () =>
          import('./features/impounds/impounds.component').then(m => m.ImpoundsComponent),
      },
      {
        path: 'ant',
        loadComponent: () =>
          import('./features/ant/ant.component').then(m => m.AntComponent),
      },
      {
        path: 'reinstatement',
        loadComponent: () =>
          import('./features/reinstatement/reinstatement.component').then(m => m.ReinstatementComponent),
      },
      {
        path: 'svc-support',
        loadComponent: () =>
          import('./features/svc-support/svc-support.component').then(m => m.SvcSupportComponent),
      },
      {
        path: 'insurance',
        loadComponent: () =>
          import('./features/insurance/insurance.component').then(m => m.InsuranceComponent),
      },
      {
        path: 'settlements',
        loadComponent: () =>
          import('./features/settlements/settlements.component').then(m => m.SettlementsComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
