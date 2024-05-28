import { Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserInfoService } from '../services/user-info.service';
import { PollingService } from '../services/polling.service';
import { SongCardComponent } from '../general-components/song-card/song-card.component';
import { ProgressTrackerComponent } from './home-components/progress-tracker/progress-tracker.component';
import { LyricsDisplayComponent } from './home-components/lyrics-display/lyrics-display.component';
import { SongCardData } from '../interfaces/SongCardData';
import { ProgressData } from '../interfaces/ProgressData';
import { LyricsData } from '../interfaces/LyricsData';

@Component({
  selector: 'home',
  standalone: true,
  imports: [ SongCardComponent, ProgressTrackerComponent, LyricsDisplayComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
    private router: Router = inject(Router);
    private auth: AuthService = inject(AuthService);
    private userInfoService: UserInfoService = inject(UserInfoService);
    private playerPoller: PollingService = new PollingService();
    private progressPoller: PollingService = new PollingService();

    songCardData : SongCardData;
    progressData : ProgressData;
    lyricsData : LyricsData;

    profileName: string = '';
    profileUrl: string = '';

    isPlayerActive: boolean = false;

    trackPolling: any = undefined;

    constructor() {
        this.songCardData = {
            currentSongImgUrl: '',
            currentSongTitle: '',
            currentSongUrl: '',
            currentISRC: '',
            currentArtists: [],
            currentArtistsUrls: []
        };
        this.progressData = {
            currentISRC: '',
            currentSongLength: 0,
            currentSongProgress: 0,
            currentProgressPercent: '',
        }
        this.lyricsData = {
            loadingLyrics: false,
            currentLyrics: [],
            lyricsProvider: '',
            lyricsUrl: '',
        }
    }

    ngOnInit(): void {
        this.getUserInfo();

        this.progressPoller.config({
            intervalTime: 1000,
        });
        this.playerPoller.startPolling(this.getCurrentTrack.bind(this));
    }

    ngOnDestroy() {
        this.playerPoller.stopPolling();
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

    async getCurrentTrack() {
        this.userInfoService.getPlayerInfo().subscribe({
            next: (resp: any) => {
                if(resp.status === 204) {
                    this.isPlayerActive = false;
                    return;
                }

                const info = resp.body;

                let previousISRC = this.songCardData.currentISRC;

                this.isPlayerActive = true;

                this.songCardData.currentSongImgUrl = info.item.images.default;
                this.songCardData.currentSongTitle = info.item.title;
                this.songCardData.currentSongUrl = info.item.url;
                this.songCardData.currentISRC = info.item.isrc;

                this.progressData.currentSongLength = info.player.duration;
                this.progressData.currentSongProgress = info.player.progress;
                this.progressData.currentProgressPercent = ((this.progressData.currentSongProgress * 100) / this.progressData.currentSongLength) + '%';

                this.songCardData.currentArtists = info.item.artists.map((artist: any) => artist.name);
                this.songCardData.currentArtistsUrls = info.item.artists.map((artist: any) => artist.url);

                this.progressData.currentISRC = this.songCardData.currentISRC;

                if(previousISRC !== this.songCardData.currentISRC) {
                    this.progressPoller.startPolling(this.increaseProgressByOneSecond.bind(this));

                    this.lyricsData.loadingLyrics = true;

                    this.userInfoService.getLyrics(this.songCardData.currentISRC).subscribe({
                        next: (resp: any) => {
                            this.lyricsData.loadingLyrics = false;

                            if(resp.body === null) {
                                this.lyricsData.currentLyrics = [];
                                this.lyricsData.lyricsUrl = '';
                                return;
                            }

                            const lyrics = resp.body;

                            this.lyricsData.lyricsUrl = lyrics.url;
                            this.lyricsData.lyricsProvider = lyrics.provider;

                            if(lyrics.lyricsBody === null) {
                                this.lyricsData.currentLyrics = [];
                                return;
                            }

                            this.lyricsData.currentLyrics = lyrics.lyricsBody.split('\n');
                        },
                        error: (resp: any) => {
                            this.lyricsData.loadingLyrics = false;
                            this.lyricsData.currentLyrics = [];
                            this.lyricsData.lyricsUrl = '';
                            this.lyricsData.lyricsProvider = '';
                            console.log(resp.error);
                        }
                    });
                }
            },
            error: (resp: any) => {
                this.isPlayerActive = false;
                this.lyricsData.currentLyrics = [];
                this.songCardData.currentISRC = '';
                this.progressData.currentISRC = '';
                this.progressPoller.stopPolling();
                console.log(resp.error);
            }
        });
    }

    increaseProgressByOneSecond() {
        this.progressData.currentSongProgress += 1000;

        if(this.progressData.currentSongProgress >= this.progressData.currentSongLength){
            this.progressData.currentSongProgress = this.progressData.currentSongLength;
        }

        this.progressData.currentProgressPercent = ((this.progressData.currentSongProgress * 100) / this.progressData.currentSongLength) + '%';
    }


    @HostListener('document:visibilitychange', ['$event'])
    handleVisibilityChange() {
        if (document.hidden) {
            this.playerPoller.stopPolling();
        } else {
            this.playerPoller.startPolling(this.getCurrentTrack.bind(this));
        }
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
