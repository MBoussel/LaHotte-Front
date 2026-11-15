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

  const navLink = 'text-sm font-medium text-[#fff9ed]/85 hover:text-[#f4d99f] transition-colors';

  return (
    <header className="sticky top-0 z-40 border-b border-[#f4e6c9]/15 bg-[#193d31] text-white shadow-[0_3px_16px_rgba(17,42,32,0.18)]">
      <div className="h-[3px] bg-[linear-gradient(90deg,#a43e42,#d2b77d,#a43e42)] opacity-90" />
      <nav className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-[68px] items-center justify-between gap-4">
          <Link to="/" onClick={closeMenu} className="group flex items-center gap-3">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#e5cf9e]/50 bg-[#f1dfb8]/10 text-[#f4d99f] transition group-hover:bg-[#f1dfb8]/20">
              <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" aria-hidden="true">
                <path d="M16 4 7 17h5l-3 5h14l-3-5h5L16 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M16 22v5M12 27h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="m16 8 .8 2.1L19 11l-2.2.8L16 14l-.8-2.2L13 11l2.2-.9L16 8Z" fill="currentColor"/>
              </svg>
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#c85b54] ring-2 ring-[#193d31]" />
            </span>
            <span>
              <span className="block font-serif text-[21px] leading-5 tracking-wide text-[#fff8e9]">LaHotte</span>
              <span className="mt-1 block text-[9px] uppercase tracking-[0.22em] text-[#d7c69e]">La magie de partager</span>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18 18 6M6 6l12 12" />
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
                <button onClick={handleLogout} className="rounded-xl border border-[#e5cf9e]/45 px-4 py-2 text-sm font-medium text-[#fff8e9] hover:bg-[#f1dfb8] hover:text-[#193d31] transition">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={navLink}>Connexion</Link>
                <Link to="/register" className="rounded-xl bg-[#f1dfb8] px-4 py-2.5 text-sm font-semibold text-[#193d31] hover:bg-[#fff4dc]">
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
                <div className="mb-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-[#f4d99f]">{user.username}</div>
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
                <button onClick={handleLogout} className="mt-2 rounded-xl border border-white/25 px-4 py-3 text-left text-sm font-medium hover:bg-white/10">
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={closeMenu} className="rounded-xl px-4 py-3 text-sm hover:bg-white/10">Connexion</Link>
                <Link to="/register" onClick={closeMenu} className="rounded-xl bg-[#f1dfb8] px-4 py-3 text-center text-sm font-semibold text-[#193d31]">Créer un compte</Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
