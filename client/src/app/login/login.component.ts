import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    private router: Router = inject(Router);
    private cookieService: CookieService = inject(CookieService);
    private auth: AuthService = inject(AuthService);

    ngOnInit(): void {
        if(this.auth.hasAuthToken()) {
            this.router.navigate(['home']);
            return;
        }

        if(this.auth.hasError()) {
            this.router.navigate(['login']);
            return;
        }

        this.auth.authorizeWithParams()?.subscribe((resp:any) => {
            this.router.navigate(['home']);
        });
    }

    onSubmit(event: Event) {
        event.preventDefault();

        this.auth.getOAuthURL().subscribe((res: any) => {
            window.location.href = res.url;
        });
    }
}
