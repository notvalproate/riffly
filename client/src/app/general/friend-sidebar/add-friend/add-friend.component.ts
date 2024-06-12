import { Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-friend',
  standalone: true,
  imports: [FontAwesomeModule, FormsModule],
  templateUrl: './add-friend.component.html',
  styleUrl: './add-friend.component.scss'
})
export class AddFriendComponent {
    inputId : string = "";

    errorOccured : boolean = true;
    errorMessage : string = "User already exists in your friend list!";

    fauserPlus = faUserPlus;

    clearError() : void {
        this.errorOccured = false;
    }

    sendFriendRequest() : void {
        this.errorOccured = true;
    }
}
