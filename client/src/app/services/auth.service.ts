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
    private params : URLSearchParams = new URLSearchParams(window.location.search);

    hasAuthToken() {
        if(this.cookieService.get('authToken')) {
            return true;
        }

        return false;
    }

    hasError() {
        if(this.params.get('error')) {
            return true;
        }

        return false;
    }

    getOAuthURL() {
        return this.http.get(this.apiUrl + '/login');
    }

    authorizeWithParams() {
        const code : any = this.params.get('code');
        const state : any = this.params.get('state');

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
