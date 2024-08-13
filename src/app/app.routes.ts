import { Routes } from '@angular/router';
import { authGuardGuard } from './guards/auth-guard.guard';
import { LoginComponent } from './components/login/login.component';
import { ChartsComponent } from './components/charts/charts.component';

export const routes: Routes = [
  { path: 'charts', component: ChartsComponent, canActivate: [authGuardGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'charts' }, //
];
