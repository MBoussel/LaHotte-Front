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

  const displayedMembres = isExpanded ? membres : membres.slice(0, 6);
  const hasMore = membres.length > 6;

  return (
    <div className="mb-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4">👥 Membres ({membres.length})</h2>
      
      <div className="card">
        {/* Grille responsive : 2 colonnes sur mobile, 3 sur desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {displayedMembres.map((membre) => (
            <div
              key={membre.id}
              className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
            >
              <div className="w-10 h-10 bg-christmas-red text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
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
              <>↓ Voir tous les membres ({membres.length - 6} de plus)</>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default MembresSection;