import { Component } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';

@Component({
  selector: 'app-friend-sidebar',
  standalone: true,
  imports: [ProfileComponent],
  templateUrl: './friend-sidebar.component.html',
  styleUrl: './friend-sidebar.component.scss'
})
export class FriendSidebarComponent {

}
