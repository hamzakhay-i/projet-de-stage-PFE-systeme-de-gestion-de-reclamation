import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReclamationService } from '../../../services/reclamation.service';
import { Sidebar } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-reclamation-form',
  imports: [CommonModule, FormsModule, Sidebar],
  template: `
    <div class="form-layout">
      <app-sidebar />
      <main class="main-content">
        <div class="page-header animate-fade-in">
          <h1 class="page-title">Nouvelle réclamation</h1>
        </div>

        <div class="glass-card form-card animate-fade-in">
          @if (successMessage()) {
            <div class="success-banner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>
              </svg>
              {{ successMessage() }}
            </div>
          }

          @if (errorMessage()) {
            <div class="error-banner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>
              </svg>
              {{ errorMessage() }}
            </div>
          }

          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label class="form-label" for="rec-titre">Titre</label>
              <input id="rec-titre" type="text" class="form-input" [(ngModel)]="titre" name="titre"
                placeholder="Résumez votre réclamation" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="rec-description">Description</label>
              <textarea id="rec-description" class="form-textarea" [(ngModel)]="description" name="description"
                placeholder="Décrivez votre problème en détail..." rows="6" required></textarea>
            </div>

            <div class="form-group">
              <label class="form-label" for="rec-priorite">Priorité</label>
              <select id="rec-priorite" class="form-select" [(ngModel)]="priorite" name="priorite">
                <option value="normale">Normale</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-ghost" (click)="goBack()">Annuler</button>
              <button type="submit" class="btn btn-primary btn-lg" [disabled]="isSubmitting()" id="submit-reclamation">
                @if (isSubmitting()) {
                  <span class="spinner"></span> Envoi...
                } @else {
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/>
                  </svg>
                  Soumettre
                }
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .form-layout { display: flex; min-height: 100vh; }
    .main-content { flex: 1; margin-left: var(--sidebar-width); padding: 32px; position: relative; z-index: 1; }

    .form-card {
      max-width: 640px;
      padding: 32px;
    }

    .form-card form {
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 8px;
    }

    .success-banner {
      display: flex; align-items: center; gap: 8px;
      padding: 14px 18px; border-radius: var(--radius-md);
      background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399; font-size: 0.875rem; margin-bottom: 20px;
    }

    .error-banner {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 16px; border-radius: var(--radius-md);
      background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171; font-size: 0.8125rem; margin-bottom: 20px;
    }

    @media (max-width: 768px) {
      .main-content { margin-left: 0; padding: 20px 16px; }
    }
  `]
})
export class ReclamationForm {
  titre = '';
  description = '';
  priorite = 'normale';
  isSubmitting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  constructor(
    private reclamationService: ReclamationService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.successMessage.set('');
    this.errorMessage.set('');

    if (!this.titre || !this.description) {
      this.errorMessage.set('Titre et description sont obligatoires.');
      return;
    }

    this.isSubmitting.set(true);
    this.reclamationService.create({ titre: this.titre, description: this.description, priorite: this.priorite }).subscribe({
      next: () => {
        this.successMessage.set('Réclamation créée avec succès !');
        this.isSubmitting.set(false);
        setTimeout(() => this.router.navigate(['/reclamations']), 1500);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.error || 'Erreur lors de la soumission.');
        this.isSubmitting.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/reclamations']);
  }
}
