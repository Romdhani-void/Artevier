import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { PricePipe } from '../../shared/pipes/price.pipe';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { LanguageService } from '../../core/services/language.service';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, PricePipe, DatePipe],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  private cartService = inject(CartService);
  languageService = inject(LanguageService);
  recentOrders: Order[] = [];

  ngOnInit(): void {
    this.cartService.getOrders(1).subscribe({
      next: (res) => { this.recentOrders = res.data.orders.slice(0, 3); },
    });
  }
}
