import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService {
    private params : URLSearchParams = new URLSearchParams(window.location.search);

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
