import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SongListDisplayComponent } from './song-list-display/song-list-display.component';


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
  

  displayDaily() : void {
    this.type = 0;
  }

  displayAi() : void {
    this.type = 1;
  }

  goToCharts() {
    this.router.navigate(['charts']);
  }
}
