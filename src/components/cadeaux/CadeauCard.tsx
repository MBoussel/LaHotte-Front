import AppIcon from '../ui/AppIcon';
import type { Cadeau, ContributionWithUser, Membre } from '../../types';

interface CadeauCardProps {
  cadeau: Cadeau;
  contributions: ContributionWithUser[];
  membres?: Membre[];
  currentUserId?: number;
  canSeeContributions?: boolean;
  onContribute: (cadeau: { id: number; titre: string; prix: number; owner_id: number }) => void;
  embedded?: boolean;
  onToggleFavorite?: (cadeauId: number, isFavorite: boolean) => void;
}

const CadeauCard = ({ cadeau, contributions, membres, currentUserId, canSeeContributions = false, onContribute, embedded = false, onToggleFavorite }: CadeauCardProps) => {
  const totalContribue = contributions.reduce((sum, c) => sum + c.montant, 0);
  const reste = cadeau.prix - totalContribue;
  const pourcentage = Math.min((totalContribue / cadeau.prix) * 100, 100);
  const isOwner = currentUserId === cadeau.owner_id;

  return (
    <div
      className={cadeau.is_favorite && !embedded
        ? `gift-favorite-magic rounded-2xl border-2 border-amber-400 bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 shadow-[0_0_18px_rgba(245,158,11,0.32),0_0_38px_rgba(245,158,11,0.22)] p-6`
        : embedded ? "min-w-0" : "card hover:shadow-xl transition"}
      style={cadeau.is_favorite && !embedded ? { backgroundSize: "220% 100%", animation: "gold-flow 3s ease-in-out infinite" } : undefined}
    >
      {cadeau.photo_url && (
        <img
          src={cadeau.photo_url}
          alt={cadeau.titre}
          className="w-full h-48 object-cover rounded-lg mb-4"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      )}

      <div className="flex items-center gap-2 text-sm mb-3 text-gray-600">
        <span className="font-semibold">Liste de :</span>
        <span className="bg-gray-100 px-3 py-1 rounded-full">
          {cadeau.beneficiaire_profil_nom || membres?.find((m) => m.id === cadeau.owner_id)?.username || ("User #" + cadeau.owner_id)}
        </span>
      </div>

      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <h3 className="text-xl font-bold min-w-0">{cadeau.titre}</h3>
          {embedded && cadeau.is_favorite && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
              <span aria-hidden="true">★</span> Favori
            </span>
          )}
        </div>
      </div>
      {embedded && isOwner && onToggleFavorite && (
        <button type="button" onClick={() => onToggleFavorite(cadeau.id, !cadeau.is_favorite)} aria-pressed={!!cadeau.is_favorite} className={`mb-3 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${cadeau.is_favorite ? "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}`}>
          {cadeau.is_favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        </button>
      )}
      <p className="text-2xl font-bold text-christmas-red mb-2">{cadeau.prix} €</p>

      {cadeau.beneficiaires && cadeau.beneficiaires.length > 0 && (
        <div className="mb-3">
          <div className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
            <span className="inline-flex items-center gap-1"><AppIcon name="members" size={16} /> Pour:</span>
            <span className="font-semibold">{cadeau.beneficiaires.map(b => b.username).join(', ')}</span>
          </div>
        </div>
      )}

      {cadeau.description && <p className="text-gray-600 mb-4">{cadeau.description}</p>}

      {canSeeContributions && !isOwner && contributions.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold text-christmas-green">{totalContribue.toFixed(2)} € collectés</span>
            <span className="text-gray-500">{contributions.length} contribution{contributions.length > 1 ? 's' : ''}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-christmas-green h-2.5 rounded-full transition-all duration-500" style={{ width: pourcentage + '%' }} />
          </div>
          {reste > 0 ? (
            <p className="text-xs text-gray-600 mt-1">Reste : <span className="font-bold">{reste.toFixed(2)} €</span></p>
          ) : (
            <p className="text-xs text-christmas-green font-bold mt-1">Objectif atteint !</p>
          )}
        </div>
      )}

      {canSeeContributions && !isOwner && contributions.length > 0 && (
        <div className="mb-3 p-2 bg-gray-50 rounded">
          <p className="text-xs font-semibold mb-1">Contributeurs :</p>
          <div className="flex flex-wrap gap-1">
            {contributions.slice(0, 3).map((contrib) => (
              <span key={contrib.id} className="text-xs bg-white px-2 py-0.5 rounded-full border">
                {contrib.contributeur}
              </span>
            ))}
            {contributions.length > 3 && (
              <span className="text-xs text-gray-500">+{contributions.length - 3} autre{contributions.length - 3 > 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {cadeau.lien_achat && (
          <a href={cadeau.lien_achat} target="_blank" rel="noopener noreferrer" className="block text-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
            <AppIcon name="cart" size={17} /> Voir le produit
          </a>
        )}
        {!isOwner && (
          <button
            onClick={() => onContribute({ id: cadeau.id, titre: cadeau.titre, prix: cadeau.prix, owner_id: cadeau.owner_id })}
            className="w-full bg-christmas-green hover:bg-green-800 text-white px-4 py-2 rounded-lg transition font-semibold"
          >
            <AppIcon name="contribution" size={17} /> Contribuer à ce cadeau
          </button>
        )}
      </div>
    </div>
  );
};

export default CadeauCard;
