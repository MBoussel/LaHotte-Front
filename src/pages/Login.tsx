import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../utils/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authAPI.login(formData.username, formData.password);
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
    <main className="christmas-hero relative flex min-h-[calc(100vh-71px)] items-center justify-center overflow-hidden px-4 py-12">
      <div className="christmas-lights absolute inset-x-0 top-0 h-9 opacity-90" aria-hidden="true" />
      <span className="snowflake absolute left-[12%] top-24 text-2xl" aria-hidden="true">✳</span>
      <span className="snowflake absolute right-[13%] bottom-24 text-xl" aria-hidden="true">✳</span>
      <div className="relative w-full max-w-md rounded-2xl border border-[#e8dcc2] bg-[#fffdf7] p-6 shadow-[0_22px_65px_rgba(8,29,21,0.28)] sm:p-9">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#d8c69e] bg-[#f5efdf] text-3xl text-[#315b42]">✦</div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#9a7746]">Bienvenue dans</p>
          <h1 className="mt-1 font-serif text-4xl font-semibold text-[#214638]">LaHotte</h1>
          <p className="mt-2 text-sm text-[#73776b]">Retrouvez votre famille et préparez les surprises.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#435246]">Email ou nom d'utilisateur</label>
            <input type="text" name="username" className="input" placeholder="email@example.com" value={formData.username} onChange={handleChange} disabled={loading} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#435246]">Mot de passe</label>
            <input type="password" name="password" className="input" value={formData.password} onChange={handleChange} disabled={loading} required />
          </div>
          <button type="submit" className="btn-primary w-full !rounded-xl !py-3" disabled={loading}>
            {loading ? 'Connexion...' : 'Entrer dans ma Hotte'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#73776b]">
          Pas encore de compte ?{' '}
          <Link to="/register" className="font-bold text-[#9b3f43] hover:underline">Créer un compte</Link>
        </p>
        <p className="mt-7 text-center font-serif text-sm italic text-[#a58b5b]">Le plaisir d’offrir, ensemble.</p>
      </div>
    </main>
  );
};

export default Login;