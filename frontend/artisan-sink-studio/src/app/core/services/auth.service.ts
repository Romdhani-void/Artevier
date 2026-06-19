import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, AuthResponse, ApiResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'cuisine_token';
  private readonly USER_KEY = 'cuisine_user';

  currentUser = signal<User | null>(this.loadUser());
  isAuthenticated = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor(private http: HttpClient, private router: Router) {}

  private loadUser(): User | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  register(data: { firstName: string; lastName: string; email: string; password: string; phone?: string }) {
    return this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/register`, data).pipe(
      tap((res) => this.setSession(res.data))
    );
  }

  login(email: string, password: string) {
    return this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap((res) => this.setSession(res.data))
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  getProfile() {
    return this.http.get<ApiResponse<User>>(`${environment.apiUrl}/users/profile`).pipe(
      tap((res) => {
        this.currentUser.set(res.data);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.data));
      })
    );
  }

  updateProfile(data: Partial<User>) {
    return this.http.put<ApiResponse<User>>(`${environment.apiUrl}/users/profile`, data).pipe(
      tap((res) => {
        this.currentUser.set(res.data);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.data));
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.put<ApiResponse<{ message: string }>>(`${environment.apiUrl}/users/change-password`, {
      currentPassword,
      newPassword,
    });
  }

  private setSession(data: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, data.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
    this.currentUser.set(data.user);
  }
}
