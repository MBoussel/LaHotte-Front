import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      await authAPI.register(
        formData.username,
        formData.email,
        formData.password,
        formData.first_name,
        formData.last_name
      );
      navigate('/login');
    } catch (err: any) {
      console.error('Erreur register:', err);
      setError(err.response?.data?.detail || 'Erreur lors de l\'inscription');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="christmas-hero relative flex min-h-[calc(100vh-71px)] items-center justify-center overflow-hidden px-4 py-12">
      <div className="christmas-lights absolute inset-x-0 top-0 h-9 opacity-90" aria-hidden="true" />
      <span className="snowflake absolute left-[10%] top-24 text-2xl" aria-hidden="true">✳</span>
      <span className="snowflake absolute right-[11%] bottom-20 text-xl" aria-hidden="true">✳</span>
      <div className="relative w-full max-w-lg rounded-2xl border border-[#e8dcc2] bg-[#fffdf7] p-6 shadow-[0_22px_65px_rgba(8,29,21,0.28)] sm:p-9">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#d8c69e] bg-[#f5efdf] text-2xl text-[#315b42]">✦</div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#9a7746]">La magie commence ici</p>
          <h1 className="mt-1 font-serif text-4xl font-semibold text-[#214638]">Rejoindre LaHotte</h1>
          <p className="mt-2 text-sm text-[#73776b]">Créez votre compte pour préparer les fêtes avec vos proches.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#435246]">Prénom *</label>
              <input type="text" name="first_name" className="input" value={formData.first_name} onChange={handleChange} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-[#435246]">Nom *</label>
              <input type="text" name="last_name" className="input" value={formData.last_name} onChange={handleChange} required />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#435246]">Nom d'utilisateur *</label>
            <input type="text" name="username" className="input" value={formData.username} onChange={handleChange} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#435246]">Email *</label>
            <input type="email" name="email" className="input" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#435246]">Mot de passe *</label>
            <input type="password" name="password" className="input" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-primary w-full !rounded-xl !py-3">Créer mon compte</button>
        </form>

        <p className="mt-6 text-center text-sm text-[#73776b]">
          Déjà un compte ?{' '}
          <Link to="/login" className="font-bold text-[#9b3f43] hover:underline">Se connecter</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;