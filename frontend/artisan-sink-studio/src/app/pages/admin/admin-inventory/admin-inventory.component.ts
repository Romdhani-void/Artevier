import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PricePipe } from '../../../shared/pipes/price.pipe';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-admin-inventory',
  standalone: true,
  imports: [CommonModule, RouterLink, PricePipe],
  templateUrl: './admin-inventory.component.html',
})
export class AdminInventoryComponent implements OnInit {
  productService = inject(ProductService);
  totalProducts = 0;
  lowStockItems: Product[] = [];
  loading = true;

  ngOnInit(): void {
    this.productService.adminGetInventory().subscribe({
      next: (res) => {
        this.totalProducts = res.data.totalProducts;
        this.lowStockItems = res.data.lowStockItems;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }
}
