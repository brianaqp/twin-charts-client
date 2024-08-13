import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authSvc = inject(AuthService);
  const router = inject(Router);

  const token = authSvc.getToken();

  // If no token is found, redirect to login
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // If no internet connection, redirect to login
  if (!navigator.onLine) {
    router.navigate(['/login'], { state: { isOffline: true } });
    return false;
  }

  // If a token is found, validate it with the server, and redirect to login if it's invalid
  // Error is caught in the interceptor
  return authSvc.isTokenValid().pipe(
    map(() => {
      return true;
    }),
  );
};
