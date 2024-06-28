import { Component} from '@angular/core';

import { FriendSidebarComponent } from '../../general/friend-sidebar/friend-sidebar.component';
import { SongPlayerComponent } from './song-player/song-player.component';
import { RecommendComponent } from './recommend/recommend.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SongPlayerComponent, FriendSidebarComponent, RecommendComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
    profileName: string = '';
    profileUrl: string = '';

    trackPolling: any = undefined;
}
