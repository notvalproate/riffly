import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserInfoService } from '../services/user-info.service';

@Component({
  selector: 'home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    private router: Router = inject(Router);
    private auth: AuthService = inject(AuthService);
    private userInfoService: UserInfoService = inject(UserInfoService);

    username: string = '';
    url: string = 'spotify.com';
    isPlaying: boolean = false;
    imgUrl: string = '';
    songTitle: string = '';
    artist: string = '';
    trackPolling: any = undefined;

    ngOnInit(): void {
        this.auth.hasAuthToken().subscribe((resp: any) => {
            if(!resp.body.hasToken) {
                this.router.navigate(['login']);
                return;
            }

            this.getUserInfo();

            this.trackPolling = setInterval(() => {
                this.getCurrentTrack();
            }, 2000);
        })
    }

    async getUserInfo() {
        this.userInfoService.getUserInfo().subscribe((resp: any) => {
            if(resp.status === 401) {
                console.log('Error: Bad Authentication');
                return;
            }

            this.username = resp.body.display_name;
            this.url = resp.body.external_urls.spotify;
        });
    }

    async getCurrentTrack() {
        this.userInfoService.getTrackInfo().subscribe((resp: any) => {
            if(resp.status === 204) {
                this.isPlaying = false;
                return;
            }

            this.isPlaying = true;
            this.songTitle = resp.body.item.name;
            this.artist = resp.body.item.artists.map((artist: any) => artist.name).join(', ');
            this.imgUrl = resp.body.item.album.images[0].url;
        });
    }

    async onLogout() {
        this.auth.logout().subscribe((resp: any) => {
            this.router.navigate(['login']);
        });
    }
}
