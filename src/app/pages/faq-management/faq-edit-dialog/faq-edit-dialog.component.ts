import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Faq, FaqStatus } from '../../../models/faq.models';
import { SHARED_IMPORTS } from '../../../shared-imports';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

type FaqFormGroup = FormGroup<{
  question: FormControl<string>;
  answer: FormControl<string>;
  category: FormControl<string>;
  status: FormControl<FaqStatus>;
  tags: FormArray<FormControl<string>>;
}>;

@Component({
  selector: 'app-faq-edit-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...SHARED_IMPORTS],
  templateUrl: './faq-edit-dialog.component.html',
  styleUrl: './faq-edit-dialog.component.css'
})
export class FaqEditDialogComponent {
  form!: FaqFormGroup;
  tagInput = new FormControl('', { nonNullable: true });

  get tags(): FormArray<FormControl<string>> {
    return this.form.controls.tags;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit'; faq?: Faq },
    private ref: MatDialogRef<FaqEditDialogComponent>,
    private fb: FormBuilder
  ) {
    // strongly-typed controls
    this.form = this.fb.group({
      question: this.fb.nonNullable.control<string>('', [Validators.required, Validators.minLength(8)]),
      answer:   this.fb.nonNullable.control<string>('', [Validators.required, Validators.minLength(10)]),
      category: this.fb.nonNullable.control<string>(''),
      status:   this.fb.nonNullable.control<FaqStatus>('draft', { validators: [Validators.required] }),
      tags:     this.fb.array<FormControl<string>>([])
    });

    if (data.mode === 'edit' && data.faq) {
      const { question, answer, category, status, tags } = data.faq;
      this.form.patchValue({ question, answer, category: category ?? '', status });
      (tags || []).forEach(t => this.tags.push(new FormControl(t, { nonNullable: true })));
    }
  }

  addTag(): void {
    const v = this.tagInput.value.trim();
    if (!v) return;
    this.tags.push(new FormControl(v, { nonNullable: true }));
    this.tagInput.setValue('');
  }

  removeTag(i: number): void { this.tags.removeAt(i); }

  close(): void { this.ref.close(); }

  save(): void {
    if (this.form.invalid) return;
    const { question, answer, category, status } = this.form.getRawValue();
    this.ref.close({
      question,
      answer,
      category: category || undefined,
      status,
      tags: this.tags.controls.map(c => c.value)
    });
  }
}