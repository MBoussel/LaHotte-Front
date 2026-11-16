import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../utils/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [santaClickId, setSantaClickId] = useState(0);
  const [santaClicks, setSantaClicks] = useState(0);
  const [santaFlying, setSantaFlying] = useState(false);
  const [biscuitClickId, setBiscuitClickId] = useState(0);
  const [biscuitClicks, setBiscuitClicks] = useState(0);
  const [biscuitFlying, setBiscuitFlying] = useState(false);

  const clickLoginCharacter = (character: 'santa' | 'biscuit') => {
    const flying = character === 'santa' ? santaFlying : biscuitFlying;
    if (flying) return;

    if (character === 'santa') {
      const next = santaClicks + 1;
      setSantaClickId(id => id + 1);
      setSantaClicks(next);
      if (next >= 5) {
        setSantaFlying(true);
        window.setTimeout(() => { setSantaFlying(false); setSantaClicks(0); }, 2700);
      }
    } else {
      const next = biscuitClicks + 1;
      setBiscuitClickId(id => id + 1);
      setBiscuitClicks(next);
      if (next >= 5) {
        setBiscuitFlying(true);
        window.setTimeout(() => { setBiscuitFlying(false); setBiscuitClicks(0); }, 2700);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Login (le cookie est défini automatiquement par le backend)
      const response = await authAPI.login(formData.username, formData.password);
      
      // Mettre à jour le contexte avec les infos utilisateur
      setUser(response.data.user);

      navigate('/familles');
    } catch (err: any) {
      console.error('Erreur login:', err);
      setError(err.response?.data?.detail || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-page min-h-screen flex items-center justify-center bg-gradient-to-br from-christmas-red to-christmas-green px-4">
      <div className="login-floating-decor" aria-label="Personnages de Noël interactifs">
        <div className="login-character login-santa">
          <span key={santaClickId} className="gingerbread-score-pop santa-score-pop" aria-live="polite">{santaClickId > 0 ? '+1' : ''}</span>
          <button type="button" className={`login-character-button${santaFlying ? ' holiday-character-flying' : ''}`} onClick={() => clickLoginCharacter('santa')} aria-label="Cliquer sur le Père Noël" title="Attrape le Père Noël !">
            <img src="https://cdn-icons-png.flaticon.com/512/9204/9204869.png" alt="" />
          </button>
        </div>
        <div className="login-character login-biscuit">
          <span key={biscuitClickId} className="gingerbread-score-pop" aria-live="polite">{biscuitClickId > 0 ? '+1' : ''}</span>
          <button type="button" className={`login-character-button${biscuitFlying ? ' holiday-character-flying' : ''}`} onClick={() => clickLoginCharacter('biscuit')} aria-label="Cliquer sur le biscuit" title="Attrape le biscuit !">
            <img src="https://cdn-icons-png.flaticon.com/512/8732/8732463.png" alt="" />
          </button>
        </div>
      </div>

      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-christmas-red mb-2">
            🎄 Liste de Noël
          </h1>
          <p className="text-gray-600">Connectez-vous à votre compte</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email ou nom d'utilisateur
            </label>
            <input
              type="text"
              name="username"
              className="input"
              placeholder="email@example.com"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              className="input"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-christmas-red hover:underline font-semibold">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;