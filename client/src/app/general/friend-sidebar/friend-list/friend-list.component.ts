import { Component } from '@angular/core';
import { NamesListComponent } from './names-list/names-list.component';
import { FriendService } from '../services/friend.service';
import { List } from './list';
import { Friends, Request, Pending } from './lists';

@Component({
  selector: 'app-friend-list',
  standalone: true,
  imports: [NamesListComponent],
  templateUrl: './friend-list.component.html',
  styleUrl: './friend-list.component.scss'
})
export class FriendListComponent {
  friends_list: List[] = Friends;
  request_list: List[] = Request;
  pending_list: List[] = Pending;

  type: number = 0;

  displayFriends(): void {
    this.type = 0;
  }

  displayPending(): void {
    this.type = 1;
  }

  displayRequests(): void {
    this.type = 2;
  }
}

