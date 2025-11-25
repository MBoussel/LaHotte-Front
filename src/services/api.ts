import axios, { type AxiosInstance } from 'axios';
import type { User, Famille, Cadeau, LoginCredentials, RegisterData, AuthResponse, Invitation, Contribution, ContributionWithUser } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

// Fonctions cookies
export const setToken = (token: string): void => {
  document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
};

export const getToken = (): string | null => {
  const match = document.cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
};

export const deleteToken = (): void => {
  document.cookie = 'token=; path=/; max-age=0';
};

// Instance Axios
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
});

// Ajouter le token automatiquement
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  register: (userData: RegisterData) => api.post<User>('/auth/register', userData),
  login: (credentials: LoginCredentials) => api.post<AuthResponse>('/auth/login', new URLSearchParams(credentials as any)),
  getMe: () => api.get<User>('/auth/me'),
};

// Familles
export const famillesAPI = {
  getAll: () => api.get<Famille[]>('/familles/'),
  getOne: (id: number) => api.get<Famille>(`/familles/${id}`),
  create: (data: Partial<Famille>) => api.post<Famille>('/familles/', data),
  update: (id: number, data: Partial<Famille>) => api.put<Famille>(`/familles/${id}`, data),
  delete: (id: number) => api.delete(`/familles/${id}`),
  addMember: (familleId: number, userId: number) => api.post(`/familles/${familleId}/membres/${userId}`),
  removeMember: (familleId: number, userId: number) => api.delete(`/familles/${familleId}/membres/${userId}`),
  
  // Invitations
  createInvitation: (familleId: number, email: string) => 
    api.post<Invitation>(`/familles/${familleId}/invitations`, { email }),
  getInvitations: (familleId: number) => 
    api.get<Invitation[]>(`/familles/${familleId}/invitations`),
  getPendingInvitations: () => 
    api.get<Invitation[]>('/familles/invitations/pending'),
  acceptInvitation: (token: string) => 
    api.post(`/familles/invitations/${token}/accept`),
};

// Cadeaux
export const cadeauxAPI = {
  getAll: () => api.get<Cadeau[]>('/cadeaux/'),
  getMine: () => api.get<Cadeau[]>('/cadeaux/me'),
  getOne: (id: number) => api.get<Cadeau>(`/cadeaux/${id}`),
  create: (data: Partial<Cadeau>) => api.post<Cadeau>('/cadeaux/', data),
  update: (id: number, data: Partial<Cadeau>) => api.put<Cadeau>(`/cadeaux/${id}`, data),
  delete: (id: number) => api.delete(`/cadeaux/${id}`),
  markPurchased: (id: number) => api.post<Cadeau>(`/cadeaux/${id}/mark-purchased`),
  unmarkPurchased: (id: number) => api.post<Cadeau>(`/cadeaux/${id}/unmark-purchased`),
};

// Contributions
export const contributionsAPI = {
  contribute: (cadeauId: number, data: { montant: number; message?: string; is_anonymous?: boolean }) => 
    api.post<Contribution>(`/contributions/cadeaux/${cadeauId}`, data),
  getForCadeau: (cadeauId: number) => 
    api.get<ContributionWithUser[]>(`/contributions/cadeaux/${cadeauId}`),
  getMine: () => 
    api.get<Contribution[]>('/contributions/mes-contributions'),
  delete: (id: number) => 
    api.delete(`/contributions/${id}`),
};

export default api;