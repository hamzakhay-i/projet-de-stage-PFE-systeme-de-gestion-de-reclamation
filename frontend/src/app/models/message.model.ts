export interface Message {
  id: number;
  reclamation_id: number;
  sender_id: number;
  contenu: string;
  lu: boolean;
  created_at: string;
  // Joined fields
  sender_nom?: string;
  sender_prenom?: string;
  sender_role?: string;
}
