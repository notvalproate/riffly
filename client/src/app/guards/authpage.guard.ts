import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const authpageGuard: CanActivateFn = (route, state) => {
    const params : URLSearchParams = new URLSearchParams(window.location.search);
    const code: any = params.get('code');
    const st: any = params.get('state');

    if(code && st) {
        return true;
    }

    return inject(Router).parseUrl('/login');
};
