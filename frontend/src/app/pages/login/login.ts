import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-page">
      <!-- Animated background orbs -->
      <div class="bg-orb orb-1"></div>
      <div class="bg-orb orb-2"></div>
      <div class="bg-orb orb-3"></div>

      <div class="login-container animate-scale-in">
        <div class="login-card glass-card">
          <!-- Header -->
          <div class="login-header">
            <img src="assets/logo.png" alt="AL AMANA" class="brand-logo" />
            <p class="subtitle">Système de Gestion des Réclamations</p>
          </div>

          <!-- Error message -->
          @if (errorMessage()) {
            <div class="error-banner animate-fade-in">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>
              </svg>
              {{ errorMessage() }}
            </div>
          }

          <!-- Form -->
          <form (ngSubmit)="onSubmit()" class="login-form">
            <div class="form-group">
              <label class="form-label" for="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                class="form-input"
                [(ngModel)]="email"
                name="email"
                placeholder="votre@email.com"
                required
                autocomplete="email"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="login-password">Mot de passe</label>
              <input
                id="login-password"
                type="password"
                class="form-input"
                [(ngModel)]="password"
                name="password"
                placeholder="••••••••"
                required
                autocomplete="current-password"
              />
            </div>

            <button
              type="submit"
              class="btn btn-primary btn-lg w-full"
              [disabled]="authService.isLoading()"
              id="login-submit"
            >
              @if (authService.isLoading()) {
                <span class="spinner"></span>
                Connexion...
              } @else {
                Se connecter
              }
            </button>
          </form>

          <!-- Footer -->
          <div class="login-footer">
            <p>Pas encore de compte ? <a routerLink="/register" id="register-link">S'inscrire</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    .bg-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
      animation: float 8s ease-in-out infinite;
    }

    .orb-1 {
      width: 400px; height: 400px;
      background: var(--primary);
      top: -100px; left: -100px;
      animation-delay: 0s;
    }

    .orb-2 {
      width: 350px; height: 350px;
      background: var(--accent);
      bottom: -80px; right: -80px;
      animation-delay: -3s;
    }

    .orb-3 {
      width: 250px; height: 250px;
      background: var(--info);
      top: 50%; left: 60%;
      animation-delay: -5s;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -20px) scale(1.05); }
      66% { transform: translate(-20px, 15px) scale(0.95); }
    }

    .login-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 380px;
    }

    .login-card {
      padding: 32px 28px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .brand-logo {
      width: 180px;
      height: auto;
      max-height: 120px;
      object-fit: contain;
      margin-bottom: 12px;
    }

    .login-header .version {
      font-size: 0.875rem;
      font-weight: 400;
      opacity: 0.6;
    }

    .login-header .subtitle {
      color: var(--text-muted);
      font-size: 0.875rem;
      margin-top: 4px;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      border-radius: var(--radius-md);
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
      font-size: 0.8125rem;
      margin-bottom: 20px;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .login-footer {
      text-align: center;
      margin-top: 24px;
      font-size: 0.8125rem;
      color: var(--text-muted);
    }

    .login-footer a {
      color: var(--primary);
      font-weight: 500;
    }

    .login-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class Login {
  email = '';
  password = '';
  errorMessage = signal('');

  constructor(public authService: AuthService, private router: Router) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    this.errorMessage.set('');
    if (!this.email || !this.password) {
      this.errorMessage.set('Veuillez remplir tous les champs.');
      return;
    }

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => this.errorMessage.set(err.error?.error || 'Erreur de connexion.')
    });
  }
}
