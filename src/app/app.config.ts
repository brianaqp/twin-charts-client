import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { TokenInterceptorComponent } from './components/token-interceptor/token-interceptor.component';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(
    withInterceptorsFromDi(),
  ), {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorComponent,
    multi: true,
  }],
};
