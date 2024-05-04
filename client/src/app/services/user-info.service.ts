import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService extends ApiService {
    getUserInfo() {
        return this.http.get(this.apiUrl + '/getUserInfo', this.requestOptions);
    }

    getTrackInfo(currentSong : string) {
        const params = new URLSearchParams({
            current_song: currentSong,
        })

        return this.http.get(this.apiUrl + '/getTrack?' + params.toString(), this.requestOptions);
    }

    getLyrics(artists: string[], title : string) {
        const params = new URLSearchParams(artists.map(artist => ['artists', artist]));
        params.append('title', title);

        return this.http.get(this.apiUrl + '/getLyrics?' + params.toString(), this.requestOptions);
    }
}
