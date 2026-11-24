import axios, { type AxiosInstance } from 'axios';
import type { User, Famille, Cadeau, Invitation, Contribution, ContributionWithUser, BeneficiaireProfil } from '../types';


// Configuration Axios
const api: AxiosInstance = axios.create({
  baseURL: window.location.hostname === 'deploy-preview-11--lahotte.netlify.app'
    ? 'https://api.lahotte.gazggul.ovh'
    : (import.meta.env.VITE_API_URL || 'http://localhost:8000'),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // ← IMPORTANT : Envoie les cookies
});

// Intercepteur pour gérer les erreurs 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token invalide ou expiré
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
api.interceptors.response.use((response) => {
  // Convertir les strings numériques (Decimal de PostgreSQL) en nombres
  const convertDecimals = (obj: any): any => {
    if (obj === null || obj === undefined) return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(convertDecimals);
    }
    
    if (typeof obj === 'object') {
      const converted: any = {};
      for (const key in obj) {
        // Convertir les champs monétaires connus
        if (key === 'prix' || key === 'montant' || key === 'total_contribue' || 
            key === 'reste' || key === 'total_contributions') {
          const value = obj[key];
          converted[key] = typeof value === 'string' ? parseFloat(value) : value;
        } else {
          converted[key] = convertDecimals(obj[key]);
        }
      }
      return converted;
    }
    
    return obj;
  };
  
  if (response.data) {
    response.data = convertDecimals(response.data);
  }
  
  return response;
});
// Auth
export const authAPI = {
  register: (
    username: string,
    email: string,
    password: string,
    first_name?: string,
    last_name?: string
  ) =>
    api.post<User>('/auth/register', {
      username,
      email,
      password,
      first_name: first_name || '',
      last_name: last_name || '',
    }),
  
  login: (username: string, password: string) =>
    api.post<{ message: string; user: User }>(
      '/auth/login',
      new URLSearchParams({ username, password }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    ),
  
  logout: () => api.post('/auth/logout'),
  
  getMe: () => api.get<User>('/auth/me'),
  
  updateAvatar: (avatar_url: string) =>
    api.put('/auth/me/avatar', null, { params: { avatar_url } }),
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{ avatar_url: string }>('/auth/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
// Familles
export const famillesAPI = {
  getAll: () => api.get<Famille[]>('/familles/'),
  getOne: (id: number) => api.get<Famille>(`/familles/${id}`),
  create: (data: Partial<Famille>) => api.post<Famille>('/familles/', data),
  update: (id: number, data: Partial<Famille>) => api.put<Famille>(`/familles/${id}`, data),
  setPereNoel: (familleId: number, userId: number, noelType: 'pere_noel' | 'mere_noel') => api.put(`/familles/${familleId}/pere-noel`, null, { params: { user_id: userId, noel_type: noelType } }),
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
  getContributionsRecap: (familleId: number) => 
    api.get(`/familles/${familleId}/contributions-recap`),
};

// Profils bénéficiaires sans compte
export const beneficiairesAPI = {
  getByFamille: (familleId: number) => api.get<BeneficiaireProfil[]>('/beneficiaires/famille/' + familleId),
  create: (familleId: number, data: { nom: string; responsable_ids: number[] }) =>
    api.post<BeneficiaireProfil>('/beneficiaires/famille/' + familleId, data),
  updateResponsables: (beneficiaireId: number, responsable_ids: number[]) =>
    api.put<BeneficiaireProfil>('/beneficiaires/' + beneficiaireId + '/responsables', { responsable_ids }),
  uploadAvatar: (beneficiaireId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{ avatar_url: string }>('/beneficiaires/' + beneficiaireId + '/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Cadeaux
export const cadeauxAPI = {
  getAll: () => api.get<Cadeau[]>('/cadeaux/'),
  getByFamille: (familleId: number) => api.get<Cadeau[]>(`/cadeaux/famille/${familleId}`), // AJOUTÉ
  getMine: () => api.get<Cadeau[]>('/cadeaux/me'),
  getOne: (id: number) => api.get<Cadeau>(`/cadeaux/${id}`),
  create: (data: Partial<Cadeau>) => api.post<Cadeau>('/cadeaux/', data),
  update: (id: number, data: Partial<Cadeau>) => api.put<Cadeau>(`/cadeaux/${id}`, data),
  delete: (id: number) => api.delete(`/cadeaux/${id}`),
  extractProductImage: (url: string) =>
    api.post<{ photo_url: string; titre?: string | null }>('/produits/extraire-image', { url }),
  uploadPhoto: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{ photo_url: string }>('/cadeaux/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Contributions
export const contributionsAPI = {
  contribute: (cadeauId: number, data: { montant: number; message?: string }) => 
    api.post<Contribution>(`/contributions/cadeaux/${cadeauId}`, data),
  getForCadeau: (cadeauId: number) => 
    api.get<ContributionWithUser[]>(`/contributions/cadeaux/${cadeauId}`),
  getMine: () => 
    api.get<Contribution[]>('/contributions/mes-contributions'),
  getStats: () =>
    api.get<{ total_contribue: number; nombre_contributions: number }>('/contributions/statistics'),
  update: (id: number, data: { montant?: number; message?: string;  }) =>  // ✅ NOUVEAU
    api.put<Contribution>(`/contributions/${id}`, data),
  delete: (id: number) => 
    api.delete(`/contributions/${id}`),
};
export default api;