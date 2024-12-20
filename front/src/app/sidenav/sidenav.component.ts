import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import {
  MatListItem,
  MatListItemIcon,
  MatNavList,
} from '@angular/material/list';
import { NavItem } from '../interfaces/nav-item';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../services/user.service';
import { map, Observable, Subscription } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';

@Component({
  selector: 'app-sidenav',
  imports: [
    MatSidenavModule,
    MatIcon,
    MatNavList,
    MatListItem,
    MatListItemIcon,
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  standalone: true,
})
export class SidenavComponent implements OnInit, OnDestroy {
  private readonly userService = inject(UserService);
  private userStatusSubscription?: Subscription;
  public navItems: NavItem[] = [];

  ngOnInit() {
    if (this.userStatusSubscription) {
      this.userStatusSubscription.unsubscribe();
    }
    this.userStatusSubscription = this.isAuthenticated.subscribe(
      (isAuthenticated: boolean) => {
        this.updateNavItems(isAuthenticated);
      },
    );
  }

  private updateNavItems(isAuthenticated: boolean): void {
    if (!isAuthenticated) {
      this.navItems = [
        {
          icon: 'home',
          label: 'Accueil',
          route: 'home',
        },
        {
          icon: 'person_add',
          label: 'Inscription',
          route: 'signup',
        },
        {
          icon: 'login',
          label: 'Connexion',
          route: 'signin',
        },
      ];
    } else {
      this.navItems = [
        {
          icon: 'home',
          label: 'Accueil',
          route: 'home',
        },
        {
          icon: 'account_box',
          label: 'Mon compte',
          route: 'account',
        },
        {
          icon: 'group',
          label: 'Mes amis',
          route: '',
        },
        {
          icon: 'list_alt',
          label: 'Mes publications',
          route: '',
        },
        {
          icon: 'notifications',
          label: 'Mes notifications',
          route: '',
        },
        {
          icon: 'insert_comment',
          label: 'Mes groupes de discussion',
          route: '',
        },
        {
          icon: 'star',
          label: 'Administration',
          route: '',
        },
        {
          icon: 'logout',
          label: 'Déconnexion',
          route: 'signout',
        },
      ];
    }
  }

  get isAuthenticated(): Observable<boolean> {
    return this.userService.userStatus().pipe(
      map((userStatus: ApiResponse) => {
        return !!userStatus.data['authenticated'];
      }),
    );
  }

  ngOnDestroy() {
    if (this.userStatusSubscription) {
      this.userStatusSubscription.unsubscribe();
    }
  }
}
