import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
    const path: string = state.url;
    const auth: AuthService = inject(AuthService);
    const router: Router = inject(Router);
    let allow: boolean = true;

    auth.hasAuthToken().subscribe((resp: any) => {
        return resp.body.hasToken;
    });

    return allow;
};
