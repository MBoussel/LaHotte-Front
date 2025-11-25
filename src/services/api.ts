import axios, { type AxiosInstance } from 'axios';
import type { User, Famille, Cadeau, Invitation, Contribution, ContributionWithUser } from '../types';

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré
      localStorage.removeItem('access_token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (username: string, email: string, password: string) =>
    api.post<User>('/auth/register', { username, email, password }),
  
  login: (username: string, password: string) =>
    api.post<{ access_token: string; token_type: string }>(
      '/auth/login',
      new URLSearchParams({ username, password }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    ),
  
  getMe: () => api.get<User>('/auth/me'),
};

// Familles
export const famillesAPI = {
  getAll: () => api.get<Famille[]>('/familles/'),
  getOne: (id: number) => api.get<Famille>(`/familles/${id}`),
  create: (data: Partial<Famille>) => api.post<Famille>('/familles/', data),
  update: (id: number, data: Partial<Famille>) => api.put<Famille>(`/familles/${id}`, data),
  delete: (id: number) => api.delete(`/familles/${id}`),
  invite: (familleId: number, email: string) => api.post(`/familles/${familleId}/invite`, { email }),
  getPendingInvitations: () => api.get<Invitation[]>('/familles/invitations/pending'),
  acceptInvitation: (token: string) => api.post(`/familles/invitations/${token}/accept`),
   getInvitations: (familleId: number) => 
    api.get<Invitation[]>(`/familles/${familleId}/invitations`),
  
  // Nouvelles routes de recherche
  searchPublic: (query: string = '') => api.get<Famille[]>(`/familles/search?query=${query}`),
  requestToJoin: (familleId: number, message: string = '') => 
    api.post(`/familles/${familleId}/demander-adhesion`, { message }),
  getDemandes: (familleId: number) => 
    api.get(`/familles/${familleId}/demandes`),
  acceptDemande: (demandeId: number) => 
    api.post(`/familles/demandes/${demandeId}/accepter`),
  rejectDemande: (demandeId: number) => 
    api.delete(`/familles/demandes/${demandeId}`),
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