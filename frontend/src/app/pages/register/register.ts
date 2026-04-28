import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="register-page">
      <div class="bg-orb orb-1"></div>
      <div class="bg-orb orb-2"></div>

      <div class="register-container animate-scale-in">
        <div class="register-card glass-card">
          <!-- Success: Agent pending -->
          @if (pendingSuccess()) {
            <div class="pending-state">
              <div class="pending-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              </div>
              <h2>Demande envoyée !</h2>
              <p class="text-muted">Votre demande de compte agent a été soumise avec succès. Un administrateur doit approuver votre compte avant que vous puissiez vous connecter.</p>
              <a routerLink="/login" class="btn btn-primary btn-lg">Retour à la connexion</a>
            </div>
          } @else {
            <div class="register-header">
              <img src="assets/logo.png" alt="AL AMANA" class="brand-logo" />
              <p class="subtitle">Rejoignez la plateforme SGR</p>
            </div>

            @if (errorMessage()) {
              <div class="error-banner animate-fade-in">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>
                </svg>
                {{ errorMessage() }}
              </div>
            }

            <form (ngSubmit)="onSubmit()" class="register-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="reg-nom">Nom</label>
                  <input id="reg-nom" type="text" class="form-input" [(ngModel)]="nom" name="nom" placeholder="Votre nom" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="reg-prenom">Prénom</label>
                  <input id="reg-prenom" type="text" class="form-input" [(ngModel)]="prenom" name="prenom" placeholder="Votre prénom" required />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="reg-email">Email</label>
                  <input id="reg-email" type="email" class="form-input" [(ngModel)]="email" name="email" placeholder="votre@email.com" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="reg-password">Mot de passe</label>
                  <input id="reg-password" type="password" class="form-input" [(ngModel)]="password" name="password" placeholder="Min. 6 caractères" required />
                </div>
              </div>

              <!-- Role Selection -->
              <div class="form-group">
                <label class="form-label">Type de compte</label>
                <div class="role-selector">
                  <button type="button" class="role-option" [class.active]="selectedRole === 'client'" (click)="selectedRole = 'client'">
                    <div class="role-icon client-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
                    <div class="role-info">
                      <span class="role-name">Client</span>
                      <span class="role-desc">Soumettre des réclamations</span>
                    </div>
                    @if (selectedRole === 'client') {
                      <svg class="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>
                      </svg>
                    }
                  </button>

                  <button type="button" class="role-option" [class.active]="selectedRole === 'agent'" (click)="selectedRole = 'agent'">
                    <div class="role-icon agent-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    </div>
                    <div class="role-info">
                      <span class="role-name">Agent</span>
                      <span class="role-desc">Traiter les réclamations (approbation requise)</span>
                    </div>
                    @if (selectedRole === 'agent') {
                      <svg class="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>
                      </svg>
                    }
                  </button>
                </div>
              </div>

              <button type="submit" class="btn btn-accent btn-lg w-full" [disabled]="authService.isLoading()" id="register-submit">
                @if (authService.isLoading()) {
                  <span class="spinner"></span> Inscription...
                } @else if (selectedRole === 'agent') {
                  Soumettre la demande
                } @else {
                  S'inscrire
                }
              </button>
            </form>

            <div class="register-footer">
              <p>Déjà un compte ? <a routerLink="/login">Se connecter</a></p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-page {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
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

    .orb-1 { width: 400px; height: 400px; background: var(--accent); top: -80px; right: -80px; }
    .orb-2 { width: 350px; height: 350px; background: var(--primary); bottom: -100px; left: -60px; animation-delay: -4s; }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -20px) scale(1.05); }
      66% { transform: translate(-20px, 15px) scale(0.95); }
    }

    .register-container { position: relative; z-index: 1; width: 100%; max-width: 560px; }
    .register-card { padding: 14px 20px; }

    .register-header {
      text-align: center;
      margin-bottom: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .brand-logo {
      width: 100%;
      max-width: 180px;
      height: auto;
      max-height: 70px;
      object-fit: contain;
      margin-bottom: 4px;
    }

    .register-header .subtitle { color: var(--text-muted); font-size: 0.75rem; margin-top: 0; }
    .error-banner {
      display: flex; align-items: center; gap: 6px;
      padding: 6px 10px; border-radius: var(--radius-md);
      background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171; font-size: 0.75rem; margin-bottom: 6px;
    }

    .register-form { display: flex; flex-direction: column; gap: 8px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

    /* Custom form input shrinkage */
    .form-group { margin-bottom: 0; }
    .form-label { font-size: 0.75rem; margin-bottom: 2px; }
    .form-input { padding: 6px 10px; font-size: 0.8125rem; }

    /* Role Selector */
    .role-selector {
      display: flex;
      flex-direction: row;
      gap: 8px;
      margin-bottom: 4px;
    }

    .role-option {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 8px;
      border-radius: var(--radius-md);
      border: 1px solid var(--glass-border);
      background: var(--bg-input);
      cursor: pointer;
      transition: all var(--transition-fast);
      text-align: center;
      position: relative;
    }

    .role-option:hover {
      border-color: var(--glass-border-hover);
      background: rgba(255, 255, 255, 0.05);
    }

    .role-option.active {
      border-color: var(--primary);
      background: rgba(14, 165, 233, 0.08);
    }

    .role-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px; height: 24px;
      border-radius: var(--radius-md);
    }
    .role-icon svg { width: 14px; height: 14px; }

    .client-icon { background: rgba(16, 185, 129, 0.15); color: var(--accent); }
    .agent-icon { background: rgba(14, 165, 233, 0.15); color: var(--primary); }

    .role-info { display: flex; flex-direction: column; gap: 2px; }
    .role-name { font-size: 0.875rem; font-weight: 600; color: var(--text); }
    .role-desc { font-size: 0.6875rem; color: var(--text-muted); line-height: 1.2; }

    .check-icon { 
      position: absolute;
      top: 8px;
      right: 8px;
      color: var(--primary); 
      width: 16px;
      height: 16px;
    }

    /* Pending State */
    .pending-state {
      text-align: center;
      padding: 20px 0;
    }

    .pending-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 80px; height: 80px;
      border-radius: var(--radius-full);
      background: rgba(245, 158, 11, 0.15);
      color: var(--warning);
      margin-bottom: 20px;
    }

    .pending-state h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text);
      margin-bottom: 12px;
    }

    .pending-state p {
      max-width: 340px;
      margin: 0 auto 24px;
      line-height: 1.6;
    }

    .register-footer { text-align: center; margin-top: 24px; font-size: 0.8125rem; color: var(--text-muted); }
    .register-footer a { color: var(--accent); font-weight: 500; }
    .register-footer a:hover { text-decoration: underline; }
  `]
})
export class Register {
  nom = '';
  prenom = '';
  email = '';
  password = '';
  selectedRole: 'client' | 'agent' = 'client';
  errorMessage = signal('');
  pendingSuccess = signal(false);

  constructor(public authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage.set('');
    if (!this.nom || !this.prenom || !this.email || !this.password) {
      this.errorMessage.set('Veuillez remplir tous les champs.');
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage.set('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    this.authService.register({
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      password: this.password,
      role: this.selectedRole
    }).subscribe({
      next: (res) => {
        if (res.pending) {
          // Agent — show pending message
          this.pendingSuccess.set(true);
        } else {
          // Client — redirect to dashboard
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => this.errorMessage.set(err.error?.error || 'Erreur lors de l\'inscription.')
    });
  }
}
