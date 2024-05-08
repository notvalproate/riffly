import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ChartsComponent } from './charts/charts.component';

export const routes: Routes = [
    {'path': '', component:LoginComponent},
    {'path': 'login', component:LoginComponent},
    {'path': 'home', component:HomeComponent},
    {'path': 'charts', component:ChartsComponent},
    {'path': '**', component:LoginComponent},
];
