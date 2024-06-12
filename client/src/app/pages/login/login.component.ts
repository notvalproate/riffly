import { Component, inject } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
    private auth: AuthService = inject(AuthService);

    onSubmit(event: Event) {
        event.preventDefault();

        this.auth.getOAuthURL().subscribe((res: any) => {
            window.location.href = res.url;
        });
    }
}
