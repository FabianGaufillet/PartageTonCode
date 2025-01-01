import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { EditorModule } from 'primeng/editor';
import {
  FormGroup,
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { PostsService } from '../../services/posts.service';
import { ApiResponse } from '../../interfaces/api-response';
import { Subscription, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-new-post',
  imports: [
    ReactiveFormsModule,
    EditorModule,
    MatError,
    MatFormField,
    MatHint,
    MatInput,
    MatLabel,
    MatButton,
  ],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss',
})
export class NewPostComponent implements OnInit, OnDestroy {
  private readonly userService = inject(UserService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly postsService = inject(PostsService);

  private publishSubscription?: Subscription;

  public postForm: FormGroup = this.formBuilder.group({});

  constructor() {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.postForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
    });
  }

  public publish() {
    if (this.publishSubscription) {
      this.publishSubscription.unsubscribe();
    }

    this.publishSubscription = this.userService
      .userStatus()
      .pipe(
        switchMap((userStatus: ApiResponse) => {
          return this.postsService.publish({
            ...this.postForm.value,
            profile: userStatus.data['_id'],
          });
        }),
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Votre message a bien été publié !', 'OK', {
            duration: 2000,
          });
          this.postForm.reset();
        },
        error: () => {
          this.snackBar.open(
            "Désolé, une erreur est survenue, votre message n'a pas pu être publié",
            'OK',
            {
              duration: 2000,
            },
          );
        },
      });
  }

  public cancel() {
    this.postForm.reset();
  }

  ngOnDestroy() {
    if (this.publishSubscription) {
      this.publishSubscription.unsubscribe();
    }
  }
}
