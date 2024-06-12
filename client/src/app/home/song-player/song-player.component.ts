import { Component, OnInit, OnDestroy, HostListener, inject } from '@angular/core';
import { PollingService } from '../../../shared/services/polling.service';
import { UserInfoService } from '../../../shared/services/user-info.service';

import { SongCardComponent } from './song-card/song-card.component';
import { ProgressTrackerComponent } from './progress-tracker/progress-tracker.component';
import { LyricsDisplayComponent } from './lyrics-display/lyrics-display.component';

import { SongCardData } from '../../../shared/interfaces/SongCardData';
import { ProgressData } from '../../../shared/interfaces/ProgressData';
import { LyricsData } from '../../../shared/interfaces/LyricsData';

@Component({
  selector: 'app-song-player',
  standalone: true,
  imports: [SongCardComponent, ProgressTrackerComponent, LyricsDisplayComponent],
  templateUrl: './song-player.component.html',
  styleUrl: './song-player.component.scss'
})
export class SongPlayerComponent implements OnInit, OnDestroy {
    private playerPoller: PollingService = new PollingService();
    private progressPoller: PollingService = new PollingService();
    private userInfoService: UserInfoService = inject(UserInfoService);

    songCardData : SongCardData;
    progressData : ProgressData;
    lyricsData : LyricsData;

    isPlayerActive: boolean = false;

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
        this.progressPoller.config({
            intervalTime: 1000,
        });
        this.playerPoller.startPolling(this.getCurrentTrack.bind(this));
    }

    ngOnDestroy() {
        this.playerPoller.stopPolling();
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
                            if(resp.body.isrc !== this.songCardData.currentISRC) {
                                return;
                            }

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
}
