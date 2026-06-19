import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/user.model';
import { Cart, ShippingAddress, Order, OrdersResponse } from '../models/order.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  cart = signal<Cart>({ items: [], total: 0, itemCount: 0 });
  itemCount = computed(() => this.cart().itemCount);

  constructor(private http: HttpClient, private authService: AuthService) {
    if (this.authService.isAuthenticated()) {
      this.loadCart().subscribe();
    }
  }

  loadCart() {
    return this.http.get<ApiResponse<Cart>>(`${environment.apiUrl}/cart`).pipe(
      tap((res) => this.cart.set(res.data)),
      catchError(() => {
        this.cart.set({ items: [], total: 0, itemCount: 0 });
        return of(null);
      })
    );
  }

  addItem(productId: string, quantity = 1) {
    return this.http.post<ApiResponse<Cart>>(`${environment.apiUrl}/cart/items`, { productId, quantity }).pipe(
      tap((res) => this.cart.set(res.data))
    );
  }

  updateQuantity(productId: string, quantity: number) {
    return this.http.put<ApiResponse<Cart>>(`${environment.apiUrl}/cart/items/${productId}`, { quantity }).pipe(
      tap((res) => this.cart.set(res.data))
    );
  }

  removeItem(productId: string) {
    return this.http.delete<ApiResponse<Cart>>(`${environment.apiUrl}/cart/items/${productId}`).pipe(
      tap((res) => this.cart.set(res.data))
    );
  }

  clearCart() {
    return this.http.delete<ApiResponse<Cart>>(`${environment.apiUrl}/cart`).pipe(
      tap((res) => this.cart.set(res.data))
    );
  }

  checkout(shippingAddress: ShippingAddress) {
    return this.http.post<ApiResponse<Order>>(`${environment.apiUrl}/orders/checkout`, { shippingAddress }).pipe(
      tap(() => this.cart.set({ items: [], total: 0, itemCount: 0 }))
    );
  }

  getOrders(page = 1) {
    return this.http.get<ApiResponse<OrdersResponse>>(`${environment.apiUrl}/orders`, {
      params: { page: page.toString() },
    });
  }

  getOrder(id: string) {
    return this.http.get<ApiResponse<Order>>(`${environment.apiUrl}/orders/${id}`);
  }

  // Admin
  adminGetOrders(page = 1, status = '') {
    const params: Record<string, string> = { page: page.toString() };
    if (status) params['status'] = status;
    return this.http.get<ApiResponse<OrdersResponse>>(`${environment.apiUrl}/admin/orders`, { params });
  }

  adminUpdateStatus(orderId: string, status: string) {
    return this.http.put<ApiResponse<Order>>(`${environment.apiUrl}/admin/orders/${orderId}/status`, { status });
  }

  adminGetStats() {
    return this.http.get<ApiResponse<import('../models/review.model').DashboardStats>>(
      `${environment.apiUrl}/admin/stats`
    );
  }
}
