import { useState } from 'react';
import type { Membre } from '../../types';

interface MembresSectionProps {
  membres?: Membre[];
}

const MembresSection = ({ membres = [] }: MembresSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!membres || membres.length === 0) {
    return null;
  }

  const defaultCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 2 : 3;
  const displayedMembres = isExpanded ? membres : membres.slice(0, defaultCount);
  const hasMore = membres.length > defaultCount;

  return (
    <div className="mb-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4">👥 Membres ({membres.length})</h2>
      
      <div className="card">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {displayedMembres.map((membre) => (
            <div
              key={membre.id}
              className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              {/* Avatar avec image ou initiale */}
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
                <p className="font-semibold text-sm truncate">{membre.username}</p>
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