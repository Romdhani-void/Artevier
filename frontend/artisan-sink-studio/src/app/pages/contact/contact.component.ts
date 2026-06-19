import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../core/services/review.service';
import { LanguageService } from '../../core/services/language.service';
import { getErrorMessage } from '../../core/handlers/global-error.handler';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private reviewService = inject(ReviewService);
  languageService = inject(LanguageService);

  loading = false;
  message = '';
  error = '';

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.maxLength(200)]],
    message: ['', [Validators.required, Validators.maxLength(2000)]],
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.reviewService.submitContact(this.form.value as import('../../core/models/review.model').ContactForm).subscribe({
      next: () => { this.message = this.languageService.t('contact.sent'); this.form.reset(); this.loading = false; },
      error: (err) => { this.error = getErrorMessage(err); this.loading = false; },
    });
  }
}
