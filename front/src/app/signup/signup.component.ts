import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFileUploadComponent, MatFileUploadModule } from 'mat-file-upload';
import { UploadService } from '../services/upload.service';
import { Observable, Subscription, switchMap } from 'rxjs';
import {
  emailRegex,
  passwordRegex,
  uploadLimit,
  userNameMaxLength,
  userNameMinLength,
  genders,
  minAge,
} from '../utils/constants';
import { nanoid } from 'nanoid';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
  MatStep,
  MatStepLabel,
  MatStepper,
  MatStepperNext,
  MatStepperPrevious,
} from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';
import { SignupForm } from '../interfaces/signup-form';
import { RawSignupForm } from '../interfaces/raw-signup-form';
import { Router } from '@angular/router';
import { ApiResponse } from '../interfaces/api-response';

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIcon,
    MatFileUploadModule,
    MatRadioGroup,
    MatRadioButton,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatStepper,
    MatStep,
    MatStepLabel,
    MatStepperNext,
    MatStepperPrevious,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly uploadService = inject(UploadService);
  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  private signupSubscription?: Subscription;
  private fileUpload?: MatFileUploadComponent;
  private fileList?: FileList;

  public connectionForm: FormGroup = this.formBuilder.group({});
  public personalInfosForm: FormGroup = this.formBuilder.group({});
  public hide = signal(true);
  public fileId?: string;
  public genders = genders;
  public maxBirthDate = this.calculateMaxBirthDate();
  public suggestedPassword = this.generateRandomPassword(12);

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.connectionForm = this.formBuilder.group({
      avatar: [''],
      username: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z0-9]+'),
          Validators.minLength(userNameMinLength),
          Validators.maxLength(userNameMaxLength),
        ],
      ],
      password: ['', [Validators.required, Validators.pattern(passwordRegex)]],
    });
    this.personalInfosForm = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      gender: ['other', [Validators.required]],
      birthdate: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(emailRegex)]],
      street: [null],
      zipcode: [null, [Validators.pattern('[0-9]{5}')]],
      city: [null],
    });
  }

  private generateRandomPassword(length = 8) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialCharacters = '@$!%*?&';
    const allCharacters = lowercase + uppercase + numbers + specialCharacters;

    let password = '';
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password +=
      specialCharacters[Math.floor(Math.random() * specialCharacters.length)];

    for (let i = 4; i < length; i++) {
      password +=
        allCharacters[Math.floor(Math.random() * allCharacters.length)];
    }

    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  calculateMaxBirthDate(): Date {
    const today = new Date();
    return new Date(
      today.getFullYear() - minAge,
      today.getMonth(),
      today.getDate(),
    );
  }

  calculateAge(birthdate: Date): number {
    if (!birthdate) {
      return 0;
    }

    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDifference = today.getMonth() - birthdate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthdate.getDate())
    ) {
      age--;
    }
    return age;
  }

  togglePasswordVisibility(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  formatSignupForm(rawForm: RawSignupForm): SignupForm {
    const signupForm: RawSignupForm = {};
    for (const [key, value] of Object.entries(rawForm)) {
      if (value) {
        signupForm[key] = value;
      }
    }
    const birthdate = signupForm['birthdate'] as moment.Moment;
    signupForm['age'] = this.calculateAge(birthdate.toDate());
    return signupForm as unknown as SignupForm;
  }

  signup() {
    if (this.connectionForm.invalid || this.personalInfosForm.invalid) {
      return;
    }

    if (this.signupSubscription) {
      this.signupSubscription.unsubscribe();
    }

    if (this.fileList) {
      this.signupSubscription = this.uploadFile(this.fileList)
        .pipe(
          switchMap((result: ApiResponse) => {
            if (result.data['display_url'] && result.data['delete_url']) {
              this.connectionForm
                .get('avatar')
                ?.setValue([
                  result.data['display_url'],
                  result.data['delete_url'],
                ]);
            }
            const signUpForm = this.formatSignupForm({
              ...this.connectionForm.value,
              ...this.personalInfosForm.value,
            });
            return this.userService.signup(signUpForm);
          }),
        )
        .subscribe({
          next: () => {
            this.snackBar.open(
              'Inscription validée ! Authentifiez-vous dès maintenant pour échanger avec les autres utilisateurs',
              'OK',
              {
                duration: 5000,
              },
            );
            this.connectionForm.reset();
            this.personalInfosForm.reset();
            this.fileUpload?.resetFileInput();
            this.fileId = undefined;
            this.fileList = undefined;
            this.router.navigate(['/signin']);
          },
          error: (err) => {
            this.snackBar.open(
              "Désolé, une erreur est survenue. Veuillez vérifier que les informations fournies sont correctes avant de renouveler l'opération",
              'OK',
              {
                duration: 5000,
              },
            );
          },
        });
    } else {
      const signUpForm = this.formatSignupForm({
        ...this.connectionForm.value,
        ...this.personalInfosForm.value,
      });
      this.signupSubscription = this.userService.signup(signUpForm).subscribe({
        next: () => {
          this.snackBar.open(
            'Inscription validée ! Authentifiez-vous dès maintenant pour échanger avec les autres utilisateurs',
            'OK',
            {
              duration: 5000,
            },
          );
          this.connectionForm.reset();
          this.personalInfosForm.reset();
          this.fileUpload?.resetFileInput();
          this.fileId = undefined;
          this.fileList = undefined;
          this.router.navigate(['/signin']);
        },
        error: (err) => {
          this.snackBar.open(
            "Désolé, une erreur est survenue. Veuillez vérifier que les informations fournies sont correctes avant de renouveler l'opération",
            'OK',
            {
              duration: 5000,
            },
          );
        },
      });
    }
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
      this.connectionForm.get('avatar')?.setValue('');
      this.fileUpload.resetFileInput();
      this.fileList = undefined;
      this.snackBar.open('Désolé, ce fichier est trop volumineux', 'OK', {
        duration: 5000,
      });
      return;
    }
    this.fileList = fileList;
  }

  uploadFile(fileList: FileList): Observable<ApiResponse> {
    this.fileId = nanoid();
    return this.uploadService.uploadFile(fileList[0], this.fileId);
  }

  ngOnDestroy() {
    if (this.signupSubscription) {
      this.signupSubscription.unsubscribe();
    }
  }
}
