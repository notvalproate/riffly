import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { SongCardData } from '../../interfaces/SongCardData'; 
import { PollingService } from '../../services/polling.service';

@Component({
  selector: 'app-song-card',
  standalone: true,
  imports: [],
  templateUrl: './song-card.component.html',
  styleUrl: './song-card.component.scss'
})
export class SongCardComponent implements OnInit, OnDestroy{
  private cardPoller: PollingService = new PollingService();
  @Input() songCardData?: SongCardData;
  
  currentSongImgUrl: string = '';
  currentSongTitle: string = '';
  currentSongUrl: string = '';
  currentSongID: string = '';
  currentArtists: string[] = [];
  currentArtistsUrls: string[] = [];

  ngOnInit(): void {
    this.cardPoller.config({
      intervalTime: 1000,
  });
    this.cardPoller.startPolling(this.cardUpdate.bind(this));
  }

  ngOnDestroy(): void {
    this.cardPoller.stopPolling();
  }

  cardUpdate(){
    if (this.songCardData)
      this.currentSongImgUrl = this.songCardData?.currentSongImgUrl?? '';
      this.currentSongTitle = this.songCardData?.currentSongTitle?? '';
      this.currentSongUrl = this.songCardData?.currentSongUrl?? '';
      this.currentSongID = this.songCardData?.currentSongID?? '';
      this.currentArtists = this.songCardData?.currentArtists?? [];
      this.currentArtistsUrls = this.songCardData?.currentArtistsUrls?? [];
      //console.log(this.songCardData);
  }
    
}
