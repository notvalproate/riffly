import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'login',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    private http: HttpClient = inject(HttpClient);
    private router: Router = inject(Router);
    private cookieService: CookieService = inject(CookieService);

    private apiUrl: string = 'http://localhost:4000';

    ngOnInit(): void {
        if(this.cookieService.get('authToken')) {
            this.router.navigate(['home']);
            return;
        }

        const params : URLSearchParams = new URLSearchParams(window.location.search);

        if(params.size === 0) {
            return;
        }

        const error : any = params.get('error');

        if(error) {
            this.router.navigate(['login']);
            return;
        }

        const code : any = params.get('code');
        const state : any = params.get('state');

        if(code && state) {
            const authParams : URLSearchParams = new URLSearchParams({
                code: code,
                state: state
            });

            console.log('making request to get auth info');
            this.http.get(this.apiUrl + '/getAuthInfo?' + authParams.toString()).subscribe((resp:any) => {
                this.cookieService.set('authToken', resp.authToken, 3600);
                this.cookieService.set('refreshToken', resp.refreshToken, 3600);

                this.router.navigate(['home']);
            });
        }
    }

    onSubmit(event: Event) {
        event.preventDefault();

        this.http.get(this.apiUrl + '/login').subscribe((resp:any) => {
            window.location.href = resp.url;
        });
    }
}
