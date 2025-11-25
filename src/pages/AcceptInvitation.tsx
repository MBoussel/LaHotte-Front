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

  useEffect(() => {
    if (user && token) {
      acceptInvitation();
    } else if (!user) {
      setLoading(false);
    }
  }, [user, token]);

  const acceptInvitation = async () => {
    if (!token) return;

    try {
      await famillesAPI.acceptInvitation(token);
      alert('Vous avez rejoint la famille ! 🎉');
      navigate('/familles');
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Erreur lors de l\'acceptation');
      setLoading(false);
    }
  };

  if (loading && user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎄</div>
          <p className="text-xl">Traitement de votre invitation...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎁</div>
          <h1 className="text-2xl font-bold mb-4">Invitation à rejoindre une famille</h1>
          <p className="text-gray-600 mb-6">
            Pour accepter cette invitation, vous devez d'abord vous connecter ou créer un compte.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login', { state: { redirectTo: `/invitation/${token}` } })}
              className="flex-1 btn-primary"
            >
              Se connecter
            </button>
            <button
              onClick={() => navigate('/register', { state: { redirectTo: `/invitation/${token}` } })}
              className="flex-1 btn-secondary"
            >
              Créer un compte
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-4">Erreur</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <button onClick={() => navigate('/familles')} className="btn-primary">
            Retour aux familles
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AcceptInvitation;