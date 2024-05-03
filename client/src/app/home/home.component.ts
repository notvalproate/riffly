import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
export class HomeComponent implements OnInit, OnDestroy {
    private router: Router = inject(Router);
    private auth: AuthService = inject(AuthService);
    private userInfoService: UserInfoService = inject(UserInfoService);

    username: string = '';
    url: string = 'spotify.com';
    isPlaying: boolean = false;
    imgUrl: string = '';
    songTitle: string = '';
    artist: string = '';
    lyrics: string[] = [];
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

    ngOnDestroy() {
        if (this.trackPolling) {
          clearInterval(this.trackPolling);
        }
    }

    async getUserInfo() {
        this.userInfoService.getUserInfo().subscribe({
            next: (resp: any) => {
                this.username = resp.body.display_name;
                this.url = resp.body.external_urls.spotify;
            },
            error: (resp: any) => {
                console.log(resp.error);
            }
        });
    }

    async getCurrentTrack() {
        this.userInfoService.getTrackInfo(this.songTitle).subscribe({
            next: (resp: any) => {
                if(resp.status === 204) {
                    this.isPlaying = false;
                    return;
                }

                this.isPlaying = true;
                this.songTitle = resp.body.item.name;
                this.artist = resp.body.item.artists.map((artist: any) => artist.name).join(', ');
                this.imgUrl = resp.body.item.album.images[0].url;

                if(!resp.body.update_lyrics) {
                    return;
                }

                if(resp.body.lyrics) {
                    this.lyrics = resp.body.lyrics.split("\n");;
                } else {
                    this.lyrics = [];
                }
            },
            error: (resp: any) => {
                this.isPlaying = false;
                console.log(resp.error);
            }
        });
    }

    async onLogout() {
        this.auth.logout().subscribe((resp: any) => {
            this.router.navigate(['login']);
        });
    }
}
