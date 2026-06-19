import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PricePipe } from '../../shared/pipes/price.pipe';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';
import { LanguageService } from '../../core/services/language.service';
import { ShippingAddress } from '../../core/models/order.model';
import { getErrorMessage } from '../../core/handlers/global-error.handler';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PricePipe],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  cartService = inject(CartService);
  auth = inject(AuthService);
  productService = inject(ProductService);
  languageService = inject(LanguageService);
  private router = inject(Router);

  loading = false;
  error = '';

  form = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    street: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zipCode: ['', Validators.required],
    country: ['USA'],
  });

  constructor() {
    const user = this.auth.currentUser();
    if (user) {
      this.form.patchValue({
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || '',
      });
    }
    this.cartService.loadCart().subscribe();
  }

  onSubmit(): void {
    if (this.form.invalid || this.cartService.cart().items.length === 0) return;
    this.loading = true;
    this.error = '';
    this.cartService.checkout(this.form.value as ShippingAddress).subscribe({
      next: (res) => this.router.navigate(['/orders', res.data._id]),
      error: (err) => { this.error = getErrorMessage(err); this.loading = false; },
      complete: () => { this.loading = false; },
    });
  }
}
