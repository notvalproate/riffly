import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserChartsService extends ApiService {
    getCharts() {
        return this.http.get(this.apiUrl + '/getUserCharts', this.requestOptions);
    }
}
