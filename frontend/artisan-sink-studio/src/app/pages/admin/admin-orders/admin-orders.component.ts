import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { PricePipe } from '../../../shared/pipes/price.pipe';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, PricePipe, DatePipe, FormsModule],
  templateUrl: './admin-orders.component.html',
})
export class AdminOrdersComponent implements OnInit {
  private cartService = inject(CartService);
  orders: Order[] = [];
  statusFilter = '';
  loading = true;

  statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.cartService.adminGetOrders(1, this.statusFilter).subscribe({
      next: (res) => { this.orders = res.data.orders; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  updateStatus(orderId: string, status: string): void {
    this.cartService.adminUpdateStatus(orderId, status).subscribe({ next: () => this.load() });
  }
}
