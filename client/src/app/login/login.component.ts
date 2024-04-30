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
        if(window.localStorage.getItem('authToken')) {
            this.router.navigate(['home']);
            return;
        }

        const parameters : URLSearchParams = new URLSearchParams(window.location.search);
        const authToken : any = parameters.get('authToken');

        if(authToken) {
            window.localStorage.setItem('authToken', authToken);
            this.router.navigate(['home']);
        }
    }

    onSubmit(event: Event) {
        event.preventDefault();

        var params : string = '';
        if(localStorage.getItem('authToken')) {
            params += `?hasAuthToken=true`;
        }

        this.http.get(this.apiUrl + '/login' + params).subscribe((resp:any) => {
            window.location.href = resp.url;
        });
    }
}
