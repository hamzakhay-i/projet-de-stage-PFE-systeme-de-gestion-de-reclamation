export interface Reclamation {
  id: number;
  titre: string;
  description: string;
  statut: 'en_attente' | 'en_cours' | 'resolue' | 'rejetee';
  priorite: 'normale' | 'urgente';
  client_id: number;
  agent_id: number | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  client_nom?: string;
  client_prenom?: string;
  client_email?: string;
  agent_nom?: string;
  agent_prenom?: string;
  agent_email?: string;
}

export interface ReclamationStats {
  total: number;
  en_attente: number;
  en_cours: number;
  resolue: number;
  rejetee: number;
}

export interface CreateReclamation {
  titre: string;
  description: string;
  priorite: string;
}
