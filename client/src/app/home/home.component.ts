import { Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserInfoService } from '../services/user-info.service';
import { PollingService } from '../services/polling.service';

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
    private playerPoller: PollingService = inject(PollingService);

    profileName: string = '';
    profileUrl: string = '';

    isPlayerActive: boolean = false;

    currentSongImgUrl: string = '';
    currentSongTitle: string = '';
    currentSongUrl: string = '';
    currentSongID: string = '';

    currentArtists: string[] = [];
    currentArtistsUrls: string[] = [];

    currentLyrics: string[] = [];

    trackPolling: any = undefined;

    ngOnInit(): void {
        this.auth.hasAuthToken().subscribe((resp: any) => {
            if(!resp.body.hasToken) {
                this.router.navigate(['login']);
                return;
            }

            this.getUserInfo();

            this.playerPoller.startPolling(this.getCurrentTrack.bind(this));
        })
    }

    ngOnDestroy() {
        this.playerPoller.stopPolling();
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
        this.userInfoService.getTrackInfo().subscribe({
            next: (resp: any) => {
                if(resp.status === 204) {
                    this.isPlayerActive = false;
                    return;
                }

                let currentID = this.currentSongID;

                this.isPlayerActive = true;

                this.currentSongImgUrl = resp.body.item.album.images[0].url;
                this.currentSongTitle = resp.body.item.name;
                this.currentSongUrl = resp.body.item.external_urls.spotify;
                this.currentSongID = resp.body.item.id;

                this.currentArtists = resp.body.item.artists.map((artist: any) => artist.name);
                this.currentArtistsUrls = resp.body.item.artists.map((artist: any) => artist.external_urls.spotify);

                if(currentID !== resp.body.item.id) {
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
                this.currentSongTitle = '';
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

    @HostListener('document:visibilitychange', ['$event'])
    handleVisibilityChange() {
        if (document.hidden) {
        this.playerPoller.stopPolling();
        console.log('Polling stopped');
        } else {
        this.playerPoller.startPolling(this.getCurrentTrack.bind(this));
        console.log('Polling resumed');
        }
    }
}
