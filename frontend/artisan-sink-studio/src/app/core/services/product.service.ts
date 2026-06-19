import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/user.model';
import { Product, ProductFilters, FilterOptions, ProductsResponse } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(filters: ProductFilters = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<ApiResponse<ProductsResponse>>(`${environment.apiUrl}/products`, { params });
  }

  getProduct(id: string) {
    return this.http.get<ApiResponse<Product>>(`${environment.apiUrl}/products/${id}`);
  }

  getProductBySlug(slug: string) {
    return this.http.get<ApiResponse<Product>>(`${environment.apiUrl}/products/slug/${slug}`);
  }

  getFeatured() {
    return this.http.get<ApiResponse<Product[]>>(`${environment.apiUrl}/products/featured`);
  }

  getBestSellers() {
    return this.http.get<ApiResponse<Product[]>>(`${environment.apiUrl}/products/best-sellers`);
  }

  getRelated(id: string) {
    return this.http.get<ApiResponse<Product[]>>(`${environment.apiUrl}/products/${id}/related`);
  }

  getFilterOptions() {
    return this.http.get<ApiResponse<FilterOptions>>(`${environment.apiUrl}/products/filters`);
  }

  getImageUrl(path: string): string {
    if (!path) return '/assets/placeholder-sink.jpg';
    if (path.startsWith('http')) return path;
    return `${environment.uploadsUrl}${path}`;
  }

  // Admin
  adminGetProducts(page = 1, search = '') {
    const params = new HttpParams().set('page', page).set('limit', '20').set('search', search);
    return this.http.get<ApiResponse<ProductsResponse>>(`${environment.apiUrl}/admin/products`, { params });
  }

  adminCreateProduct(formData: FormData) {
    return this.http.post<ApiResponse<Product>>(`${environment.apiUrl}/admin/products`, formData);
  }

  adminUpdateProduct(id: string, formData: FormData) {
    return this.http.put<ApiResponse<Product>>(`${environment.apiUrl}/admin/products/${id}`, formData);
  }

  adminDeleteProduct(id: string) {
    return this.http.delete<ApiResponse<{ message: string }>>(`${environment.apiUrl}/admin/products/${id}`);
  }

  adminGetInventory() {
    return this.http.get<ApiResponse<{ totalProducts: number; lowStockItems: Product[] }>>(
      `${environment.apiUrl}/admin/products/inventory`
    );
  }
}
