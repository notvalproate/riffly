import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

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
    private auth: AuthService = inject(AuthService);

    profileName: string = '';
    profileUrl: string = '';

    trackPolling: any = undefined;

    async onLogout() {
        this.auth.logout().subscribe({
            next: (resp: any) => {
                this.router.navigate(['login']);
            },
            error: (resp: any) => {
                console.log(resp.error);
            }
        });
    }

    goToCharts() {
        this.router.navigate(['charts']);
    }
}
