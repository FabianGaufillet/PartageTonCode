import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { AccountComponent } from './account/account.component';
import { authGuard } from './guards/auth.guard';
import { SignoutComponent } from './signout/signout.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'account', component: AccountComponent, canActivate: [authGuard] },
  { path: 'signout', component: SignoutComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/home' },
];
