import { Component } from '@angular/core';
import { AddFriendComponent } from './add-friend/add-friend.component';
import { ProfileComponent } from './profile/profile.component';

@Component({
  selector: 'app-friend-sidebar',
  standalone: true,
  imports: [ProfileComponent, AddFriendComponent],
  templateUrl: './friend-sidebar.component.html',
  styleUrl: './friend-sidebar.component.scss'
})
export class FriendSidebarComponent {

}
