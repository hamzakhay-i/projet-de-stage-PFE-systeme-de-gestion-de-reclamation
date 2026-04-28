import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly API_URL = 'http://localhost:3500/api/users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL);
  }

  getAgents(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/agents`);
  }

  getPendingAgents(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/pending`);
  }

  approveAgent(id: number): Observable<{ message: string; user: User }> {
    return this.http.put<{ message: string; user: User }>(`${this.API_URL}/approve/${id}`, {});
  }

  rejectAgent(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/reject/${id}`);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`);
  }

  create(data: { nom: string; prenom: string; email: string; password: string; role: string }): Observable<{ message: string; user: User }> {
    return this.http.post<{ message: string; user: User }>(this.API_URL, data);
  }

  update(id: number, data: Partial<User>): Observable<{ message: string; user: User }> {
    return this.http.put<{ message: string; user: User }>(`${this.API_URL}/${id}`, data);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`);
  }
}
