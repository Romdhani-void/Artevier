import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PricePipe } from '../../shared/pipes/price.pipe';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';import { LanguageService } from '../../core/services/language.service';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, PricePipe],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  productService = inject(ProductService);
  languageService = inject(LanguageService);

  ngOnInit(): void {
    this.cartService.loadCart().subscribe();
  }

  updateQty(productId: string, quantity: number): void {
    if (quantity < 1) return;
    this.cartService.updateQuantity(productId, quantity).subscribe();
  }

  removeItem(productId: string): void {
    this.cartService.removeItem(productId).subscribe();
  }
}
