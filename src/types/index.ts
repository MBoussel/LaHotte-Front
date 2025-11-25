export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: string;
}

export interface Famille {
  id: number;
  nom: string;
  description: string;
  creator_id: number;
  created_at: string;
  membres?: Membre[];
}

export interface Membre {
  id: number;
  username: string;
  email: string;
}

export interface Cadeau {
  id: number;
  titre: string;
  prix: number;
  description: string;
  photo_url?: string;
  lien_achat?: string;
  owner_id: number;
  is_purchased: boolean;
  purchased_by_id?: number | null;
  famille_ids: number[];
}

export interface Invitation {
  id: number;
  famille_id: number;
  email: string;
  token: string;
  accepted: boolean;
  created_at: string;
  famille_nom?: string;  
}

export interface Contribution {
  id: number;
  cadeau_id: number;
  user_id: number;
  montant: number;
  message: string;
  is_anonymous: boolean;
  created_at: string;
}

export interface ContributionWithUser {
  id: number;
  montant: number;
  message: string;
  is_anonymous: boolean;
  created_at: string;
  contributeur: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}