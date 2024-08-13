import { inject, Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiResponse } from '../interfaces/api-response';
import { LoginAttempt } from '../interfaces/auth';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = environment.api + '/auth';
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  login(username: string, password: string) {
    return this.http.post<ApiResponse<LoginAttempt>>(`${this.api}`, { username, password });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isTokenValid() {
    return this.http.get<ApiResponse<boolean>>(`${this.api}/validate`);
  }

  refreshToken() {
    this.http.get<ApiResponse<string>>(`${this.api}/refresh`).pipe(
      take(1)
    ).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.data);
      },
      error: () => {
        // Do nothing
      }
    })
  }
}
