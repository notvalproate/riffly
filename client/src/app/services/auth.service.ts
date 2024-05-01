import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private http: HttpClient = inject(HttpClient);

    private apiUrl: string = 'http://localhost:4000';
    private params : URLSearchParams = new URLSearchParams(window.location.search);
    private requestOptions : any = { observe: 'response', withCredentials: true };

    hasAuthToken() {
        return this.http.get(this.apiUrl + '/hasAuthToken', this.requestOptions);
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

           return this.http.get(this.apiUrl + '/getAuthInfo?' + authParams.toString(), this.requestOptions);
        }

        return undefined;
    }
}
