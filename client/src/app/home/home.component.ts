import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserInfoService } from '../services/user-info.service';

@Component({
  selector: 'home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    private router: Router = inject(Router);
    private auth: AuthService = inject(AuthService);
    private userInfoService: UserInfoService = inject(UserInfoService);

    username: string = '';
    url: string = 'spotify.com';
    imgUrl: string = '';
    songTitle: string = '';
    artist: string = '';
    trackPolling: any = undefined;

    ngOnInit(): void {
        this.auth.hasAuthToken().subscribe((resp: any) => {
            if(!resp.body.hasToken) {
                this.router.navigate(['login']);
                return;
            }

            this.getUserInfo();

            this.trackPolling = setInterval(() => {
                this.getCurrentTrack();
            }, 2000);
        })
    }

    async getUserInfo() {
        this.userInfoService.getUserInfo().subscribe((resp: any) => {
            this.username = resp.body.display_name;
            this.url = resp.body.external_urls.spotify;
        })
    }

    async getCurrentTrack() {
        this.userInfoService.getTrackInfo().subscribe((resp: any) => {
            console.log(resp.body);

            this.songTitle = resp.body.item.album.name;
            this.artist = resp.body.item.album.artists[0].name;
            this.imgUrl = resp.body.item.album.images[0].url;
        })
    }
}
