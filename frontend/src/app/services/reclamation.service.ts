import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reclamation, ReclamationStats, CreateReclamation } from '../models/reclamation.model';

@Injectable({ providedIn: 'root' })
export class ReclamationService {
  private readonly API_URL = 'http://localhost:3500/api/reclamations';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(this.API_URL);
  }

  getById(id: number): Observable<Reclamation> {
    return this.http.get<Reclamation>(`${this.API_URL}/${id}`);
  }

  create(data: CreateReclamation): Observable<{ message: string; reclamation: Reclamation }> {
    return this.http.post<{ message: string; reclamation: Reclamation }>(this.API_URL, data);
  }

  update(id: number, data: Partial<Reclamation>): Observable<{ message: string; reclamation: Reclamation }> {
    return this.http.put<{ message: string; reclamation: Reclamation }>(`${this.API_URL}/${id}`, data);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/${id}`);
  }

  getStats(): Observable<ReclamationStats> {
    return this.http.get<ReclamationStats>(`${this.API_URL}/stats`);
  }
}
