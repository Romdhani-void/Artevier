import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/user.model';
import { ReviewsResponse } from '../models/review.model';
import { ContactForm } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor(private http: HttpClient) {}

  getReviews(productId: string, page = 1) {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<ApiResponse<ReviewsResponse>>(`${environment.apiUrl}/reviews/${productId}`, { params });
  }

  createReview(productId: string, rating: number, comment: string) {
    return this.http.post<ApiResponse<unknown>>(`${environment.apiUrl}/reviews/${productId}`, { rating, comment });
  }

  submitContact(form: ContactForm) {
    return this.http.post<ApiResponse<{ message: string }>>(`${environment.apiUrl}/contact`, form);
  }
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  getUsers(page = 1, search = '') {
    const params = new HttpParams().set('page', page).set('limit', '10').set('search', search);
    return this.http.get<ApiResponse<{ users: import('../models/user.model').User[]; total: number; page: number; pages: number }>>(
      `${environment.apiUrl}/admin/users`,
      { params }
    );
  }

  updateUserRole(userId: string, role: string) {
    return this.http.put<ApiResponse<import('../models/user.model').User>>(
      `${environment.apiUrl}/admin/users/${userId}/role`,
      { role }
    );
  }

  deleteUser(userId: string) {
    return this.http.delete<ApiResponse<{ message: string }>>(`${environment.apiUrl}/admin/users/${userId}`);
  }
}
