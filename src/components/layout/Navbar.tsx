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

  const navLink = 'text-sm font-semibold text-white/90 hover:text-[#f7d98c] transition-colors';

  return (
    <header className="sticky top-0 z-40 text-white shadow-[0_3px_16px_rgba(20,48,34,0.2)]">
      <div className="h-[5px] bg-[#e4b957]" />
      <nav className="bg-[#174b36]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-[70px] items-center justify-between gap-4">
            <Link to="/" onClick={closeMenu} className="group flex items-center gap-3">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#c3263b] text-xl shadow-inner ring-1 ring-white/20">
                <span aria-hidden="true">✦</span>
              </span>
              <span>
                <span className="block font-serif text-[21px] font-bold leading-5 tracking-tight">LaHotte</span>
                <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.22em] text-[#f1d18a]">La magie à partager</span>
              </span>
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-white hover:bg-white/10 lg:hidden"
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

            <div className="hidden items-center gap-6 lg:flex">
              {user ? (
                <>
                  <Link to="/familles" className={navLink}>Mes familles</Link>
                  <Link to="/cadeaux" className={navLink}>Mes cadeaux</Link>
                  <Link to="/contributions" className={navLink}>Mes contributions</Link>
                  <Link to="/rechercher" className={navLink}>Rechercher</Link>
                  <PendingInvitations />
                  <div className="h-6 w-px bg-white/20" />
                  <Link to="/profil" className={navLink}>Bonjour, {user.username}</Link>
                  <button onClick={handleLogout} className="rounded-xl bg-[#c3263b] px-4 py-2 text-sm font-bold text-white hover:bg-[#a91b30] transition">
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className={navLink}>Connexion</Link>
                  <Link to="/register" className="rounded-xl bg-[#fff4df] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#a91b30]">
                    Rejoindre LaHotte
                  </Link>
                </>
              )}
            </div>
          </div>

          {isMenuOpen && (
            <div className="border-t border-white/15 py-4 lg:hidden">
              {user ? (
                <div className="flex flex-col gap-1">
                  <div className="mb-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold">{user.username}</div>
                  {[
                    ['/familles', 'Mes familles'],
                    ['/cadeaux', 'Mes cadeaux'],
                    ['/contributions', 'Mes contributions'],
                    ['/rechercher', 'Rechercher'],
                    ['/profil', 'Mon profil'],
                  ].map(([to, label]) => (
                    <Link key={to} to={to} onClick={closeMenu} className="rounded-xl px-4 py-3 text-sm text-white/90 hover:bg-white/10">
                      {label}
                    </Link>
                  ))}
                  <div className="px-2 py-2"><PendingInvitations /></div>
                  <button onClick={handleLogout} className="mt-2 rounded-xl border border-white/25 px-4 py-3 text-left text-sm font-semibold hover:bg-white/10">
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" onClick={closeMenu} className="rounded-xl px-4 py-3 text-sm hover:bg-white/10">Connexion</Link>
                  <Link to="/register" onClick={closeMenu} className="rounded-xl bg-[#fff4df] px-4 py-3 text-center text-sm font-bold text-[#174b36]">Rejoindre LaHotte</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
