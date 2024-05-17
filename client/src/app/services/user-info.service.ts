import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService extends ApiService {
    getUserInfo() {
        return this.http.get(this.apiUrl + '/getUserInfo', this.requestOptions);
    }

    getTrackInfo() {
        return this.http.get(this.apiUrl + '/getTrack', this.requestOptions);
    }

    getLyrics(isrc: string) {
        const params = new URLSearchParams({
            isrc: isrc,
        });

        return this.http.get(this.apiUrl + '/getLyrics?' + params.toString(), this.requestOptions);
    }
}
