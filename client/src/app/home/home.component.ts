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

    profileName: string = '';
    profileUrl: string = '';

    isPlayerActive: boolean = false;

    currentSongImgUrl: string = '';
    currentSongTitle: string = '';
    currentArtist: string = '';
    currentLyrics: string[] = [];

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
                this.profileName = resp.body.display_name;
                this.profileUrl = resp.body.external_urls.spotify;
            },
            error: (resp: any) => {
                console.log(resp.error);
            }
        });
    }

    async getCurrentTrack() {
        this.userInfoService.getTrackInfo(this.currentSongTitle).subscribe({
            next: (resp: any) => {
                if(resp.status === 204) {
                    this.isPlayerActive = false;
                    return;
                }

                let currentTitle = this.currentSongTitle;

                this.isPlayerActive = true;
                this.currentSongTitle = resp.body.item.name;
                this.currentArtist = resp.body.item.artists.map((artist: any) => artist.name).join(', ');
                this.currentSongImgUrl = resp.body.item.album.images[0].url;

                if(currentTitle !== resp.body.item.name) {
                    this.currentLyrics = ['Loading Lyrics...'];
                    this.userInfoService.getLyrics(resp.body.item.artists.map((artist: any) => artist.name), resp.body.item.name).subscribe({
                        next: (resp: any) => {
                            if(resp.body.lyrics === null) {
                                this.currentLyrics = [];
                                return;
                            }

                            this.currentLyrics = resp.body.lyrics.split('\n');
                        },
                        error: (resp: any) => {
                            this.currentLyrics = [];
                            console.log(resp.error);
                        }
                    });
                }
            },
            error: (resp: any) => {
                this.isPlayerActive = false;
                this.currentLyrics = [];
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
