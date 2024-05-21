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
export class SongCardComponent implements OnInit { 
  @Input() songCardData?: SongCardData;

  ngOnInit(): void {
    this.print();
  }

  print(): void {
    console.log(this.songCardData);
  }
}
