import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';
import { getErrorMessage } from '../../core/handlers/global-error.handler';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  auth = inject(AuthService);
  private fb = inject(FormBuilder);
  languageService = inject(LanguageService);

  message = '';
  error = '';
  loading = false;
  passwordLoading = false;

  profileForm = this.fb.group({
    firstName: [this.auth.currentUser()?.firstName || '', Validators.required],
    lastName: [this.auth.currentUser()?.lastName || '', Validators.required],
    phone: [this.auth.currentUser()?.phone || ''],
    address: [this.auth.currentUser()?.address || ''],
  });

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  updateProfile(): void {
    if (this.profileForm.invalid) return;
    this.loading = true;
    this.auth.updateProfile(this.profileForm.value as Partial<import('../../core/models/user.model').User>).subscribe({
      next: () => { this.message = this.languageService.t('profile.updated'); this.loading = false; },
      error: (err) => { this.error = getErrorMessage(err); this.loading = false; },
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;
    this.passwordLoading = true;
    const { currentPassword, newPassword } = this.passwordForm.value;
    this.auth.changePassword(currentPassword!, newPassword!).subscribe({
      next: () => { this.message = this.languageService.t('profile.passwordChanged'); this.passwordForm.reset(); this.passwordLoading = false; },
      error: (err) => { this.error = getErrorMessage(err); this.passwordLoading = false; },
    });
  }
}
