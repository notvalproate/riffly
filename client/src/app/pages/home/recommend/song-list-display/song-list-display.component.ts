import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-song-list-display',
  standalone: true,
  imports: [],
  templateUrl: './song-list-display.component.html',
  styleUrl: './song-list-display.component.scss'
})
export class SongListDisplayComponent {
  @Input() list? : any;
  @Input() type? : number;
}
