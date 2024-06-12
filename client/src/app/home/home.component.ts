import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UserInfoService } from '../../shared/services/user-info.service';

import { FriendSidebarComponent } from '../general/friend-sidebar/friend-sidebar.component';
import { SongPlayerComponent } from './song-player/song-player.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SongPlayerComponent, FriendSidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    private router: Router = inject(Router);
    private auth: AuthService = inject(AuthService);
    private userInfoService: UserInfoService = inject(UserInfoService);

    profileName: string = '';
    profileUrl: string = '';

    trackPolling: any = undefined;

    ngOnInit(): void {
        this.getUserInfo();
    }

    async getUserInfo() {
        this.userInfoService.getUserInfo().subscribe({
            next: (resp: any) => {
                const info = resp.body;

                this.profileName = info.user.displayName;
                this.profileUrl = info.user.url;
            },
            error: (resp: any) => {
                console.log(resp.error);
            }
        });
    }

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
