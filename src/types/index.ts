export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_admin?: boolean;
  avatar_url?: string;
  created_at: string;
}

export interface Famille {
  id: number;
  nom: string;
  description: string;
  creator_id: number;
  pere_noel_id?: number | null;
  noel_type?: 'pere_noel' | 'mere_noel';
  pere_noel_username?: string | null;
  created_at: string;
  is_public?: boolean;
  membres?: Membre[];
}

export interface BeneficiaireProfil {
  id: number;
  famille_id: number;
  nom: string;
  avatar_url?: string | null;
  created_by_id: number;
  responsables: Array<{ id: number; username: string }>;
}

export interface Membre {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
}

// Dans src/types/index.ts

export interface Cadeau {
  id: number;
  titre: string;
  prix: number;
  description: string;
  photo_url?: string;
  lien_achat?: string;
  owner_id: number;
  is_favorite?: boolean;
  beneficiaires?: Array<{ id: number; username: string }>;
  beneficiaire_profil_id?: number | null;
  beneficiaire_profil_nom?: string | null;  
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
  cadeau_id: number | null;
  beneficiaire_user_id?: number | null;
  beneficiaire_profil_id?: number | null;
  user_id: number;
  montant: number;
  message: string;
  created_at: string;
}

export interface ContributionWithUser {
  id: number;
  montant: number;
  message: string;
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