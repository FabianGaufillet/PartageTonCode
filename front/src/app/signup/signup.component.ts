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
import { Subscription } from 'rxjs';
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
  standalone: true,
})
export class SignupComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly uploadService = inject(UploadService);
  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private uploadSubscription?: Subscription;
  private signupSubscription?: Subscription;
  private fileUpload?: MatFileUploadComponent;
  public connectionForm: FormGroup = this.formBuilder.group({});
  public personalInfosForm: FormGroup = this.formBuilder.group({});
  public hide = signal(true);
  public fileId?: string;
  public genders = genders;
  public maxBirthDate = this.calculateMaxBirthDate();

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
        this.router.navigate(['/signin']);
      },
      error: (err) => {
        // TODO : utiliser err pour afficher un message d'erreur plus explicite
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

  onSelectedFilesChanged(
    fileList: FileList,
    fileUpload: MatFileUploadComponent,
  ): void {
    if (!fileList.length) {
      return;
    }
    const file = fileList[0];
    this.fileUpload = fileUpload;
    if (file.size > uploadLimit) {
      this.connectionForm.get('avatar')?.setValue('');
      this.fileUpload.resetFileInput();
      this.snackBar.open('Désolé, ce fichier est trop volumineux', 'OK', {
        duration: 5000,
      });
      return;
    }
    this.uploadFile(fileList);
  }

  uploadFile(fileList: FileList): void {
    if (!fileList.length) {
      return;
    }
    const extension = fileList[0].name.split('.').pop();
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }
    if (!this.fileId) {
      this.fileId = nanoid();
    }
    this.uploadSubscription = this.uploadService
      .uploadFile(fileList[0], this.fileId)
      .subscribe({
        next: () => {
          this.connectionForm.controls['avatar'].setValue(
            this.fileId + '.' + extension,
          );
          this.snackBar.open('Image importée avec succès', 'OK', {
            duration: 5000,
          });
        },
        error: () => {
          this.connectionForm.get('avatar')?.setValue('');
          this.fileUpload?.resetFileInput();
          this.snackBar.open(
            "Désolé, une erreur est survenue, votre image n'a pas été importée",
            'OK',
            {
              duration: 5000,
            },
          );
        },
      });
  }

  ngOnDestroy() {
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
    }
    if (this.signupSubscription) {
      this.signupSubscription.unsubscribe();
    }
  }
}
