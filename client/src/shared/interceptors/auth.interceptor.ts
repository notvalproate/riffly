import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take, finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private authService: AuthService = inject(AuthService);

    intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(error => this.handleError(error, req, next))
        )
    }

    private handleError(error: any, req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
        if (error instanceof HttpErrorResponse) {
            if(req.url.includes('/auth/') || error.status !== 401) {
                console.log('HTTP Error: ', error);
                return throwError(() => error);
            }

            return this.handle401Error(req, next);
        }

        console.log('Internal Error: ', error);
        return throwError(() => error);
    }

    private handle401Error(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshToken().pipe(
                switchMap(() => {
                    this.refreshTokenSubject.next(true);
                    return next.handle(req);
                }),
                catchError((error) => {
                    return this.logoutAndThrow(error);
                }),
                finalize(() => {
                    this.isRefreshing = false;
                })
            );
        } else {
            return this.refreshTokenSubject.pipe(
                filter(status => status === true),
                take(1),
                switchMap(() => {
                    return next.handle(req);
                })
            );
        }
    }

    private logoutAndThrow(error: any) : Observable<never> {
        return this.authService.logout().pipe(
            switchMap(() => throwError(() => error))
        );
    }
}
