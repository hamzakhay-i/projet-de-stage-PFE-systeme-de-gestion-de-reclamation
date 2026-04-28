import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly API_URL = 'http://localhost:3500/api/messages';

  constructor(private http: HttpClient) {}

  getByReclamation(reclamationId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.API_URL}/${reclamationId}`);
  }

  send(reclamation_id: number, contenu: string): Observable<{ message: string; data: Message }> {
    return this.http.post<{ message: string; data: Message }>(this.API_URL, { reclamation_id, contenu });
  }

  markAsRead(reclamationId: number): Observable<{ message: string; count: number }> {
    return this.http.put<{ message: string; count: number }>(`${this.API_URL}/read/${reclamationId}`, {});
  }

  getUnreadCount(): Observable<{ unread: number }> {
    return this.http.get<{ unread: number }>(`${this.API_URL}/unread/count`);
  }
}
