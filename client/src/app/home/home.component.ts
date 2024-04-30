import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    private router: Router = inject(Router);
    private cookieService: CookieService = inject(CookieService);
    private auth: AuthService = inject(AuthService);

    username : string = '';
    url : string = 'spotify.com';

    ngOnInit(): void {
        if(!this.auth.hasAuthToken()) {
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
