import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../shared/interceptors/auth.interceptor';
import { headerInterceptor } from '../shared/interceptors/header.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([headerInterceptor]), withInterceptorsFromDi()),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ]
};
