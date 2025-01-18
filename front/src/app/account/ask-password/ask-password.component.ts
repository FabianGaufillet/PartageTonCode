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

@Component({
  selector: 'app-ask-password',
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
  templateUrl: './ask-password.component.html',
  styleUrl: './ask-password.component.scss',
})
export class AskPasswordComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<AskPasswordComponent>);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  public passwordForm: FormGroup = this.formBuilder.group({});

  constructor() {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required]],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
