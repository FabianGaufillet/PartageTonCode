import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../services/user.service';
import { Observable, Subscription, switchMap } from 'rxjs';
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
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatError, MatFormField, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AskPasswordComponent } from './ask-password/ask-password.component';
import { nanoid } from 'nanoid';
import { UploadService } from '../services/upload.service';
import { UpdatedUserForm } from '../interfaces/updated-user-form';
import { HtmlDecodePipe } from '../pipes/html-decode.pipe';
import { ChangePassword } from '../interfaces/change-password';

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
    AvatarModule,
    AvatarGroupModule,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly userService = inject(UserService);
  private readonly uploadService = inject(UploadService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  private htmlDecodePipe = inject(HtmlDecodePipe);
  private fileList?: FileList;
  private fileUpload?: MatFileUploadComponent;
  private userSubscription?: Subscription;
  private dialogSubscription?: Subscription;
  private changePasswordSubscription?: Subscription;
  private updatedUserSubscription?: Subscription;

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
    const avatar = user.avatar.length === 2 ? user.avatar : '';
    this.userForm = this.formBuilder.group({
      _id: [user._id],
      avatar: [avatar],
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

  openDialog() {
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }

    const dialogRef = this.dialog.open(AskPasswordComponent, {});

    this.dialogSubscription = dialogRef.afterClosed().subscribe({
      next: (result: FormGroup) => {
        this.changePassword(result.value);
      },
      error: () => {
        this.snackBar.open(
          'Désolé, une erreur inattendue vient de se produire. Réessayez plus tard.',
          'OK',
          {
            duration: 5000,
          },
        );
      },
    });
  }

  save() {
    if (this.userForm.invalid) {
      return;
    }

    if (this.updatedUserSubscription) {
      this.updatedUserSubscription.unsubscribe();
    }

    if (this.fileList) {
      this.updatedUserSubscription = this.uploadFile(this.fileList)
        .pipe(
          switchMap((response: ApiResponse) => {
            if (response.data['display_url'] && response.data['delete_url']) {
              this.userForm
                .get('avatar')
                ?.setValue([
                  response.data['display_url'],
                  response.data['delete_url'],
                ]);
            }
            return this.userService.updateUser(
              String(this.userForm.value._id),
              this.formatUserForm(this.userForm.value),
            );
          }),
        )
        .subscribe({
          next: () => {
            this.snackBar.open('Modifications effectuées', 'OK', {
              duration: 2000,
            });
          },
          error: () => {
            this.snackBar.open('Une erreur est survenue', 'OK', {
              duration: 2000,
            });
          },
          complete: () => {
            this.fileUpload?.resetFileInput();
            this.fileList = undefined;
          },
        });
    } else {
      this.updatedUserSubscription = this.userService
        .updateUser(
          String(this.userForm.value._id),
          this.formatUserForm(this.userForm.value),
        )
        .subscribe({
          next: () => {
            this.snackBar.open('Modifications effectuées', 'OK', {
              duration: 2000,
            });
          },
          error: () => {
            this.snackBar.open('Une erreur est survenue', 'OK', {
              duration: 2000,
            });
          },
        });
    }
  }

  formatUserForm(rawUserForm: FormGroup): UpdatedUserForm {
    const formattedUserForm: { [key: string]: string } = {};
    for (const [key, value] of Object.entries(rawUserForm)) {
      if (value) {
        formattedUserForm[key] = value;
      }
    }
    return formattedUserForm as unknown as UpdatedUserForm;
  }

  uploadFile(fileList: FileList): Observable<ApiResponse> {
    return this.uploadService.uploadFile(fileList[0], nanoid());
  }

  changePassword(result: ChangePassword) {
    if (this.changePasswordSubscription) {
      this.changePasswordSubscription.unsubscribe();
    }
    console.log(result);
    this.changePasswordSubscription = this.userService
      .changePassword(result)
      .subscribe({
        next: () => {
          this.snackBar.open('Votre mot de passe a bien été modifié.', 'OK', {
            duration: 2000,
          });
        },
        error: () => {
          this.snackBar.open(
            'Désolé, une erreur est survenue, veuillez réessayer.',
            'OK',
            {
              duration: 2000,
            },
          );
        },
      });
  }

  get avatar() {
    const avatar = this.userForm.get('avatar')?.value;
    if (avatar) {
      return this.htmlDecodePipe
        .transform(decodeURIComponent(avatar[0]))
        .replace(/&#x2F;/g, '/');
    }
    return '';
  }

  get initials() {
    const firstname = this.userForm.get('firstname')?.value;
    const lastname = this.userForm.get('lastname')?.value;
    return `${firstname?.charAt(0)}${lastname?.charAt(0)}`;
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.dialogSubscription) {
      this.dialogSubscription.unsubscribe();
    }
    if (this.changePasswordSubscription) {
      this.changePasswordSubscription.unsubscribe();
    }
    if (this.updatedUserSubscription) {
      this.updatedUserSubscription.unsubscribe();
    }
  }
}
