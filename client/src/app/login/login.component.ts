import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'login',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
    private apiUrl: string = 'http://localhost:4000';

    constructor(private http: HttpClient, private router: Router) { }

    onSubmit(event: Event) {
        event.preventDefault();

        this.http.get(this.apiUrl + '/login').subscribe((resp:any) => {
            if(resp.response == "Logged in!") {
                this.router.navigate(['home']);
            }
        });
    }
}
