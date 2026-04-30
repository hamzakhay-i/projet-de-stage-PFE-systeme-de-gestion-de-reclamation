import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ReclamationService } from '../../../services/reclamation.service';
import { UserService } from '../../../services/user.service';
import { Reclamation } from '../../../models/reclamation.model';
import { User } from '../../../models/user.model';
import { Sidebar } from '../../layout/sidebar/sidebar';

@Component({
  selector: 'app-reclamation-list',
  imports: [CommonModule, RouterLink, FormsModule, Sidebar],
  template: `
    <div class="list-layout">
      <app-sidebar />
      <main class="main-content">
        <div class="page-header animate-fade-in">
          <h1 class="page-title">Réclamations</h1>
          <div class="header-actions">
            @if (authService.userRole() === 'client') {
              <a routerLink="/reclamations/new" class="btn btn-primary" id="btn-new-reclamation">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
                </svg>
                Nouvelle
              </a>
            }
          </div>
        </div>

        <!-- Filters -->
        <div class="filters glass-card animate-fade-in">
          <div class="form-group">
            <label class="form-label">Statut</label>
            <select class="form-select" [(ngModel)]="filterStatut" (ngModelChange)="applyFilters()">
              <option value="">Tous</option>
              <option value="en_attente">En attente</option>
              <option value="en_cours">En cours</option>
              <option value="resolue">Résolue</option>
              <option value="rejetee">Rejetée</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Priorité</label>
            <select class="form-select" [(ngModel)]="filterPriorite" (ngModelChange)="applyFilters()">
              <option value="">Toutes</option>
              <option value="normale">Normale</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Recherche</label>
            <input type="text" class="form-input" placeholder="Rechercher..." [(ngModel)]="searchTerm" (ngModelChange)="applyFilters()" />
          </div>
        </div>

        @if (isLoading()) {
          <div class="loading-overlay">
            <div class="spinner spinner-lg"></div>
            <span>Chargement...</span>
          </div>
        } @else if (filtered().length === 0) {
          <div class="empty-state glass-card animate-fade-in">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/>
            </svg>
            <p>Aucune réclamation trouvée</p>
          </div>
        } @else {
          <div class="glass-card table-card animate-fade-in">
            <div class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Titre</th>
                    <th>Statut</th>
                    <th>Priorité</th>
                    @if (authService.userRole() !== 'client') { <th>Client</th> }
                    @if (authService.userRole() !== 'client') { <th>Agent</th> }
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (rec of filtered(); track rec.id) {
                    <tr>
                      <td><span class="id-cell">#{{ rec.id }}</span></td>
                      <td><span class="title-cell">{{ rec.titre }}</span></td>
                      <td><span class="badge" [class]="'badge-' + rec.statut">{{ formatStatut(rec.statut) }}</span></td>
                      <td><span class="badge" [class]="'badge-' + rec.priorite">{{ rec.priorite }}</span></td>
                      @if (authService.userRole() !== 'client') {
                        <td>{{ rec.client_prenom }} {{ rec.client_nom }}</td>
                      }
                      @if (authService.userRole() !== 'client') {
                        <td>
                          @if (rec.agent_nom) {
                            {{ rec.agent_prenom }} {{ rec.agent_nom }}
                          } @else {
                            <span class="text-muted">Non assigné</span>
                          }
                        </td>
                      }
                      <td><span class="text-muted">{{ formatDate(rec.created_at) }}</span></td>
                      <td>
                        <div class="action-buttons">
                          <a [routerLink]="['/chat', rec.id]" class="btn btn-ghost btn-sm" id="chat-btn-{{rec.id}}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                            </svg>
                            Chat
                          </a>
                          @if (canEdit(rec)) {
                            <button class="btn btn-ghost btn-sm" (click)="openEditModal(rec)" id="edit-btn-{{rec.id}}">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </button>
                          }
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- Edit Modal -->
        @if (editingRec()) {
          <div class="modal-overlay" (click)="closeEditModal()">
            <div class="modal glass-card animate-scale-in" (click)="$event.stopPropagation()">
              <div class="modal-header">
                <h2>Modifier la réclamation #{{ editingRec()!.id }}</h2>
                <button class="btn btn-ghost btn-sm" (click)="closeEditModal()">✕</button>
              </div>
              <div class="modal-body">
                <div class="form-group">
                  <label class="form-label">Statut</label>
                  <select class="form-select" [(ngModel)]="editStatut">
                    <option value="en_attente">En attente</option>
                    <option value="en_cours">En cours</option>
                    <option value="resolue">Résolue</option>
                    <option value="rejetee">Rejetée</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Priorité</label>
                  <select class="form-select" [(ngModel)]="editPriorite">
                    <option value="normale">Normale</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
                @if (authService.userRole() !== 'client') {
                  <div class="form-group">
                    <label class="form-label">Assigner à un agent</label>
                    <select class="form-select" [(ngModel)]="editAgentId">
                      <option [ngValue]="null">-- Non assigné --</option>
                      @for (agent of agents(); track agent.id) {
                        <option [ngValue]="agent.id">{{ agent.prenom }} {{ agent.nom }}</option>
                      }
                    </select>
                  </div>
                }
              </div>
              <div class="modal-footer">
                <button class="btn btn-ghost" (click)="closeEditModal()">Annuler</button>
                <button class="btn btn-primary" (click)="saveEdit()" id="save-edit-btn">Enregistrer</button>
              </div>
            </div>
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    .list-layout { display: flex; min-height: 100vh; }
    .main-content { flex: 1; margin-left: var(--sidebar-width); padding: 32px; position: relative; z-index: 1; }

    .header-actions { display: flex; gap: 12px; }

    .filters {
      display: grid;
      grid-template-columns: 180px 180px 1fr;
      gap: 16px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .table-card { padding: 0; overflow: hidden; }
    .id-cell { color: var(--primary); font-weight: 600; font-size: 0.8125rem; }
    .title-cell { font-weight: 500; color: var(--text); }

    .action-buttons { display: flex; gap: 8px; }

    .empty-state {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 16px; padding: 60px 20px; color: var(--text-muted);
    }

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

    @media (max-width: 768px) {
      .main-content { margin-left: 0; padding: 20px 16px; }
      .filters { grid-template-columns: 1fr; }
    }
  `]
})
export class ReclamationList implements OnInit {
  reclamations = signal<Reclamation[]>([]);
  filtered = signal<Reclamation[]>([]);
  agents = signal<User[]>([]);
  isLoading = signal(true);
  filterStatut = '';
  filterPriorite = '';
  searchTerm = '';

