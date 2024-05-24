import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
    const path: string = route.url[0]?.path;
    const auth: AuthService = inject(AuthService);
    const router: Router = inject(Router);

    return auth.hasAuthToken().pipe(
        map((resp) => {
            if(path === undefined || path === 'login') {
                return router.parseUrl('/home');
            }

            return true;
        }),
        catchError((err) => {
            console.log(err);

            if(path === undefined || path === 'login') {
                return of(true);
            }

            return of(router.parseUrl('/login'));
        }),
    );
};
