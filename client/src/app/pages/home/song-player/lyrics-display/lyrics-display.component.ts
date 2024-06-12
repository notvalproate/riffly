import { Component, Input } from '@angular/core';
import { LyricsData } from '../../../../../shared/interfaces/LyricsData';

@Component({
  selector: 'app-lyrics-display',
  standalone: true,
  imports: [],
  templateUrl: './lyrics-display.component.html',
  styleUrl: './lyrics-display.component.scss'
})
export class LyricsDisplayComponent {
@Input() lyricsData?: LyricsData;
}
