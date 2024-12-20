import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-signout',
  imports: [MatButton],
  templateUrl: './signout.component.html',
  styleUrl: './signout.component.scss',
  standalone: true,
})
export class SignoutComponent implements OnInit, OnDestroy {
  private readonly userService = inject(UserService);
  private userServiceSubscription?: Subscription;

  constructor() {}

  ngOnInit() {}

  signout() {
    if (this.userServiceSubscription) {
      this.userServiceSubscription.unsubscribe();
    }

    this.userServiceSubscription = this.userService.signout().subscribe({
      next: () => {},
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
