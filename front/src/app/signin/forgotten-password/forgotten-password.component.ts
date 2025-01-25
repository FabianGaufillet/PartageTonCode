import { Component, inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MatDialogContent,
  MatDialogTitle,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { emailRegex } from '../../utils/constants';

@Component({
  selector: 'app-forgotten-password',
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatFormFieldModule,
    FormsModule,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    MatInput,
    MatButtonModule,
  ],
  templateUrl: './forgotten-password.component.html',
  styleUrl: './forgotten-password.component.scss',
})
export class ForgottenPasswordComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<ForgottenPasswordComponent>);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  public emailForm: FormGroup = this.formBuilder.group({});

  constructor() {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(emailRegex)]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
