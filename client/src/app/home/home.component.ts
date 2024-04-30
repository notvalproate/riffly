import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    username : string = '';
    url : string = '';

    constructor(private router: Router, private cookieService: CookieService) { }

    ngOnInit(): void {
        if(!this.cookieService.get('authToken')) {
            this.router.navigate(['login']);
            return;
        }

        this.getUsername();
    }

    async getUsername() {
        const result = await fetch("https://api.spotify.com/v1/me", {
            method: "GET", headers: { Authorization: `Bearer ${this.cookieService.get('authToken')}` }
        });

        const userInfo = await result.json();

        this.username = userInfo.display_name;
        this.url = userInfo.external_urls.spotify;
    }
}
