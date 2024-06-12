import { Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class FriendService extends ApiService {
    getAllFriends() {
        return this.http.get(this.apiUrl + '/me/friends', this.requestOptions);
    }

    removeFriend(friendId: string) {
        const params = new URLSearchParams({
            id: friendId,
        });

        return this.http.delete(this.apiUrl + '/me/friends/list?' + params.toString(), this.requestOptions);
    }

    cancelPending(requestedId: string) {
        const params = new URLSearchParams({
            id: requestedId,
        });

        return this.http.delete(this.apiUrl + '/me/friends/pending?' + params.toString(), this.requestOptions);
    }

    sendRequest(requestedId: string) {
        const params = new URLSearchParams({
            id: requestedId,
        });

        return this.http.post(this.apiUrl + '/me/friends/request?' + params.toString(), this.requestOptions);
    }

    acceptRequest(requestedId: string) {
        const params = new URLSearchParams({
            id: requestedId,
        });

        return this.http.put(this.apiUrl + '/me/friends/request?' + params.toString(), this.requestOptions);
    }

    rejectRequest(requestedId: string) {
        const params = new URLSearchParams({
            id: requestedId,
        });

        return this.http.delete(this.apiUrl + '/me/friends/request?' + params.toString(), this.requestOptions);
    }
}
