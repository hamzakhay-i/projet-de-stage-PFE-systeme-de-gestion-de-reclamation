import { Component, OnInit, OnDestroy, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';
import { ReclamationService } from '../../services/reclamation.service';
import { Message } from '../../models/message.model';
import { Reclamation } from '../../models/reclamation.model';
import { Sidebar } from '../layout/sidebar/sidebar';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule, RouterLink, Sidebar],
  template: `
    <div class="chat-layout">
      <app-sidebar />
      <main class="main-content">
        <!-- Professional Header -->
        <div class="chat-header animate-fade-in">
          <div class="header-actions">
            <a routerLink="/reclamations" class="btn btn-ghost btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15,18 9,12 15,6"/>
              </svg>
            </a>
          </div>
          @if (reclamation()) {
            <div class="header-content">
              <div class="title-row">
                <h2>{{ reclamation()?.titre }}</h2>
                <span class="ticket-id">#{{ reclamation()?.id }}</span>
              </div>
              <div class="badges-row">
                <span class="badge" [class]="'badge-' + reclamation()?.statut">{{ formatStatut(reclamation()?.statut || '') }}</span>
                <span class="badge" [class]="'badge-' + reclamation()?.priorite">Priorité {{ reclamation()?.priorite }}</span>
              </div>
            </div>
          }
        </div>

        <!-- Messages Area -->
        <div class="chat-messages" #chatContainer>
          @if (isLoading()) {
            <div class="loading-overlay">
              <div class="spinner spinner-lg"></div>
              <span>Chargement du ticket...</span>
            </div>
          } @else {
            
            <!-- Description as first message -->
            @if (reclamation()) {
              <div class="message-wrapper" [class.sent]="reclamation()!.client_id === currentUserId()" [class.received]="reclamation()!.client_id !== currentUserId()">
                <div class="message-avatar">
                  {{ getInitials(reclamation()?.client_prenom, reclamation()?.client_nom) }}
                </div>
                <div class="message-content">
                  <div class="message-meta">
                    <span class="sender-name">{{ reclamation()?.client_prenom }} {{ reclamation()?.client_nom }}</span>
                    <span class="sender-role client-role">Client</span>
                    <span class="message-time">{{ formatTime(reclamation()?.created_at || '') }}</span>
                  </div>
                  <div class="message-bubble description-bubble">
                    <div class="description-header">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      RÉCLAMATION INITIALE
                    </div>
                    <p class="message-text">{{ reclamation()?.description }}</p>
                  </div>
                </div>
              </div>

              <div class="messages-divider">
                <span>Discussion</span>
              </div>
            }

            @for (msg of messages(); track msg.id) {
              <div class="message-wrapper" [class.sent]="msg.sender_id === currentUserId()" [class.received]="msg.sender_id !== currentUserId()">
                <div class="message-avatar" [class.agent-avatar]="msg.sender_role !== 'client'">
                  {{ getInitials(msg.sender_prenom, msg.sender_nom) }}
                </div>
                <div class="message-content">
                  <div class="message-meta">
                    <span class="sender-name">{{ msg.sender_prenom }} {{ msg.sender_nom }}</span>
                    @if (msg.sender_role !== 'client') {
                      <span class="sender-role agent-role">{{ msg.sender_role === 'admin' ? 'Admin' : 'Agent' }}</span>
                    }
                    <span class="message-time">
                      {{ formatTime(msg.created_at) }}
                      @if (msg.sender_id === currentUserId()) {
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [class.read]="msg.lu">
                          <polyline points="20,6 9,17 4,12"/>
                        </svg>
                      }
                    </span>
                  </div>
                  <div class="message-bubble">
                    <p class="message-text">{{ msg.contenu }}</p>
                  </div>
                </div>
              </div>
            }
            
            @if (messages().length === 0) {
               <div class="empty-chat-sub">Le ticket a été ouvert. En attente d'une réponse.</div>
            }
          }
        </div>

        <!-- Professional Input Area -->
        @if (canReply()) {
          <div class="chat-input-container">
            <form (ngSubmit)="sendMessage()" class="input-form">
              <input
                type="text"
                class="form-input chat-input-field"
                [(ngModel)]="newMessage"
                name="message"
                placeholder="Écrivez votre réponse ici..."
                autocomplete="off"
                id="chat-input"
              />
              <button type="submit" class="btn btn-primary send-btn" [disabled]="!newMessage.trim()" id="send-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22,2 15,22 11,13 2,9"/>
                </svg>
              </button>
            </form>
          </div>
        } @else if (authService.userRole() === 'agent') {
          <div class="chat-input-locked">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span>Ce ticket est actuellement géré par un autre agent. Vous ne pouvez pas y répondre.</span>
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    .chat-layout { display: flex; min-height: 100vh; background: var(--bg-body); }
    .main-content {
      flex: 1;
      margin-left: var(--sidebar-width);
      display: flex;
      flex-direction: column;
      height: 100vh;
      position: relative;
    }

    /* Professional Header */
    .chat-header {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 16px 32px;
      background: #ffffff;
      border-bottom: 1px solid var(--glass-border);
      z-index: 10;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }

    .btn-icon {
      padding: 8px;
      border-radius: 8px;
      background: var(--bg-body);
      color: var(--text-muted);
      border: 1px solid var(--glass-border);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-icon:hover { background: #fff; color: var(--text); border-color: var(--text-muted); }

    .header-content { display: flex; flex-direction: column; gap: 4px; }
    .title-row { display: flex; align-items: baseline; gap: 12px; }
    .title-row h2 { font-size: 1.125rem; font-weight: 600; color: var(--text); margin: 0; }
    .ticket-id { font-size: 0.875rem; color: var(--text-muted); font-weight: 500; }
    .badges-row { display: flex; gap: 8px; }

    /* Chat Messages Area */
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 32px 10%;
      display: flex;
      flex-direction: column;
      gap: 24px;
      background: #f8fafc;
    }

    /* Message Wrappers */
    .message-wrapper {
      display: flex;
      gap: 16px;
      animation: fadeIn 0.3s ease forwards;
      width: 100%;
    }

    .message-wrapper.sent { flex-direction: row-reverse; }

    /* Avatars */
    .message-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e2e8f0;
      color: #475569;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
      flex-shrink: 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .message-wrapper.sent .message-avatar {
      background: var(--primary-light);
      color: white;
    }
    .agent-avatar {
      background: rgba(14, 165, 233, 0.1) !important;
      color: var(--primary-dark) !important;
      border: 1px solid rgba(14, 165, 233, 0.2);
    }

    /* Content & Meta */
    .message-content {
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-width: 75%;
    }
    .message-wrapper.sent .message-content { align-items: flex-end; }

    .message-meta {
      display: flex;
      align-items: baseline;
      gap: 8px;
      padding: 0 4px;
    }
    .message-wrapper.sent .message-meta { flex-direction: row-reverse; }

    .sender-name { font-size: 0.8125rem; font-weight: 600; color: var(--text); }
    
    .sender-role {
      font-size: 0.65rem;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    .client-role { background: rgba(0,0,0,0.05); color: var(--text-muted); }
    .agent-role { background: rgba(14, 165, 233, 0.1); color: var(--primary-dark); }

    .message-time { font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 4px; }

    /* Bubbles */
    .message-bubble {
      padding: 14px 18px;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .received .message-bubble {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-top-left-radius: 4px;
    }
    .sent .message-bubble {
      background: var(--primary);
      border-top-right-radius: 4px;
      box-shadow: 0 2px 6px rgba(14,165,233,0.2);
    }

    /* Description specific */
    .description-bubble {
      background: #ffffff !important;
      border: 1px solid #e2e8f0 !important;
      border-top-left-radius: 4px !important;
      border-top-right-radius: 12px !important;
      border-left: 3px solid var(--primary) !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.03) !important;
      padding-top: 12px !important;
    }
    .description-header {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--primary);
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 1px dashed #e2e8f0;
    }
    .sent .description-bubble {
      border-top-right-radius: 4px !important;
      border-top-left-radius: 12px !important;
      border-right: 3px solid var(--primary) !important;
      border-left: 1px solid #e2e8f0 !important;
    }

    /* Text */
    .message-text {
      font-size: 0.9375rem;
      line-height: 1.6;
      color: var(--text);
      white-space: pre-wrap;
      margin: 0;
    }
    .sent .message-text { color: #ffffff; }
    .description-bubble .message-text { color: var(--text) !important; }

    /* Divider */
    .messages-divider {
      display: flex; align-items: center; text-align: center;
      color: var(--text-muted); font-size: 0.75rem;
      margin: 24px 0 8px 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;
    }
    .messages-divider::before, .messages-divider::after {
      content: ''; flex: 1; border-bottom: 1px solid #e2e8f0; margin: 0 16px;
    }
    .empty-chat-sub { text-align: center; color: var(--text-muted); font-size: 0.875rem; margin-top: 16px; font-style: italic; }

    /* Professional Input Area */
    .chat-input-container {
      padding: 20px 10%;
      background: #ffffff;
      border-top: 1px solid var(--glass-border);
      box-shadow: 0 -4px 20px rgba(0,0,0,0.02);
    }

    .input-form { display: flex; gap: 12px; align-items: center; }
    .chat-input-field {
      flex: 1;
      border-radius: 20px !important;
      padding: 14px 24px !important;
      background: #f8fafc !important;
      border: 1px solid #e2e8f0 !important;
      font-size: 0.9375rem;
      transition: all 0.2s;
    }
    .chat-input-field:focus { background: #ffffff !important; border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(14,165,233,0.1) !important;}

    .send-btn {
      width: 50px; height: 50px; min-width: 50px;
      border-radius: 50%; padding: 0;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(14,165,233,0.3);
    }

    .chat-input-locked {
      padding: 24px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.9375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .main-content { margin-left: 0; }
      .chat-messages { padding: 24px 16px; }
      .chat-input-container { padding: 16px; }
      .message-content { max-width: 85%; }
    }
  `]
})
export class Chat implements OnInit, OnDestroy {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  reclamationId = 0;
  messages = signal<Message[]>([]);
  reclamation = signal<Reclamation | null>(null);
  isLoading = signal(true);
  newMessage = '';
  currentUserId = signal(0);
  private pollInterval: any;

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    private messageService: MessageService,
    private reclamationService: ReclamationService
  ) {
    this.currentUserId.set(this.authService.currentUser()?.id || 0);
  }

  ngOnInit(): void {
    this.reclamationId = Number(this.route.snapshot.paramMap.get('reclamationId'));
    this.loadReclamation();
    this.loadMessages();

    // Poll for new messages every 5s
    this.pollInterval = setInterval(() => this.loadMessages(), 5000);
  }

  ngOnDestroy(): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  loadReclamation(): void {
    this.reclamationService.getById(this.reclamationId).subscribe({
      next: (data) => this.reclamation.set(data),
      error: () => {}
    });
  }

  loadMessages(): void {
    this.messageService.getByReclamation(this.reclamationId).subscribe({
      next: (data) => {
        const prevLength = this.messages().length;
        this.messages.set(data);
        this.isLoading.set(false);
        if (data.length > prevLength) {
          setTimeout(() => this.scrollToBottom(), 50);
        }
      },
      error: () => this.isLoading.set(false)
    });
  }

  sendMessage(): void {
    const content = this.newMessage.trim();
    if (!content) return;

    this.messageService.send(this.reclamationId, content).subscribe({
      next: () => {
        this.newMessage = '';
        this.loadMessages();
      },
      error: () => {}
    });
  }

  scrollToBottom(): void {
    if (this.chatContainer) {
      const el = this.chatContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  formatStatut(s: string): string {
    const map: Record<string, string> = {
      'en_attente': 'En attente', 'en_cours': 'En cours', 'resolue': 'Résolue', 'rejetee': 'Rejetée'
    };
    return map[s] || s;
  }

  formatTime(d: string): string {
    return new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  getInitials(prenom?: string, nom?: string): string {
    if (!prenom || !nom) return 'U';
    return (prenom.charAt(0) + nom.charAt(0)).toUpperCase();
  }

  canReply(): boolean {
    const userRole = this.authService.userRole();
    const currentUserId = this.currentUserId();
    const rec = this.reclamation();
    if (!rec) return false;
    
    if (userRole === 'client' && rec.client_id !== currentUserId) return false;
    if (userRole === 'agent' && rec.agent_id && rec.agent_id !== currentUserId) return false;
    
    return true; // admin, owner client, or owner/unassigned agent
  }
}
