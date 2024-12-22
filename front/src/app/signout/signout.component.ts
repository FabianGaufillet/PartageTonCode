import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signout',
  imports: [MatButton],
  templateUrl: './signout.component.html',
  styleUrl: './signout.component.scss',
  standalone: true,
})
export class SignoutComponent implements OnInit, OnDestroy {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private userServiceSubscription?: Subscription;

  constructor() {}

  ngOnInit() {}

  signout() {
    if (this.userServiceSubscription) {
      this.userServiceSubscription.unsubscribe();
    }

    this.userServiceSubscription = this.userService.signout().subscribe({
      next: () => {
        this.userService.setUserStatus({
          message: 'User is signed out',
          data: { authenticated: false, isAdmin: false },
        });
        this.router.navigate(['/home']);
      },
      error: () => {},
      complete: () => {},
    });
  }

  ngOnDestroy() {
    if (this.userServiceSubscription) {
      this.userServiceSubscription.unsubscribe();
    }
  }
}
