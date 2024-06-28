import { Component, Input, OnInit, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SongListDisplayComponent } from './song-list-display/song-list-display.component';
import { UserInfoService } from '../../../../shared/services/user-info.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-recommend',
  standalone: true,
  imports: [CommonModule, SongListDisplayComponent],
  templateUrl: './recommend.component.html',
  styleUrl: './recommend.component.scss'
})
export class RecommendComponent implements OnInit {
    private router: Router = inject(Router);
    private userService: UserInfoService = inject(UserInfoService);
    ai: any = [];

    ngOnInit(): void {
        this.userService.songId.subscribe((songId) => {
            console.log("GOT SONG ID " + songId);
            this.getRecs(songId);
        });
    }

    goToCharts() {
        this.router.navigate(['charts']);
    }

    getRecs(songId: any) {
        this.userService.getRecommendations(songId).subscribe((data: any) => {
            this.ai = data.body;
        });
    }
}
