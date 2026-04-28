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
        <!-- Chat Header -->
        <div class="chat-header glass-card animate-fade-in">
          <a routerLink="/reclamations" class="btn btn-ghost btn-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15,18 9,12 15,6"/>
            </svg>
            Retour
          </a>
          @if (reclamation()) {
            <div class="chat-info">
              <h2>{{ reclamation()?.titre }}</h2>
              <div class="chat-meta">
                <span class="badge" [class]="'badge-' + reclamation()?.statut">{{ formatStatut(reclamation()?.statut || '') }}</span>
                <span class="badge" [class]="'badge-' + reclamation()?.priorite">Priorité {{ reclamation()?.priorite }}</span>
                <span class="text-muted">•</span>
                <span class="text-muted">Réclamation #{{ reclamation()?.id }}</span>
              </div>
            </div>
            
            <div class="reclamation-content">
              <p>{{ reclamation()?.description }}</p>
            </div>
          }
        </div>

        <!-- Messages -->
        <div class="chat-messages" #chatContainer>
          @if (isLoading()) {
            <div class="loading-overlay">
              <div class="spinner spinner-lg"></div>
              <span>Chargement des messages...</span>
            </div>
          } @else if (messages().length === 0) {
            <div class="empty-chat">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              <p>Aucun message. Commencez la conversation !</p>
            </div>
          } @else {
            @for (msg of messages(); track msg.id) {
              <div class="message-wrapper" [class.sent]="msg.sender_id === currentUserId()" [class.received]="msg.sender_id !== currentUserId()">
                <div class="message-bubble">
                  <div class="message-sender">
                    <span class="sender-name">{{ msg.sender_prenom }} {{ msg.sender_nom }}</span>
                    <span class="badge" [class]="'badge-' + msg.sender_role">{{ msg.sender_role }}</span>
                  </div>
                  <p class="message-text">{{ msg.contenu }}</p>
                  <div class="message-time">
                    {{ formatTime(msg.created_at) }}
                    @if (msg.sender_id === currentUserId()) {
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [class.read]="msg.lu">
                        <polyline points="20,6 9,17 4,12"/>
                      </svg>
                    }
                  </div>
                </div>
              </div>
            }
          }
        </div>

        <!-- Input -->
        <div class="chat-input glass-card">
          <form (ngSubmit)="sendMessage()" class="input-form">
            <input
              type="text"
              class="form-input message-input"
              [(ngModel)]="newMessage"
              name="message"
              placeholder="Tapez votre message..."
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
      </main>
    </div>
  `,
  styles: [`
    .chat-layout { display: flex; min-height: 100vh; }
    .main-content {
      flex: 1;
      margin-left: var(--sidebar-width);
      display: flex;
      flex-direction: column;
      height: 100vh;
      position: relative;
      z-index: 1;
    }

    .chat-header {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: 16px;
      padding: 16px 24px;
      border-radius: 0;
      border-bottom: 1px solid var(--glass-border);
      border-top: none;
      border-left: none;
      border-right: none;
    }

    .chat-info h2 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text);
    }

    .chat-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 4px;
      margin-bottom: 12px;
      font-size: 0.75rem;
    }

    .reclamation-content {
      margin-top: 6px;
      margin-left: 0;
      padding-top: 12px;
      border-top: 1px dashed rgba(255, 255, 255, 0.1);
      width: 100%;
      grid-column: 1 / -1;
    }

    .reclamation-content p {
      font-size: 0.875rem;
      line-height: 1.5;
      color: var(--text-muted);
      white-space: pre-wrap;
      margin: 0;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .empty-chat {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      color: var(--text-muted);
    }

    /* WhatsApp-style messages */
    .message-wrapper {
      display: flex;
      animation: fadeIn 0.3s ease forwards;
    }

    .message-wrapper.sent {
      justify-content: flex-end;
    }

    .message-wrapper.received {
      justify-content: flex-start;
    }

    .message-bubble {
      max-width: 65%;
      padding: 12px 16px;
      border-radius: var(--radius-lg);
      position: relative;
    }

    .sent .message-bubble {
      background: linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(14, 165, 233, 0.1));
      border: 1px solid rgba(14, 165, 233, 0.2);
      border-bottom-right-radius: 4px;
    }

    .received .message-bubble {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--glass-border);
      border-bottom-left-radius: 4px;
    }

    .message-sender {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }

    .sender-name {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--primary-light);
    }

    .received .sender-name {
      color: var(--accent-light);
    }

    .message-text {
      font-size: 0.9375rem;
      color: var(--text);
      line-height: 1.5;
      word-wrap: break-word;
    }

    .message-time {
      display: flex;
      align-items: center;
      gap: 4px;
      justify-content: flex-end;
      font-size: 0.6875rem;
      color: var(--text-muted);
      margin-top: 4px;
    }

    .message-time svg {
      color: var(--text-muted);
    }

    .message-time svg.read {
      color: var(--primary);
    }

    /* Input Area */
    .chat-input {
      padding: 16px 24px;
      border-radius: 0;
      border-top: 1px solid var(--glass-border);
      border-bottom: none;
      border-left: none;
      border-right: none;
    }

    .input-form {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .message-input {
      flex: 1;
      border-radius: var(--radius-full) !important;
      padding: 12px 20px !important;
    }

    .send-btn {
      width: 48px;
      height: 48px;
      min-width: 48px;
      border-radius: var(--radius-full);
      padding: 0;
    }

    @media (max-width: 768px) {
      .main-content { margin-left: 0; }
      .message-bubble { max-width: 80%; }
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
}
