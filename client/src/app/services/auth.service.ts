import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService {
    hasAuthToken() {
        return this.http.get(this.apiAuthUrl + '/hasAuthToken', this.requestOptions);
    }

    hasError() {
        const params : URLSearchParams = new URLSearchParams(window.location.search);

        if(params.get('error')) {
            return true;
        }

        return false;
    }

    getOAuthURL() {
        return this.http.get(this.apiAuthUrl + '/login');
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

            return this.http.get(this.apiAuthUrl + '/getAuthInfo?' + authParams.toString(), this.requestOptions);
        }

        return undefined;
    }

    logout() {
        return this.http.get(this.apiAuthUrl + '/logout', this.requestOptions);
    }
}
