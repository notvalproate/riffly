import { Component } from '@angular/core';

@Component({
  selector: 'app-friend-list',
  standalone: true,
  imports: [],
  templateUrl: './friend-list.component.html',
  styleUrl: './friend-list.component.scss'
})
export class FriendListComponent {
  private updateBackgroundColor(color: string): void {
    const friendsElement = document.getElementById('friends');
    if (friendsElement) {
      friendsElement.style.backgroundColor = color;
    }
  }

  displayFriends(): void {
    this.updateBackgroundColor('black');
  }

  displayPending(): void {
    this.updateBackgroundColor('blue');
  }

  displayRequests(): void {
    this.updateBackgroundColor('green');
  }
}

