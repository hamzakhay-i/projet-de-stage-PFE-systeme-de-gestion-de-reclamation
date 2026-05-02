import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ReclamationService } from '../../services/reclamation.service';
import { ReclamationStats } from '../../models/reclamation.model';
import { Sidebar } from '../layout/sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, Sidebar],
  template: `
    <div class="dashboard-layout">
      <app-sidebar />
      <main class="main-content">
        <!-- Header -->
        <div class="page-header animate-fade-in">
          <div>
            <h1 class="page-title">Tableau de bord</h1>
            <p class="text-muted">Bienvenue, {{ authService.currentUser()?.prenom }} {{ authService.currentUser()?.nom }} 👋</p>
          </div>
          @if (authService.userRole() === 'client') {
            <a routerLink="/reclamations/new" class="btn btn-primary" id="new-reclamation-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
              </svg>
              Nouvelle réclamation
            </a>
          }
        </div>

        <!-- Stats -->
        @if (isLoading()) {
          <div class="loading-overlay">
            <div class="spinner spinner-lg"></div>
            <span>Chargement des statistiques...</span>
          </div>
        } @else {
          <div class="stats-grid stagger-children">
            <div class="glass-card stat-card animate-fade-in">
              <div class="stat-icon total-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                  <rect x="9" y="3" width="6" height="4" rx="1"/>
                </svg>
              </div>
              <div class="stat-value">{{ stats()?.total || 0 }}</div>
              <div class="stat-label">Total réclamations</div>
            </div>

            <div class="glass-card stat-card animate-fade-in">
              <div class="stat-icon pending-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
                </svg>
              </div>
              <div class="stat-value warning-text">{{ stats()?.en_attente || 0 }}</div>
              <div class="stat-label">En attente</div>
            </div>

            <div class="glass-card stat-card animate-fade-in">
              <div class="stat-icon progress-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
              </div>
              <div class="stat-value info-text">{{ stats()?.en_cours || 0 }}</div>
              <div class="stat-label">En cours</div>
            </div>

            <div class="glass-card stat-card animate-fade-in">
              <div class="stat-icon resolved-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
              </div>
              <div class="stat-value accent-text">{{ stats()?.resolue || 0 }}</div>
              <div class="stat-label">Résolues</div>
            </div>

            <div class="glass-card stat-card animate-fade-in">
              <div class="stat-icon rejected-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>
                </svg>
              </div>
              <div class="stat-value danger-text">{{ stats()?.rejetee || 0 }}</div>
              <div class="stat-label">Rejetées</div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="quick-actions animate-fade-in mt-lg">
            <h2 class="section-title">Actions rapides</h2>
            <div class="actions-grid">
              <a routerLink="/reclamations" class="action-card glass-card">
                <div class="action-icon primary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </div>
                <span>Voir les réclamations</span>
              </a>

              @if (authService.userRole() === 'admin') {
                <a routerLink="/admin/users" class="action-card glass-card">
                  <div class="action-icon accent">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                      <path d="M16 3.13a4 4 0 010 7.75"/>
                    </svg>
                  </div>
                  <span>Gérer les utilisateurs</span>
                </a>
              }
            </div>
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      display: flex;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      margin-left: var(--sidebar-width);
      padding: 32px;
      position: relative;
      z-index: 1;
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      margin: 0 auto 12px;
    }

    .total-icon { background: rgba(14, 165, 233, 0.15); color: var(--primary); }
    .pending-icon { background: rgba(245, 158, 11, 0.15); color: var(--warning); }
    .progress-icon { background: rgba(59, 130, 246, 0.15); color: var(--info); }
    .resolved-icon { background: rgba(16, 185, 129, 0.15); color: var(--accent); }
    .rejected-icon { background: rgba(239, 68, 68, 0.15); color: var(--danger); }

    .warning-text { -webkit-text-fill-color: var(--warning); }
    .info-text { -webkit-text-fill-color: var(--info); }
    .accent-text { -webkit-text-fill-color: var(--accent); }
    .danger-text { -webkit-text-fill-color: var(--danger); }

    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 16px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .action-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      text-decoration: none;
      color: var(--text-secondary);
      transition: all var(--transition-base);
    }

    .action-card:hover {
      color: var(--text);
      transform: translateY(-2px);
    }

    .action-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      min-width: 44px;
      border-radius: var(--radius-md);
    }

    .action-icon.primary { background: rgba(14, 165, 233, 0.15); color: var(--primary); }
    .action-icon.accent { background: rgba(16, 185, 129, 0.15); color: var(--accent); }

    .action-card span {
      font-size: 0.9375rem;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
        padding: 20px 16px;
      }
    }
  `]
})
export class Dashboard implements OnInit {
  stats = signal<ReclamationStats | null>(null);
  isLoading = signal(true);

  constructor(
    public authService: AuthService,
    private reclamationService: ReclamationService
  ) {}

  ngOnInit(): void {
    this.reclamationService.getStats().subscribe({
      next: (data: ReclamationStats) => {
        this.stats.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
