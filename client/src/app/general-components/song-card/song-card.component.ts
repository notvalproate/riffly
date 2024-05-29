import { Component, Input } from '@angular/core';
import { SongCardData } from '../../interfaces/SongCardData'; 

@Component({
  selector: 'app-song-card',
  standalone: true,
  imports: [],
  templateUrl: './song-card.component.html',
  styleUrl: './song-card.component.scss'
})
export class SongCardComponent{ 
  @Input() songCardData?: SongCardData;
}
