import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
    protected http: HttpClient = inject(HttpClient);

    protected apiUrl: string = 'http://localhost:4000/api';
    protected apiAuthUrl: string = 'http://localhost:4000/auth';
    protected requestOptions : any = { observe: 'response', withCredentials: true };
}
