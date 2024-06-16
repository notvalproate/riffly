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
            catchError(error => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    return this.handle401Error(req, next);
                }

                console.log('Error: ', error);
                return throwError(() => error);
            })
        )
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
                    // this.authService.logout();
                    return throwError(() => new Error(error));
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
}