  editingRec = signal<Reclamation | null>(null);
  editStatut = '';
  editPriorite = '';
  editAgentId: number | null = null;

  constructor(
    public authService: AuthService,
    private reclamationService: ReclamationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadReclamations();
    if (this.authService.userRole() !== 'client') {
      this.userService.getAgents().subscribe({
        next: (agents) => this.agents.set(agents),
        error: () => {}
      });
    }
  }

  loadReclamations(): void {
    this.isLoading.set(true);
    this.reclamationService.getAll().subscribe({
      next: (data) => {
        this.reclamations.set(data);
        this.applyFilters();
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  applyFilters(): void {
    let result = this.reclamations();
    if (this.filterStatut) {
      result = result.filter(r => r.statut === this.filterStatut);
    }
    if (this.filterPriorite) {
      result = result.filter(r => r.priorite === this.filterPriorite);
    }
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(r =>
        r.titre.toLowerCase().includes(term) ||
        r.description.toLowerCase().includes(term) ||
        (r.client_nom && r.client_nom.toLowerCase().includes(term))
      );
    }
    this.filtered.set(result);
  }

  formatStatut(s: string): string {
    const map: Record<string, string> = {
      'en_attente': 'En attente', 'en_cours': 'En cours', 'resolue': 'Résolue', 'rejetee': 'Rejetée'
    };
    return map[s] || s;
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  canEdit(rec: Reclamation): boolean {
    const userRole = this.authService.userRole();
    const currentUserId = this.authService.currentUser()?.id;
    if (userRole === 'admin') return true;
    if (userRole === 'agent') {
      return !rec.agent_id || rec.agent_id === currentUserId;
    }
    return false;
  }

  openEditModal(rec: Reclamation): void {
    this.editingRec.set(rec);
    this.editStatut = rec.statut;
    this.editPriorite = rec.priorite;
    this.editAgentId = rec.agent_id;
  }

  closeEditModal(): void {
    this.editingRec.set(null);
  }

  saveEdit(): void {
    const rec = this.editingRec();
    if (!rec) return;

    this.reclamationService.update(rec.id, {
      statut: this.editStatut as any,
      priorite: this.editPriorite as any,
      agent_id: this.editAgentId
    }).subscribe({
      next: () => {
        this.closeEditModal();
        this.loadReclamations();
      },
      error: () => {}
    });
  }
}
