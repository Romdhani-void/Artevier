import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PricePipe } from '../../../shared/pipes/price.pipe';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterLink, PricePipe, FormsModule],
  templateUrl: './admin-products.component.html',
})
export class AdminProductsComponent implements OnInit {
  productService = inject(ProductService);
  products: Product[] = [];
  search = '';
  loading = true;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.productService.adminGetProducts(1, this.search).subscribe({
      next: (res) => { this.products = res.data.products; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  deleteProduct(id: string): void {
    if (!confirm('Delete this product?')) return;
    this.productService.adminDeleteProduct(id).subscribe({ next: () => this.load() });
  }
}
