import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'login',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    private apiUrl: string = 'http://localhost:4000';

    constructor(private http: HttpClient, private router: Router) { }

    ngOnInit(): void {
        if(window.localStorage.getItem('auth') === 'kanva') {
            this.router.navigate(['home']);
        }
    }

    onSubmit(event: Event) {
        event.preventDefault();

        this.http.get(this.apiUrl + '/login').subscribe((resp:any) => {
            if(resp.response == "Logged in!") {
                window.localStorage.setItem('auth', 'kanva');
                this.router.navigate(['home']);
            }
        });
    }
}
