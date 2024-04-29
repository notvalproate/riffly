import { Component } from '@angular/core';

@Component({
  selector: 'login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
    apiUrl : string = "http://localhost:4000";
}
