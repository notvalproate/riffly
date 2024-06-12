import { Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserChartsService extends ApiService {
    getCharts() {
        const params = new URLSearchParams({
            term: 'MEDIUM',
        });

        return this.http.get(this.apiUrl + '/me/top/tracks?' + params.toString(), this.requestOptions);
    }
}
