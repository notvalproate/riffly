import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';

import { FriendService } from '../services/friend.service';

@Component({
  selector: 'app-add-friend',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule],
  templateUrl: './add-friend.component.html',
  styleUrl: './add-friend.component.scss'
})
export class AddFriendComponent {
    friends : FriendService = inject(FriendService);
    inputId : string = "";

    successOccured : boolean = false;
    errorOccured : boolean = false;
    sendingRequest: boolean = false;
    errorMessage : string = '';

    fauserPlus = faUserPlus;

    clearError() : void {
        this.errorOccured = false;
        this.successOccured = false;
    }

    sendFriendRequest() : void {
        if(this.errorOccured || this.successOccured || this.sendingRequest) {
            return;
        }

        this.sendingRequest = true;

        this.friends.sendRequest(this.inputId).subscribe({
            next: (resp: any) => {
                this.sendingRequest = false;

                console.log(resp);
                this.successOccured = true;
            },
            error: (resp: any) => {
                this.sendingRequest = false;

                this.errorOccured = true;
                this.errorMessage = resp.error.message;
            },
        });
    }
}
