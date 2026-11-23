import AppIcon from '../components/ui/AppIcon';
import { useState, useEffect, type ChangeEvent } from 'react';
import { useAuth } from '../utils/AuthContext';
import { authAPI } from '../services/api';

type ProfilProps = { effectsEnabled: boolean; onToggleEffects: () => void; };

const Profil = ({ effectsEnabled, onToggleEffects }: ProfilProps) => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, []);

  const handleUploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('La photo ne doit pas dépasser 5 Mo.');
      return;
    }
    setLoading(true);
    try {
      await authAPI.uploadAvatar(file);
      const meRes = await authAPI.getMe();
      setUser(meRes.data);
      alert('Photo de profil mise à jour !');
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Erreur lors de l’envoi de la photo');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!confirm('Voulez-vous vraiment supprimer votre avatar ?')) return;

    setLoading(true);
    try {
      await authAPI.updateAvatar('');
      const meRes = await authAPI.getMe();
      setUser(meRes.data);
      setAvatarUrl('');
      alert('Avatar supprimé ✅');
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-2xl">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-christmas-red mb-2">
          <AppIcon name="user" size={26} /> Mon Profil
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Gérez vos informations personnelles
        </p>
      </div>

      {/* Carte Avatar */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">Photo de profil</h2>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.username} className="w-32 h-32 rounded-full object-cover border-4 border-christmas-red" />
            ) : (
              <div className="w-32 h-32 bg-christmas-red text-white rounded-full flex items-center justify-center text-5xl font-bold">{user.username.charAt(0).toUpperCase()}</div>
            )}
          </div>
          <div className="flex-1 w-full space-y-3">
            <p className="text-gray-600">{user.avatar_url ? 'Votre photo de profil actuelle' : 'Aucune photo : votre initiale est affichée'}</p>
            <label className={`inline-flex items-center justify-center rounded-lg px-4 py-2 font-semibold cursor-pointer ${loading ? 'bg-gray-300 text-gray-500' : 'btn-primary'}`}>
              {loading ? 'Envoi en cours…' : user.avatar_url ? 'Modifier ma photo' : 'Ajouter une photo'}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleUploadAvatar} disabled={loading} />
            </label>
            <p className="text-xs text-gray-500">Formats JPG, PNG ou WebP · 5 Mo maximum</p>
            {user.avatar_url && <button type="button" onClick={handleRemoveAvatar} disabled={loading} className="ml-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition"><AppIcon name="trash" size={17} /> Supprimer</button>}
          </div>
        </div>
      </div>


      {/* Carte Préférences */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-2">Préférences d'affichage</h2>
        <p className="text-sm text-gray-600 mb-4">
          Personnalisez les animations et les petits effets visuels de LaHotte sur cet appareil.
        </p>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold">Effets visuels</p>
            <p className="text-sm text-gray-500">
              {effectsEnabled ? 'Les effets sont activés' : 'Les effets sont désactivés'}
            </p>
          </div>
          <button
            type="button"
            onClick={onToggleEffects}
            aria-pressed={effectsEnabled}
            className="btn-primary shrink-0"
          >
            {effectsEnabled ? 'Désactiver' : 'Activer'}
          </button>
        </div>
      </div>

      {/* Carte Informations */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Informations personnelles</h2>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Nom d'utilisateur</p>
            <p className="font-semibold">{user.username}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-semibold">{user.email}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Prénom</p>
            <p className="font-semibold">{user.first_name || '—'}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Nom</p>
            <p className="font-semibold">{user.last_name || '—'}</p>
          </div>

          {user.is_admin && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <AppIcon name="crown" size={18} /> <strong>Administrateur</strong> - Vous avez accès aux fonctionnalités d'administration
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profil;