import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:3500/api/auth';

  // Signals for reactive state management
  private _currentUser = signal<User | null>(null);
  private _token = signal<string | null>(null);
  private _isLoading = signal(false);

  // Public readonly signals
  readonly currentUser = this._currentUser.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());
  readonly userRole = computed(() => this._currentUser()?.role || null);

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const token = localStorage.getItem('sgr_token');
    const userStr = localStorage.getItem('sgr_user');
    if (token && userStr) {
      try {
        this._token.set(token);
        this._currentUser.set(JSON.parse(userStr));
      } catch {
        this.clearStorage();
      }
    }
  }

  private clearStorage(): void {
    localStorage.removeItem('sgr_token');
    localStorage.removeItem('sgr_user');
    this._token.set(null);
    this._currentUser.set(null);
  }

  private saveToStorage(token: string, user: User): void {
    localStorage.setItem('sgr_token', token);
    localStorage.setItem('sgr_user', JSON.stringify(user));
    this._token.set(token);
    this._currentUser.set(user);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    this._isLoading.set(true);
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap({
        next: (res) => {
          if (res.token) {
            this.saveToStorage(res.token, res.user);
          }
          this._isLoading.set(false);
        },
        error: () => this._isLoading.set(false)
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    this._isLoading.set(true);
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap({
        next: (res) => {
          // Only save to storage if we got a token (client, not pending agent)
          if (res.token && !res.pending) {
            this.saveToStorage(res.token, res.user);
          }
          this._isLoading.set(false);
        },
        error: () => this._isLoading.set(false)
      })
    );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/profile`).pipe(
      tap((user) => {
        this._currentUser.set(user);
        localStorage.setItem('sgr_user', JSON.stringify(user));
      })
    );
  }

  logout(): void {
    this.clearStorage();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this._token();
  }
}
