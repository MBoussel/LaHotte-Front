import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Familles from './pages/Familles';
import FamilleDetail from './pages/FamilleDetail';
import MesCadeaux from './pages/MesCadeaux';
import AcceptInvitation from './pages/AcceptInvitation';
import RechercherFamilles from './pages/RechercherFamilles';
import MesContributions from './pages/MesContributions';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RecapContributions from './pages/RecapContributions';
import Profil from './pages/Profil';

type Theme = 'light' | 'dark';


function CursorStarTrail({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || reducedMotion.matches) return;

    const layer = document.createElement('div');
    layer.className = 'cursor-star-trail';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);

    let lastX = 0;
    let lastY = 0;
    let hasMoved = false;

    const createStar = (x: number, y: number) => {
      const star = document.createElement('span');
      const symbols = ['✦', '✧', '✶'];
      star.className = 'cursor-trail-star';
      star.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      star.style.left = `${x + (Math.random() - 0.5) * 16}px`;
      star.style.top = `${y + (Math.random() - 0.5) * 16}px`;
      star.style.fontSize = `${7 + Math.random() * 10}px`;
      star.style.setProperty('--star-rotate', `${Math.random() * 100 - 50}deg`);
      star.style.setProperty('--star-life', `${650 + Math.random() * 450}ms`);
      layer.appendChild(star);
      star.addEventListener('animationend', () => star.remove(), { once: true });
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      if (hasMoved && dx * dx + dy * dy < 100) return;
      lastX = event.clientX;
      lastY = event.clientY;
      hasMoved = true;
      createStar(event.clientX, event.clientY);
      if (Math.random() > 0.68) {
        createStar(event.clientX + (Math.random() - 0.5) * 22, event.clientY + (Math.random() - 0.5) * 22);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      layer.remove();
    };
  }, [enabled]);

  return null;
}

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = window.localStorage.getItem('lahotte-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [effectsEnabled, setEffectsEnabled] = useState<boolean>(() =>
    window.localStorage.getItem('lahotte-effects') !== 'off'
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.effects = effectsEnabled ? 'on' : 'off';
  }, [effectsEnabled]);

  useEffect(() => {
    if (window.localStorage.getItem('lahotte-theme')) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const syncWithSystem = (event: MediaQueryListEvent) => setTheme(event.matches ? 'dark' : 'light');
    media.addEventListener('change', syncWithSystem);
    return () => media.removeEventListener('change', syncWithSystem);
  }, []);

  const toggleEffects = () => setEffectsEnabled((current) => {
    const next = !current;
    window.localStorage.setItem('lahotte-effects', next ? 'on' : 'off');
    return next;
  });

  const toggleTheme = () => setTheme((current) => {
    const next = current === 'light' ? 'dark' : 'light';
    window.localStorage.setItem('lahotte-theme', next);
    return next;
  });

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell min-h-screen bg-gray-50">
          <CursorStarTrail enabled={effectsEnabled} />
          <Navbar theme={theme} onToggleTheme={toggleTheme} effectsEnabled={effectsEnabled} onToggleEffects={toggleEffects} />
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/invitation/:token" element={<AcceptInvitation />} />
            
            {/* Routes protégées */}
            <Route
              path="/familles"
              element={
                <ProtectedRoute>
                  <Familles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/familles/:id"
              element={
                <ProtectedRoute>
                  <FamilleDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cadeaux"
              element={
                <ProtectedRoute>
                  <MesCadeaux />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contributions"
              element={
                <ProtectedRoute>
                  <MesContributions />
                </ProtectedRoute>
              }
            />
            <Route
  path="/profil"
  element={
    <ProtectedRoute>
      <Profil/>
    </ProtectedRoute>
  }
/>
            <Route
  path="/familles/:id/contributions-recap"
  element={
    <ProtectedRoute>
      <RecapContributions/>
    </ProtectedRoute> 
  }
/>

            <Route
              path="/rechercher"
              element={
                <ProtectedRoute>
                  <RechercherFamilles />
                </ProtectedRoute>
              }
            />

            {/* Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;