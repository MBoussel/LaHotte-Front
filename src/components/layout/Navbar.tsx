import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import PendingInvitations from '../familles/PendingInvitations';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/login');
  };

  const navLink = 'text-sm font-medium text-white/85 hover:text-white transition-colors';

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#1d4033] text-white shadow-[0_2px_12px_rgba(15,35,27,0.12)]">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-[68px] items-center justify-between gap-4">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-lg">L</span>
            <span className="text-[17px] font-semibold tracking-tight">LaHotte</span>
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white hover:bg-white/10 lg:hidden"
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isMenuOpen}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>

          <div className="hidden items-center gap-7 lg:flex">
            {user ? (
              <>
                <Link to="/familles" className={navLink}>Mes familles</Link>
                <Link to="/cadeaux" className={navLink}>Mes cadeaux</Link>
                <Link to="/contributions" className={navLink}>Mes contributions</Link>
                <Link to="/rechercher" className={navLink}>Rechercher</Link>
                <PendingInvitations />
                <div className="h-6 w-px bg-white/20" />
                <Link to="/profil" className={navLink}>Bonjour, {user.username}</Link>
                <button onClick={handleLogout} className="rounded-lg border border-white/25 px-4 py-2 text-sm font-medium text-white hover:bg-white hover:text-[#1d4033] transition">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={navLink}>Connexion</Link>
                <Link to="/register" className="rounded-lg bg-[#f4f0e7] px-4 py-2 text-sm font-semibold text-[#1d4033] hover:bg-white">
                  Créer un compte
                </Link>
              </>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="border-t border-white/15 py-4 lg:hidden">
            {user ? (
              <div className="flex flex-col gap-1">
                <div className="mb-2 rounded-lg bg-white/10 px-4 py-3 text-sm font-semibold">{user.username}</div>
                {[
                  ['/familles', 'Mes familles'],
                  ['/cadeaux', 'Mes cadeaux'],
                  ['/contributions', 'Mes contributions'],
                  ['/rechercher', 'Rechercher'],
                  ['/profil', 'Mon profil'],
                ].map(([to, label]) => (
                  <Link key={to} to={to} onClick={closeMenu} className="rounded-lg px-4 py-3 text-sm text-white/90 hover:bg-white/10">
                    {label}
                  </Link>
                ))}
                <div className="px-2 py-2"><PendingInvitations /></div>
                <button onClick={handleLogout} className="mt-2 rounded-lg border border-white/25 px-4 py-3 text-left text-sm font-medium hover:bg-white/10">
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={closeMenu} className="rounded-lg px-4 py-3 text-sm hover:bg-white/10">Connexion</Link>
                <Link to="/register" onClick={closeMenu} className="rounded-lg bg-[#f4f0e7] px-4 py-3 text-center text-sm font-semibold text-[#1d4033]">Créer un compte</Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
