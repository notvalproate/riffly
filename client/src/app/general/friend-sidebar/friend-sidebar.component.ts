import { Component } from '@angular/core';
import { AddFriendComponent } from './add-friend/add-friend.component';
import { ProfileComponent } from './profile/profile.component';
import { FriendListComponent } from './friend-list/friend-list.component';

@Component({
  selector: 'app-friend-sidebar',
  standalone: true,
  imports: [ProfileComponent, AddFriendComponent, FriendListComponent],
  templateUrl: './friend-sidebar.component.html',
  styleUrl: './friend-sidebar.component.scss'
})
export class FriendSidebarComponent {

}
