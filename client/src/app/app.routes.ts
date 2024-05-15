import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ChartsComponent } from './charts/charts.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {'path': '', component:LoginComponent, canActivate: [authGuard]},
    {'path': 'login', component:LoginComponent, canActivate: [authGuard] },
    {'path': 'home', component:HomeComponent, canActivate: [authGuard] },
    {'path': 'charts', component:ChartsComponent, canActivate: [authGuard] },
    {'path': '**', component:LoginComponent, canActivate: [authGuard] },
];
