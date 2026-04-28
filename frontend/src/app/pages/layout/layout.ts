import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Sidebar } from './sidebar/sidebar';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, Sidebar],
  template: `
    <div class="app-layout">
      <app-sidebar />
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      margin-left: var(--sidebar-width);
      padding: 32px;
      position: relative;
      z-index: 1;
      transition: margin-left var(--transition-base);
    }

    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
        padding: 20px 16px;
      }
    }
  `]
})
export class Layout {
  constructor(public authService: AuthService) {}
}
