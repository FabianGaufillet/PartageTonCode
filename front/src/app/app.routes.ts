import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { AccountComponent } from './account/account.component';
import { SignoutComponent } from './signout/signout.component';
import { FriendsComponent } from './friends/friends.component';
import { PostsComponent } from './posts/posts.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ChannelsComponent } from './channels/channels.component';
import { AdminComponent } from './admin/admin.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'account', component: AccountComponent, canActivate: [authGuard] },
  { path: 'friends', component: FriendsComponent, canActivate: [authGuard] },
  { path: 'posts', component: PostsComponent, canActivate: [authGuard] },
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [authGuard],
  },
  { path: 'channels', component: ChannelsComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: 'signout', component: SignoutComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/home' },
];
