import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
    const path: string = route.url[0]?.path;
    const auth: AuthService = inject(AuthService);
    const router: Router = inject(Router);

    return auth.hasAuthToken().pipe(
        map((resp: any) => {
            let allow = true;
            let url = '/login';

            if(!resp.body.hasToken) {
                allow = false;
            }

            if(path === undefined || path === 'login') {
                allow = !allow;
                url = '/home';
            }

            if(allow) {
                return true;
            }

            return router.parseUrl(url);
        })
    );
};
