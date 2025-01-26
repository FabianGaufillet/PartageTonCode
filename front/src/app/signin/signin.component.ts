import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { ApiResponse } from '../interfaces/api-response';
import { ForgottenPasswordComponent } from './forgotten-password/forgotten-password.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-signin',
  imports: [
    FormsModule,
    MatError,
    MatFormField,
    MatHint,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatIcon,
    MatIconButton,
    MatButton,
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  private signinSubscription?: Subscription;
  private dialogSubscription?: Subscription;
  private reInitializePasswordSubscription?: Subscription;

  public loginForm: FormGroup = this.formBuilder.group({});
  public hide = signal(true);

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  signin() {
    if (this.signinSubscription) {
      this.signinSubscription.unsubscribe();
    }
    this.signinSubscription = this.userService
      .signin(this.loginForm.value)
      .subscribe({
        next: (response: ApiResponse) => {
          const user = response.data;
          this.userService.setUserStatus({
            message: 'User is authenticated',
            data: {
              authenticated: true,
              isAdmin: 'admin' === user['role'],
            },
          });
          this.router.navigate(['/account']);
        },
        error: () => {
          this.snackBar.open('Identifiants incorrects', 'OK', {
            duration: 2000,
          });
        },
        complete: () => {},
      });
  }

  openDialog() {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }

    const dialogRef = this.dialog.open(ForgottenPasswordComponent, {});

    this.dialogSubscription = dialogRef.afterClosed().subscribe({
      next: (result: string) => {
        if (result) {
          if (this.reInitializePasswordSubscription) {
            this.reInitializePasswordSubscription.unsubscribe();
          }
          this.reInitializePasswordSubscription = this.userService
            .resetPassword(result)
            .subscribe({
              next: () => {
                this.snackBar.open(
                  'Un nouveau mot de passe vous a été envoyé par email. Pensez à vérifier vos spams.',
                  'OK',
                  {
                    duration: 2000,
                  },
                );
              },
              error: () => {
                this.snackBar.open(
                  "Désolé, une erreur s'est produite durant la réinitialisation de votre mot de passe.",
                  'OK',
                  {
                    duration: 2000,
                  },
                );
              },
              complete: () => {},
            });
        }
      },
      error: () => {
        this.snackBar.open(
          'Désolé, une erreur est survenue. Veuillez réessayer plus tard.',
          'OK',
          {
            duration: 2000,
          },
        );
      },
      complete: () => {},
    });
  }

  ngOnDestroy() {
    if (this.signinSubscription) {
      this.signinSubscription.unsubscribe();
    }
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
    if (this.reInitializePasswordSubscription) {
      this.reInitializePasswordSubscription.unsubscribe();
    }
  }
}
