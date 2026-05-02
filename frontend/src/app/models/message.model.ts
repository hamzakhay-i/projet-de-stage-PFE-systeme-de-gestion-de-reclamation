export interface Message {
  id: number;
  reclamation_id: number;
  sender_id: number;
  sender_nom: string;
  sender_prenom: string;
  sender_role: 'admin' | 'agent' | 'client';
  contenu: string;
  lu: boolean;
  created_at: string;
}
