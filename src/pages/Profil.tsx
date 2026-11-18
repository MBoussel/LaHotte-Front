import AppIcon from '../components/ui/AppIcon';
import { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { authAPI } from '../services/api';

type ProfilProps = { effectsEnabled: boolean; onToggleEffects: () => void; };

const Profil = ({ effectsEnabled, onToggleEffects }: ProfilProps) => {
  const { user, setUser } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.avatar_url) {
      setAvatarUrl(user.avatar_url);
    }
  }, [user]);

  const handleUpdateAvatar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authAPI.updateAvatar(avatarUrl);
      
      // Rafraîchir les infos utilisateur
      const meRes = await authAPI.getMe();
      setUser(meRes.data);
      
      setIsEditing(false);
      alert('Avatar mis à jour ! ✅');
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Erreur lors de la mise à jour');
    }
    setLoading(false);
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
          {/* Avatar actuel */}
          <div className="flex-shrink-0">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.username}
                className="w-32 h-32 rounded-full object-cover border-4 border-christmas-red"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-32 h-32 bg-christmas-red text-white rounded-full flex items-center justify-center text-5xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Formulaire ou infos */}
          <div className="flex-1 w-full">
            {isEditing ? (
              <form onSubmit={handleUpdateAvatar} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    URL de votre photo
                  </label>
                  <input
                    type="url"
                    className="input"
                    placeholder="https://exemple.com/ma-photo.jpg"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Utilisez un lien direct vers une image (JPG, PNG, etc.)
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1"
                  >
                    {loading ? 'Enregistrement...' : '✅ Enregistrer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setAvatarUrl(user.avatar_url || '');
                    }}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-600">
                  {user.avatar_url
                    ? 'Vous avez une photo de profil personnalisée'
                    : 'Vous utilisez une initiale comme photo de profil'}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary"
                  >
                    {user.avatar_url ? '✏️ Modifier' : '➕ Ajouter une photo'}
                  </button>
                  {user.avatar_url && (
                    <button
                      onClick={handleRemoveAvatar}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                    >
                      <AppIcon name="trash" size={17} /> Supprimer
                    </button>
                  )}
                </div>
              </div>
            )}
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