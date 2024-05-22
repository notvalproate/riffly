import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
    protected http: HttpClient = inject(HttpClient);

    protected apiUrl: string = environment.apiUrl;
    protected requestOptions : any = { observe: 'response', withCredentials: true };
}
