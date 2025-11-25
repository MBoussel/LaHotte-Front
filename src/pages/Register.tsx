import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import type { RegisterData } from '../types';

const Register = () => {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    username: '',
    password: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      alert('Compte créé ! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    } else {
      setError(result.error || 'Erreur lors de l\'inscription');
    }
    
    setLoading(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8">
      <div className="card max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-2 text-christmas-green">
          🎅 Inscription
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Créez votre compte pour commencer
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="input"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nom d'utilisateur</label>
            <input
              type="text"
              name="username"
              className="input"
              placeholder="pseudo"
              value={formData.username}
              onChange={handleChange}
              required
              minLength={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Prénom</label>
              <input
                type="text"
                name="first_name"
                className="input"
                placeholder="Marc"
                value={formData.first_name || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input
                type="text"
                name="last_name"
                className="input"
                placeholder="Dupont"
                value={formData.last_name || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input
              type="password"
              name="password"
              className="input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
          </div>

          <button
            type="submit"
            className="btn-secondary w-full"
            disabled={loading}
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-christmas-green font-semibold hover:underline">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;