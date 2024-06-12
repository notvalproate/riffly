import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService extends ApiService {
    getUserInfo() {
        return this.http.get(this.apiUrl + '/me/info', this.requestOptions);
    }

    getPlayerInfo() {
        return this.http.get(this.apiUrl + '/me/player', this.requestOptions);
    }

    getLyrics(isrc: string) {
        const params = new URLSearchParams({
            isrc: isrc,
        });

        return this.http.get(this.apiUrl + '/track/lyrics?' + params.toString(), this.requestOptions);
    }
}
