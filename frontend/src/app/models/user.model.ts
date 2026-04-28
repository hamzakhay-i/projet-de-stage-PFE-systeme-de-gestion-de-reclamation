export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'agent' | 'client';
  approved: boolean;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role: 'client' | 'agent';
}

export interface AuthResponse {
  message: string;
  token?: string;
  pending?: boolean;
  user: User;
}
