import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../utils/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const redirectUrl = searchParams.get('redirect');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      await authAPI.register(formData.username, formData.email, formData.password);

      // Connexion automatique
      const loginResponse = await authAPI.login(formData.username, formData.password);
      localStorage.setItem('access_token', loginResponse.data.access_token);

      // Récupérer les infos utilisateur
      const userResponse = await authAPI.getMe();
      setUser(userResponse.data);

      // Rediriger
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate('/familles');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors de l\'inscription');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-christmas-red mb-2">
            🎄 Liste de Noël
          </h1>
          <p className="text-gray-600">Créez votre compte</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {redirectUrl && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4 text-sm">
            ℹ️ Créez un compte pour continuer
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nom d'utilisateur *
            </label>
            <input
              type="text"
              name="username"
              className="input"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              className="input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Mot de passe *
            </label>
            <input
              type="password"
              name="password"
              className="input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirmer le mot de passe *
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Créer mon compte
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Déjà un compte ?{' '}
          <Link
            to={redirectUrl ? `/login?redirect=${redirectUrl}` : '/login'}
            className="text-christmas-red hover:underline font-semibold"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;