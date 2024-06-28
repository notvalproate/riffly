import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SongListDisplayComponent } from './song-list-display/song-list-display.component';
import { List } from './list';
import { Daily, Ai } from './lists';


@Component({
  selector: 'app-recommend',
  standalone: true,
  imports: [CommonModule, SongListDisplayComponent],
  templateUrl: './recommend.component.html',
  styleUrl: './recommend.component.scss'
})
export class RecommendComponent {
  private router: Router = inject(Router);
  type : number = 0;
  daily: List[] = Daily;
  ai: List[] = Ai;


  displayDaily() : void {
    this.type = 0;
    console.log(this.daily);
  }

  displayAi() : void {
    this.type = 1;
  }

  goToCharts() {
    this.router.navigate(['charts']);
  }
}
