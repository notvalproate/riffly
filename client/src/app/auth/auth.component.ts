import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {
    private router: Router = inject(Router);
    private auth: AuthService = inject(AuthService);

    ngOnInit(): void {
        let authorization = this.auth.authorizeWithParams();

        if(authorization === undefined) {
            this.router.navigate(['login']);
        }

        authorization?.subscribe({
            next: (resp: any) => {
                this.router.navigate(['home']);
            },
            error: (err: any) => {
                this.router.navigate(['login']);
            }
        });
    }
}
