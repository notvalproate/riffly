import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private http: HttpClient = inject(HttpClient);
    private cookieService: CookieService = inject(CookieService);

    private apiUrl: string = 'http://localhost:4000';

    hasAuthToken() {
        if(this.cookieService.get('authToken')) {
            return true;
        }

        return false;
    }

    hasError() {
        const params : URLSearchParams = new URLSearchParams(window.location.search);

        if(params.get('error')) {
            return true;
        }

        return false;
    }

    getOAuthURL() {
        return this.http.get(this.apiUrl + '/login');
    }

    authorizeWithParams() {
        const params : URLSearchParams = new URLSearchParams(window.location.search);

        const code : any = params.get('code');
        const state : any = params.get('state');

        if(code && state) {
            const authParams : URLSearchParams = new URLSearchParams({
                code: code,
                state: state
            });

           return this.http.get(this.apiUrl + '/getAuthInfo?' + authParams.toString());
        }

        return undefined;
    }
}
