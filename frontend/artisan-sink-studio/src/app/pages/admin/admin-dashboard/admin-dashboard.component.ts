import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { PricePipe } from '../../../shared/pipes/price.pipe';
import { CartService } from '../../../core/services/cart.service';
import { ProductService } from '../../../core/services/product.service';
import { AdminService } from '../../../core/services/review.service';
import { DashboardStats } from '../../../core/models/review.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, PricePipe, DatePipe],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private adminService = inject(AdminService);

  stats: DashboardStats | null = null;
  totalProducts = 0;
  totalUsers = 0;

  ngOnInit(): void {
    this.cartService.adminGetStats().subscribe({ next: (res) => { this.stats = res.data; } });
    this.productService.adminGetInventory().subscribe({ next: (res) => { this.totalProducts = res.data.totalProducts; } });
    this.adminService.getUsers(1).subscribe({ next: (res) => { this.totalUsers = res.data.total; } });
  }
}
