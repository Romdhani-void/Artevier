import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { PricePipe } from '../../shared/pipes/price.pipe';
import { CartService } from '../../core/services/cart.service';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, PricePipe, DatePipe],
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);

  orders: Order[] = [];
  selectedOrder: Order | null = null;
  loading = true;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.cartService.getOrder(params['id']).subscribe({
          next: (res) => { this.selectedOrder = res.data; this.loading = false; },
          error: () => { this.loading = false; },
        });
      } else {
        this.cartService.getOrders().subscribe({
          next: (res) => { this.orders = res.data.orders; this.loading = false; },
          error: () => { this.loading = false; },
        });
      }
    });
  }

  statusColor(status: string): string {
    const colors: Record<string, string> = {
      Pending: 'text-yellow-400', Processing: 'text-blue-400',
      Shipped: 'text-purple-400', Delivered: 'text-green-400', Cancelled: 'text-red-400',
    };
    return colors[status] || 'text-dark-400';
  }
}
