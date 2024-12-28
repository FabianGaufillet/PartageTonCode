import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import {
  MatListItem,
  MatListItemIcon,
  MatNavList,
} from '@angular/material/list';
import { NavItem } from '../interfaces/nav-item';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
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
})
export class SidenavComponent implements OnInit, OnDestroy {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly breakpointObserver = inject(BreakpointObserver);

  private breakpointStateSubscription?: Subscription;
  private userStatusSubscription?: Subscription;
  private updatedUserStatusSubscription?: Subscription;

  public navItems: NavItem[] = [];
  public isMobile = false;
  public isSidenavOpened = false;

  ngOnInit() {
    this.initializeBreakpoints();
    this.initializeNavItems();
    this.handleUserStatusUpdates();
  }

  private initializeBreakpoints(): void {
    if (this.breakpointStateSubscription) {
      this.breakpointStateSubscription.unsubscribe();
    }
    this.breakpointStateSubscription = this.breakpointObserver
      .observe(['(max-width: 768px)'])
      .subscribe((state: BreakpointState) => {
        this.isMobile = state.matches;
        if (this.isMobile) {
          this.isSidenavOpened = false;
        }
      });
  }

  private initializeNavItems(): void {
    if (this.userStatusSubscription) {
      this.userStatusSubscription.unsubscribe();
    }
    this.userStatusSubscription = this.userService
      .userStatus()
      .subscribe((response: ApiResponse) => {
        this.userService.setUserStatus(response);
        this.updateNavItems(
          response.data['authenticated'] as boolean,
          response.data['isAdmin'] as boolean,
        );
      });
  }

  private handleUserStatusUpdates(): void {
    if (this.updatedUserStatusSubscription) {
      this.updatedUserStatusSubscription.unsubscribe();
    }
    this.updatedUserStatusSubscription = this.userService
      .getUserStatus()
      .subscribe((response: ApiResponse) => {
        this.updateNavItems(
          response.data['authenticated'] as boolean,
          response.data['isAdmin'] as boolean,
        );
      });
  }

  private updateNavItems(isAuthenticated: boolean, isAdmin = false): void {
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
          route: 'friends',
        },
        {
          icon: 'list_alt',
          label: 'Mes publications',
          route: 'posts',
        },
        {
          icon: 'notifications',
          label: 'Mes notifications',
          route: 'notifications',
        },
        {
          icon: 'insert_comment',
          label: 'Mes groupes de discussion',
          route: 'channels',
        },
        ...(isAdmin
          ? [
              {
                icon: 'star',
                label: 'Administration',
                route: 'admin',
              },
            ]
          : []),
        {
          icon: 'logout',
          label: 'Déconnexion',
          route: 'signout',
        },
      ];
    }
  }

  public toggleSidenav(): void {
    this.isSidenavOpened = !this.isSidenavOpened;
  }

  public isActivatedRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  ngOnDestroy() {
    if (this.breakpointStateSubscription) {
      this.breakpointStateSubscription.unsubscribe();
    }

    if (this.userStatusSubscription) {
      this.userStatusSubscription.unsubscribe();
    }

    if (this.updatedUserStatusSubscription) {
      this.updatedUserStatusSubscription.unsubscribe();
    }
  }
}
