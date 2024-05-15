import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
    const path: string = state.url;
    const auth: AuthService = inject(AuthService);
    const router: Router = inject(Router);
    let allow: boolean = true;

    return allow;
};
