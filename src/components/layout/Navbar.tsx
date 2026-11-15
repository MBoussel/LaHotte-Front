import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import PendingInvitations from '../familles/PendingInvitations';

type NavbarProps = { theme: 'light' | 'dark'; onToggleTheme: () => void };

const Navbar = ({ theme, onToggleTheme }: NavbarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-christmas-red text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl md:text-2xl font-bold flex items-center gap-2" onClick={closeMenu}>
            🎄 Liste de Noël
          </Link>

          {/* Bouton Burger (Mobile) */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <button type="button" onClick={onToggleTheme} aria-label={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'} className="theme-switch inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10">
              <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
              <span>{theme === 'light' ? 'Sombre' : 'Clair'}</span>
            </button>
            {user ? (
              <>
                <Link to="/familles" className="hover:text-christmas-gold transition">
                  Mes Familles
                </Link>
                <Link to="/cadeaux" className="hover:text-christmas-gold transition">
                  Mes Cadeaux
                </Link>
                                <Link to="/contributions" className="hover:text-christmas-gold transition">
   Mes Contributions
</Link>
                <Link to="/rechercher" className="hover:text-christmas-gold transition">
                  🔍 Rechercher
                </Link>
                <PendingInvitations />
                <div className="flex items-center gap-3">
                  <Link to="/profil" className="hover:text-christmas-gold transition">
     Mon profil
  </Link>
                  <span className="text-sm">Bonjour, {user.username} </span>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-christmas-red px-4 py-1 rounded hover:bg-gray-100 transition"
                  >
                    Déconnexion
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-christmas-gold transition">
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-christmas-red px-4 py-2 rounded hover:bg-gray-100 transition"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-red-700 py-4">
            <button type="button" onClick={onToggleTheme} className="theme-switch mx-2 mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-2 text-sm font-semibold text-white">
              <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
              {theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
            </button>
            {user ? (
              <div className="flex flex-col space-y-3">
                <div className="px-4 py-2 bg-red-700 rounded">
                  <span className="text-sm font-semibold"> {user.username}</span>
                </div>
                
                <Link
                  to="/familles"
                  className="px-4 py-2 hover:bg-red-700 rounded transition"
                  onClick={closeMenu}
                >
                  👨‍👩‍👧‍👦 Mes Familles
                </Link>
                
                <Link
                  to="/cadeaux"
                  className="px-4 py-2 hover:bg-red-700 rounded transition"
                  onClick={closeMenu}
                >
                  🎁 Mes Cadeaux
                </Link>
                 <Link
          to="/contributions"
          className="px-4 py-2 hover:bg-red-700 rounded transition"
          onClick={closeMenu}
        >
          💝 Mes Contributions
        </Link>
                <Link
                  to="/rechercher"
                  className="px-4 py-2 hover:bg-red-700 rounded transition"
                  onClick={closeMenu}
                >
                  🔍 Rechercher
                </Link>
                <Link
  to="/profil"
  className="px-4 py-2 hover:bg-red-700 rounded transition"
  onClick={closeMenu}
>
  👤 Mon profil
</Link>
                <div className="px-4">
                  <PendingInvitations />
                </div>
                
                <button
                  onClick={handleLogout}
                  className="mx-4 bg-white text-christmas-red px-4 py-2 rounded hover:bg-gray-100 transition font-semibold"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link
                  to="/login"
                  className="px-4 py-2 hover:bg-red-700 rounded transition"
                  onClick={closeMenu}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="mx-4 bg-white text-christmas-red px-4 py-2 rounded hover:bg-gray-100 transition font-semibold text-center"
                  onClick={closeMenu}
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;