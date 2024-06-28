import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UrlHandlingStrategy } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService extends ApiService {
    songId : Subject<string> = new Subject<string>();

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

    getRecommendations(songId: string) {
        const params = new URLSearchParams({
            songId: songId,
        });

        return this.http.get(this.apiUrl + '/recommendations?' + params.toString(), this.requestOptions);
    }


}
