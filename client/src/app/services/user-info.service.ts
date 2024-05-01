import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
    private http: HttpClient = inject(HttpClient);

    private apiUrl: string = 'http://localhost:4000';
    private requestOptions : any = { observe: 'response', withCredentials: true };

    getUserInfo() {
        return this.http.get(this.apiUrl + '/getUserInfo', this.requestOptions);
    }
}
