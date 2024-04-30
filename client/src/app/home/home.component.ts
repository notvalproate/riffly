import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    username : string = '';

    constructor(private router: Router) { }

    ngOnInit(): void {
        if(!window.localStorage.getItem('authToken')) {
            this.router.navigate(['login']);
            return;
        }

        this.getUsername();
    }

    async getUsername() {
        const result = await fetch("https://api.spotify.com/v1/me", {
            method: "GET", headers: { Authorization: `Bearer ${window.localStorage.getItem('authToken')}` }
        });

        console.log(await result.json());
    }
}
