import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faShare } from '@fortawesome/free-solid-svg-icons';

import { List } from '../list';

@Component({
  selector: 'app-song-list-display',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './song-list-display.component.html',
  styleUrl: './song-list-display.component.scss'
})
export class SongListDisplayComponent {
  @Input() list? : any;

  faPlus = faPlus;
  faShare = faShare;

  addSong(id : number){
    console.log("Added song with id: " + id);
  }

  recommend(id : number){
    console.log("Recommended song with id: " + id);
  }
}
