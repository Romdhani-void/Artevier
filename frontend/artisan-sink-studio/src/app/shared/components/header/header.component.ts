import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { LanguageService } from '../../../core/services/language.service';

import { CurrencyToggleComponent } from '../currency-toggle/currency-toggle.component';
import { LanguageToggleComponent } from '../language-toggle/language-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, CurrencyToggleComponent, LanguageToggleComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  auth = inject(AuthService);
  cart = inject(CartService);
  languageService = inject(LanguageService);
  mobileMenuOpen = false;

  toggleMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  logout(): void {
    this.auth.logout();
    this.mobileMenuOpen = false;
  }
}
