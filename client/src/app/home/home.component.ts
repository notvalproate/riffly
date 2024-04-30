import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    username : string = '';

    ngOnInit(): void {
        this.getUsername();
    }

    async getUsername() {
        const result = await fetch("https://api.spotify.com/v1/me", {
            method: "GET", headers: { Authorization: `Bearer ${window.localStorage.getItem('authToken')}` }
        });

        console.log(await result.json());
    }
}
