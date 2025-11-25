import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import PendingInvitations from '../familles/PendingInvitations';

const Navbar = () => {
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

  return (
    <nav className="bg-christmas-red text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl md:text-2xl font-bold flex items-center gap-2" onClick={closeMenu}>
            🎄 Liste de Noël
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {user ? (
              <>
                <Link to="/familles" className="hover:text-christmas-gold transition">
                  Mes Familles
                </Link>
                <Link to="/cadeaux" className="hover:text-christmas-gold transition">
                  Mes Cadeaux
                </Link>
                <PendingInvitations />
                <div className="flex items-center gap-3">
                  <span className="text-sm">Bonjour, {user.username} 👋</span>
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white focus:outline-none"
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-red-700 py-4">
            {user ? (
              <div className="flex flex-col space-y-3">
                <div className="px-4 py-2 bg-red-700 rounded">
                  <span className="text-sm font-semibold">👋 {user.username}</span>
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