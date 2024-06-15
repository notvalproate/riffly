import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { FriendSidebarComponent } from '../../general/friend-sidebar/friend-sidebar.component';
import { SongPlayerComponent } from './song-player/song-player.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SongPlayerComponent, FriendSidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
    private router: Router = inject(Router);

    profileName: string = '';
    profileUrl: string = '';

    trackPolling: any = undefined;

    goToCharts() {
        this.router.navigate(['charts']);
    }
}
