import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { famillesAPI } from '../services/api';
import { useAuth } from '../utils/AuthContext';

const AcceptInvitation = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [familleNom, setFamilleNom] = useState('');

  useEffect(() => {
    // Si l'utilisateur est connecté, accepter directement
    if (user && token) {
      acceptInvitation();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  const acceptInvitation = async () => {
    if (!token) return;

    setLoading(true);
    setError('');

    try {
      const response = await famillesAPI.acceptInvitation(token);
      setFamilleNom(response.data.famille_nom || 'la famille');
      
      // Rediriger vers la famille après 2 secondes
      setTimeout(() => {
        navigate('/familles');
      }, 2000);
    } catch (err: any) {
      console.error('Erreur:', err);
      const errorMessage = err.response?.data?.detail || 'Erreur lors de l\'acceptation';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Si l'utilisateur n'est pas connecté
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="card max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎄</div>
          <h1 className="text-2xl font-bold text-christmas-red mb-4">
            Invitation à rejoindre une famille
          </h1>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour accepter cette invitation.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate(`/login?redirect=/invitation/${token}`)}
              className="btn-primary w-full"
            >
              Se connecter
            </button>
            <button
              onClick={() => navigate(`/register?redirect=/invitation/${token}`)}
              className="btn-secondary w-full"
            >
              Créer un compte
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si erreur
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="card max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Erreur
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/familles')}
            className="btn-secondary"
          >
            Retour aux familles
          </button>
        </div>
      </div>
    );
  }

  // Si chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="card max-w-md w-full text-center">
          <div className="text-6xl mb-4 animate-bounce">🎁</div>
          <h1 className="text-2xl font-bold text-christmas-red mb-4">
            Acceptation en cours...
          </h1>
          <p className="text-gray-600">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  // Si succès
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="card max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-christmas-green mb-4">
          Bienvenue dans {familleNom} !
        </h1>
        <p className="text-gray-600 mb-6">
          Vous faites maintenant partie de cette famille.
          Redirection en cours...
        </p>
        <button
          onClick={() => navigate('/familles')}
          className="btn-primary"
        >
          Voir mes familles
        </button>
      </div>
    </div>
  );
};

export default AcceptInvitation;