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
  private readonly formBuilder = inject(NonNullableFormBuilder);

  public postForm: FormGroup = this.formBuilder.group({});

  constructor() {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.postForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
    });
  }

  publish() {
    // TODO : publier le post de l'utilisateur
  }

  cancel() {
    this.postForm.reset();
  }

  ngOnDestroy() {}
}
