import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed()">
      <!-- Logo -->
      <div class="sidebar-logo">
        <img src="assets/logo.png" alt="AL AMANA" class="brand-logo" [class.collapsed-logo]="isCollapsed()" />
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          @if (!isCollapsed()) { <span>Tableau de bord</span> }
        </a>

        <a routerLink="/reclamations" routerLinkActive="active" class="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="1"/>
            <path d="M9 14l2 2 4-4"/>
          </svg>
          @if (!isCollapsed()) { <span>Réclamations</span> }
        </a>

        @if (authService.userRole() === 'client') {
          <a routerLink="/reclamations/new" routerLinkActive="active" class="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v8M8 12h8"/>
            </svg>
            @if (!isCollapsed()) { <span>Nouvelle réclamation</span> }
          </a>
        }

        @if (authService.userRole() === 'admin') {
          <a routerLink="/admin/users" routerLinkActive="active" class="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/>
              <path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
            @if (!isCollapsed()) { <span>Gérer utilisateurs</span> }
          </a>
        }
      </nav>

      <!-- User info + Logout -->
      <div class="sidebar-footer">
        @if (!isCollapsed()) {
          <div class="user-info">
            <div class="user-avatar">
              {{ getInitials() }}
            </div>
            <div class="user-details">
              <span class="user-name">{{ authService.currentUser()?.prenom }} {{ authService.currentUser()?.nom }}</span>
              <span class="user-role badge" [class]="'badge-' + authService.userRole()">{{ authService.userRole() }}</span>
            </div>
          </div>
        }

        <button class="nav-item logout-btn" (click)="authService.logout()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16,17 21,12 16,7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          @if (!isCollapsed()) { <span>Déconnexion</span> }
        </button>
      </div>

    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      width: var(--sidebar-width);
      height: 100vh;
      background: var(--bg-sidebar);
      backdrop-filter: blur(30px);
      -webkit-backdrop-filter: blur(30px);
      border-right: 1px solid var(--glass-border);
      display: flex;
      flex-direction: column;
      padding: 20px 12px;
      z-index: 100;
      transition: width var(--transition-base);
      overflow: hidden;
    }

    .sidebar.collapsed {
      width: 68px;
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px 12px;
      margin-bottom: 24px;
    }

    .brand-logo {
      width: 180px;
      height: auto;
      max-height: 100px;
      object-fit: contain;
      transition: all var(--transition-base);
    }

    .brand-logo.collapsed-logo {
      width: 44px;
      height: 44px;
    }

    .sidebar-nav {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 14px;
      border-radius: var(--radius-md);
      color: var(--text-muted);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      text-decoration: none;
      white-space: nowrap;
    }

    .nav-item:hover {
      color: var(--text);
      background: rgba(255, 255, 255, 0.05);
    }

    .nav-item.active {
      color: var(--primary);
      background: rgba(14, 165, 233, 0.1);
      border-left: 3px solid var(--primary);
      padding-left: 11px;
    }

    .nav-item svg {
      min-width: 20px;
    }

    .sidebar-footer {
      margin-top: auto;
      padding-top: 16px;
      border-top: 1px solid var(--glass-border);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      min-width: 36px;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--primary), var(--accent));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8125rem;
      font-weight: 600;
      color: white;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
      overflow: hidden;
    }

    .user-name {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: 0.625rem;
      width: fit-content;
    }

    .logout-btn {
      color: var(--danger) !important;
    }

    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.1) !important;
    }

    .toggle-btn {
      position: absolute;
      top: 50%;
      right: -14px;
      transform: translateY(-50%);
      width: 28px;
      height: 28px;
      border-radius: var(--radius-full);
      background: var(--bg-dark);
      border: 1px solid var(--glass-border);
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);
      z-index: 10;
    }

    .toggle-btn:hover {
      color: var(--text);
      border-color: var(--primary);
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
      }
    }
  `]
})
export class Sidebar {
  isCollapsed = signal(false);

  constructor(public authService: AuthService) {}

  toggleSidebar(): void {
    this.isCollapsed.update(v => !v);
  }

  getInitials(): string {
    const user = this.authService.currentUser();
    if (!user) return '?';
    return (user.prenom[0] + user.nom[0]).toUpperCase();
  }
}
