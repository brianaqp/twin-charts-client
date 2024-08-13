import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-token-interceptor',
  standalone: true,
  imports: [],
  templateUrl: './token-interceptor.component.html',
  styleUrl: './token-interceptor.component.scss',
})
export class TokenInterceptorComponent implements HttpInterceptor {
  
  constructor(private router: Router, private authSvc: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    
    const token = this.authSvc.getToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          'x-auth-token': token,
        },
      });
    }
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // If there is an Auth 401 error, redirect to login
        if (error.status === 401) {
          this.router.navigate(['/login'],  { state: { isTokenInvalid: true } } );
        }
        return throwError(() => error);
      })
    )
  }
}
