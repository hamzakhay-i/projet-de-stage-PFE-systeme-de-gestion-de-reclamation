import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { Sidebar } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-manage-users',
  imports: [CommonModule, FormsModule, Sidebar],
  template: `
    <div class="users-layout">
      <app-sidebar />
      <main class="main-content">
        <div class="page-header animate-fade-in">
          <h1 class="page-title">Gestion des utilisateurs</h1>
          <button class="btn btn-primary" (click)="openCreateModal()" id="btn-add-user">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
            Ajouter un utilisateur
          </button>
        </div>

        <!-- Pending Agents Section -->
        @if (pendingAgents().length > 0) {
          <div class="pending-section animate-fade-in">
            <div class="section-header">
              <h2 class="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
                </svg>
                Demandes d'agents en attente
                <span class="pending-count">{{ pendingAgents().length }}</span>
              </h2>
            </div>
            <div class="pending-grid">
              @for (agent of pendingAgents(); track agent.id) {
                <div class="pending-card glass-card animate-scale-in">
                  <div class="pending-card-header">
                    <div class="pending-avatar">
                      {{ getInitials(agent) }}
                    </div>
                    <div class="pending-info">
                      <span class="pending-name">{{ agent.prenom }} {{ agent.nom }}</span>
                      <span class="pending-email">{{ agent.email }}</span>
                    </div>
                  </div>
                  <div class="pending-meta">
                    <span class="badge badge-agent">Agent</span>
                    <span class="text-muted">{{ formatDate(agent.created_at) }}</span>
                  </div>
                  <div class="pending-actions">
                    <button class="btn btn-accent" (click)="approveAgent(agent)" id="approve-btn-{{agent.id}}">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20,6 9,17 4,12"/>
                      </svg>
                      Accepter
                    </button>
                    <button class="btn btn-danger" (click)="rejectAgent(agent)" id="reject-btn-{{agent.id}}">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                      Rejeter
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- All Users Table -->
        @if (isLoading()) {
          <div class="loading-overlay">
            <div class="spinner spinner-lg"></div>
            <span>Chargement...</span>
          </div>
        } @else {
          <div class="glass-card table-card animate-fade-in">
            <div class="table-header-bar">
              <h2 class="section-title">Tous les utilisateurs</h2>
              <span class="text-muted">{{ users().length }} utilisateur(s)</span>
            </div>
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom complet</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>Inscrit le</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (user of users(); track user.id) {
                    <tr>
                      <td><span class="id-cell">#{{ user.id }}</span></td>
                      <td>
                        <div class="user-cell">
                          <div class="mini-avatar">{{ getInitials(user) }}</div>
                          <span>{{ user.prenom }} {{ user.nom }}</span>
                        </div>
                      </td>
                      <td>{{ user.email }}</td>
                      <td><span class="badge" [class]="'badge-' + user.role">{{ user.role }}</span></td>
                      <td>
                        @if (user.approved) {
                          <span class="status-dot approved"></span> Actif
                        } @else {
                          <span class="status-dot pending"></span> En attente
                        }
                      </td>
                      <td><span class="text-muted">{{ formatDate(user.created_at) }}</span></td>
                      <td>
                        <div class="action-buttons">
                          <button class="btn btn-ghost btn-sm" (click)="openEditModal(user)" id="edit-user-{{user.id}}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button class="btn btn-danger btn-sm" (click)="deleteUser(user)" id="delete-user-{{user.id}}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <polyline points="3,6 5,6 21,6"/>
                              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- Create/Edit Modal -->
        @if (showModal()) {
          <div class="modal-overlay" (click)="closeModal()">
            <div class="modal glass-card animate-scale-in" (click)="$event.stopPropagation()">
              <div class="modal-header">
                <h2>{{ isEditing() ? 'Modifier' : 'Ajouter' }} un utilisateur</h2>
                <button class="btn btn-ghost btn-sm" (click)="closeModal()">✕</button>
              </div>
              <div class="modal-body">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Nom</label>
                    <input type="text" class="form-input" [(ngModel)]="formNom" placeholder="Nom" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Prénom</label>
                    <input type="text" class="form-input" [(ngModel)]="formPrenom" placeholder="Prénom" />
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-input" [(ngModel)]="formEmail" placeholder="email" />
                </div>
                @if (!isEditing()) {
                  <div class="form-group">
                    <label class="form-label">Mot de passe</label>
                    <input type="password" class="form-input" [(ngModel)]="formPassword" placeholder="Min. 6 caractères" />
                  </div>
                }
                <div class="form-group">
                  <label class="form-label">Rôle</label>
                  <select class="form-select" [(ngModel)]="formRole">
                    <option value="client">Client</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-ghost" (click)="closeModal()">Annuler</button>
                <button class="btn btn-primary" (click)="saveUser()" id="save-user-btn">
                  {{ isEditing() ? 'Modifier' : 'Créer' }}
                </button>
              </div>
            </div>
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    .users-layout { display: flex; min-height: 100vh; }
    .main-content { flex: 1; margin-left: var(--sidebar-width); padding: 32px; position: relative; z-index: 1; }

    /* Pending Section */
    .pending-section {
      margin-bottom: 28px;
    }

    .section-header {
      margin-bottom: 16px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text);
    }

    .pending-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px; height: 24px;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--warning), #d97706);
      color: white;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .pending-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    .pending-card {
      padding: 20px;
    }

    .pending-card-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 12px;
    }

    .pending-avatar {
      width: 44px; height: 44px; min-width: 44px;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--primary), var(--accent));
      display: flex; align-items: center; justify-content: center;
      font-size: 0.875rem; font-weight: 600; color: white;
    }

    .pending-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .pending-name {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--text);
    }

    .pending-email {
      font-size: 0.8125rem;
      color: var(--text-muted);
    }

    .pending-meta {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      font-size: 0.8125rem;
    }

    .pending-actions {
      display: flex;
      gap: 10px;
    }

    .pending-actions .btn {
      flex: 1;
    }

    /* Status dot */
    .status-dot {
      display: inline-block;
      width: 8px; height: 8px;
      border-radius: 50%;
      margin-right: 6px;
    }

    .status-dot.approved {
      background: var(--accent);
      box-shadow: 0 0 6px var(--accent-glow);
    }

    .status-dot.pending {
      background: var(--warning);
      box-shadow: 0 0 6px var(--warning-glow);
      animation: pulse 2s ease-in-out infinite;
    }

    /* Table */
    .table-card { padding: 0; overflow: hidden; }

    .table-header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid var(--glass-border);
    }

    .table-header-bar .section-title { margin: 0; }

    .id-cell { color: var(--primary); font-weight: 600; font-size: 0.8125rem; }

    .user-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .mini-avatar {
      width: 32px; height: 32px; min-width: 32px;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--primary), var(--accent));
      display: flex; align-items: center; justify-content: center;
      font-size: 0.6875rem; font-weight: 600; color: white;
    }

    .action-buttons { display: flex; gap: 8px; }

    /* Modal */
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; padding: 20px;
    }

    .modal { width: 100%; max-width: 480px; }
    .modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 24px; border-bottom: 1px solid var(--glass-border);
    }
    .modal-header h2 { font-size: 1.125rem; font-weight: 600; }
    .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 18px; }
    .modal-footer {
      display: flex; justify-content: flex-end; gap: 12px;
      padding: 16px 24px; border-top: 1px solid var(--glass-border);
    }

    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

    @media (max-width: 768px) {
      .main-content { margin-left: 0; padding: 20px 16px; }
      .form-row { grid-template-columns: 1fr; }
      .pending-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ManageUsers implements OnInit {
  users = signal<User[]>([]);
  pendingAgents = signal<User[]>([]);
  isLoading = signal(true);
  showModal = signal(false);
  isEditing = signal(false);
  editingUserId = 0;

  formNom = '';
  formPrenom = '';
  formEmail = '';
  formPassword = '';
  formRole = 'client';

  constructor(
    private userService: UserService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadPendingAgents();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadPendingAgents(): void {
    this.userService.getPendingAgents().subscribe({
      next: (data) => this.pendingAgents.set(data),
      error: () => {}
    });
  }

  approveAgent(agent: User): void {
    this.userService.approveAgent(agent.id).subscribe({
      next: () => {
        this.loadPendingAgents();
        this.loadUsers();
      },
      error: () => {}
    });
  }

  rejectAgent(agent: User): void {
    if (confirm(`Rejeter la demande de ${agent.prenom} ${agent.nom} ?`)) {
      this.userService.rejectAgent(agent.id).subscribe({
        next: () => {
          this.loadPendingAgents();
          this.loadUsers();
        },
        error: () => {}
      });
    }
  }

  openCreateModal(): void {
    this.isEditing.set(false);
    this.formNom = '';
    this.formPrenom = '';
    this.formEmail = '';
    this.formPassword = '';
    this.formRole = 'client';
    this.showModal.set(true);
  }

  openEditModal(user: User): void {
    this.isEditing.set(true);
    this.editingUserId = user.id;
    this.formNom = user.nom;
    this.formPrenom = user.prenom;
    this.formEmail = user.email;
    this.formRole = user.role;
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveUser(): void {
    if (this.isEditing()) {
      this.userService.update(this.editingUserId, {
        nom: this.formNom,
        prenom: this.formPrenom,
        email: this.formEmail,
        role: this.formRole as any
      }).subscribe({
        next: () => { this.closeModal(); this.loadUsers(); },
        error: () => {}
      });
    } else {
      this.userService.create({
        nom: this.formNom,
        prenom: this.formPrenom,
        email: this.formEmail,
        password: this.formPassword,
        role: this.formRole
      }).subscribe({
        next: () => { this.closeModal(); this.loadUsers(); },
        error: () => {}
      });
    }
  }

  deleteUser(user: User): void {
    if (confirm(`Supprimer ${user.prenom} ${user.nom} ?`)) {
      this.userService.delete(user.id).subscribe({
        next: () => this.loadUsers(),
        error: () => {}
      });
    }
  }

  getInitials(user: User): string {
    return (user.prenom[0] + user.nom[0]).toUpperCase();
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
