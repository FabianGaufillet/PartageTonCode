import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../services/user.service';
import { Subscription, switchMap } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import {
  emailRegex,
  uploadLimit,
  userNameMaxLength,
  userNameMinLength,
  genders,
} from '../utils/constants';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatFileUploadComponent, MatFileUploadModule } from 'mat-file-upload';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatError, MatFormField, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-account',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatFileUploadModule,
    MatError,
    MatFormField,
    MatHint,
    MatInput,
    MatRadioButton,
    MatRadioGroup,
    MatButton,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);

  private fileList?: FileList;
  private fileUpload?: MatFileUploadComponent;
  private userSubscription?: Subscription;

  public isLoading = true;
  public userForm: FormGroup = this.formBuilder.group({});
  public genders = genders;

  ngOnInit() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }

    this.userSubscription = this.userService
      .userStatus()
      .pipe(
        switchMap((userStatus) => {
          return this.userService.userInfos(userStatus.data['_id'] as string);
        }),
      )
      .subscribe({
        next: (response: ApiResponse) => {
          this.initForm(response.data);
        },
        error: (error: any) => {
          console.log(error);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  initForm(user: any) {
    this.userForm = this.formBuilder.group({
      avatar: [user.avatar],
      username: [
        user.username,
        [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9]+'),
          Validators.minLength(userNameMinLength),
          Validators.maxLength(userNameMaxLength),
        ],
      ],
      firstname: [user.firstname, [Validators.required]],
      lastname: [user.lastname, [Validators.required]],
      gender: [user.gender, [Validators.required]],
      age: [{ value: user.age, disabled: true }],
      email: [
        user.email,
        [Validators.required, Validators.pattern(emailRegex)],
      ],
      street: [user.street],
      zipcode: [user.zipcode, [Validators.pattern('[0-9]{5}')]],
      city: [user.city],
    });
  }

  onSelectedFilesChanged(
    fileList: FileList,
    fileUpload: MatFileUploadComponent,
  ): void {
    if (!fileList.length) {
      this.fileList = undefined;
      return;
    }
    const file = fileList[0];
    this.fileUpload = fileUpload;
    if (file.size > uploadLimit) {
      this.userForm.get('avatar')?.setValue('');
      this.fileUpload.resetFileInput();
      this.fileList = undefined;
      this.snackBar.open('Désolé, ce fichier est trop volumineux', 'OK', {
        duration: 5000,
      });
      return;
    }
    this.fileList = fileList;
  }

  save() {}

  changePassword() {}

  deleteAccount() {}

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
