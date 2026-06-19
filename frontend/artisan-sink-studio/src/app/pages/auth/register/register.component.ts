import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';
import { getErrorMessage } from '../../../core/handlers/global-error.handler';

function passwordMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  languageService = inject(LanguageService);

  loading = false;
  error = '';

  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/\d/)]],
    confirmPassword: ['', Validators.required],
  }, { validators: passwordMatch });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { confirmPassword, ...data } = this.form.value;
    this.auth.register(data as { firstName: string; lastName: string; email: string; password: string; phone?: string }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => { this.error = getErrorMessage(err); this.loading = false; },
      complete: () => { this.loading = false; },
    });
  }
}
