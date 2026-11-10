import { useState, useEffect } from 'react';
import type { Membre } from '../../types';

interface MembresSectionProps {
  membres?: Membre[];
  pereNoelId?: number | null;
  noelType?: 'pere_noel' | 'mere_noel';
  currentUserId?: number;
}

const MembresSection = ({ membres = [], pereNoelId, noelType = 'pere_noel', currentUserId }: MembresSectionProps) => {
  const noelLabel = noelType === 'mere_noel' ? 'Mère Noël' : 'Père Noël';
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Détecte si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile(); // Check initial
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  if (!membres || membres.length === 0) {
    return null;
  }

  const defaultCount = isMobile ? 2 : 3;
  const displayedMembres = isExpanded ? membres : membres.slice(0, defaultCount);
  const hasMore = membres.length > defaultCount;

  return (
    <div className="mb-6">
      {currentUserId != null && pereNoelId === currentUserId && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900">
          <p className="font-bold">{noelType === 'mere_noel' ? '🎄 Tu es la Mère Noël de cette famille !' : '🎅 Tu es le Père Noël de cette famille !'}</p>
          <p className="text-sm mt-1">Tu peux suivre les contributions aux cadeaux des autres membres.</p>
        </div>
      )}
      <h2 className="text-xl md:text-2xl font-bold mb-4">👥 Membres ({membres.length})</h2>
      
      <div className="card">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {displayedMembres.map((membre) => (
            <div
              key={membre.id}
              className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              {membre.avatar_url ? (
                <img
                  src={membre.avatar_url}
                  alt={membre.username}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-christmas-red"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div 
                className={`w-10 h-10 bg-christmas-red text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                  membre.avatar_url ? 'hidden' : ''
                }`}
              >
                {membre.username.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1">
                  <p className="font-semibold text-sm truncate">{membre.username}</p>
                  {pereNoelId != null && membre.id === pereNoelId && (
                    <span className="text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 px-2 py-0.5">{noelLabel}</span>
                  )}
                </div>
                <p className="text-xs text-gray-600 truncate">{membre.email}</p>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mt-4 text-sm text-christmas-red hover:text-red-800 font-semibold transition py-2 border-t"
          >
            {isExpanded ? (
              <>↑ Voir moins</>
            ) : (
              <>↓ Voir tous les membres ({membres.length - defaultCount} de plus)</>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default MembresSection;