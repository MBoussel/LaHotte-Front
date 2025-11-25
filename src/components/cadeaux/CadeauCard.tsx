import type { Cadeau, ContributionWithUser, Membre } from '../../types';

interface CadeauCardProps {
  cadeau: Cadeau;
  contributions: ContributionWithUser[];
  membres?: Membre[];
  currentUserId?: number;
  onContribute: (cadeau: { id: number; titre: string; prix: number }) => void;
  onMarkPurchased: (cadeauId: number) => void;
  onUnmarkPurchased: (cadeauId: number) => void;
}

const CadeauCard = ({
  cadeau,
  contributions,
  membres,
  currentUserId,
  onContribute,
  onMarkPurchased,
  onUnmarkPurchased,
}: CadeauCardProps) => {
  const totalContribue = contributions.reduce((sum, c) => sum + c.montant, 0);
  const reste = cadeau.prix - totalContribue;
  const pourcentage = Math.min((totalContribue / cadeau.prix) * 100, 100);
  const isOwner = currentUserId === cadeau.owner_id;
  const isPurchasedByMe = cadeau.purchased_by_id === currentUserId;

  return (
    <div
      className={`card hover:shadow-xl transition ${
        cadeau.is_purchased ? 'border-4 border-christmas-green' : ''
      }`}
    >
      {/* Badge Acheté */}
      {cadeau.is_purchased && (
        <div className="bg-christmas-green text-white px-4 py-2 rounded-lg mb-3 font-bold text-center">
          ✅ Cadeau acheté !
        </div>
      )}

      {/* Image */}
      {cadeau.photo_url && (
        <img
          src={cadeau.photo_url}
          alt={cadeau.titre}
          className="w-full h-48 object-cover rounded-lg mb-4"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}

      {/* Propriétaire */}
      <div className="flex items-center gap-2 text-sm mb-3 text-gray-600">
        <span className="font-semibold">Liste de :</span>
        <span className="bg-gray-100 px-3 py-1 rounded-full">
          {membres?.find((m) => m.id === cadeau.owner_id)?.username ||
            `User #${cadeau.owner_id}`}
        </span>
      </div>

      {/* Titre et Prix */}
      <h3 className="text-xl font-bold mb-2">{cadeau.titre}</h3>
      <p className="text-2xl font-bold text-christmas-red mb-2">{cadeau.prix} €</p>
      {cadeau.description && <p className="text-gray-600 mb-4">{cadeau.description}</p>}

      {/* Barre de progression - CACHÉE si propriétaire */}
      {!isOwner && contributions.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold text-christmas-green">
              {totalContribue.toFixed(2)} € collectés
            </span>
            <span className="text-gray-500">
              {contributions.length} contribution{contributions.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-christmas-green h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${pourcentage}%` }}
            />
          </div>
          {reste > 0 ? (
            <p className="text-xs text-gray-600 mt-1">
              Reste : <span className="font-bold">{reste.toFixed(2)} €</span>
            </p>
          ) : (
            <p className="text-xs text-christmas-green font-bold mt-1">
              ✅ Objectif atteint !
            </p>
          )}
        </div>
      )}

      {/* Liste des contributeurs - CACHÉE si propriétaire */}
      {!isOwner && contributions.length > 0 && (
        <div className="mb-3 p-2 bg-gray-50 rounded">
          <p className="text-xs font-semibold mb-1">Contributeurs :</p>
          <div className="flex flex-wrap gap-1">
            {contributions.slice(0, 3).map((contrib, idx) => (
              <span key={idx} className="text-xs bg-white px-2 py-0.5 rounded-full border">
                {contrib.is_anonymous ? '🎭' : contrib.contributeur}
              </span>
            ))}
            {contributions.length > 3 && (
              <span className="text-xs text-gray-500">
                +{contributions.length - 3} autre{contributions.length - 3 > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="space-y-2">
        {cadeau.lien_achat && (
          <a
            href={cadeau.lien_achat}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            🛒 Voir le produit
          </a>
        )}

        {/* Boutons pour les NON propriétaires */}
        {!isOwner && (
          <>
            {/* Bouton Contribuer */}
            {!cadeau.is_purchased && reste > 0 && (
              <button
                onClick={() =>
                  onContribute({ id: cadeau.id, titre: cadeau.titre, prix: cadeau.prix })
                }
                className="w-full bg-christmas-green hover:bg-green-800 text-white px-4 py-2 rounded-lg transition font-semibold"
              >
                💝 Contribuer à ce cadeau
              </button>
            )}

            {/* Bouton Voir les contributions */}
            {!cadeau.is_purchased && reste <= 0 && (
              <button
                onClick={() =>
                  onContribute({ id: cadeau.id, titre: cadeau.titre, prix: cadeau.prix })
                }
                className="w-full bg-gray-400 text-white px-4 py-2 rounded-lg cursor-pointer"
              >
                👀 Voir les contributions
              </button>
            )}

            {/* Bouton Marquer comme acheté */}
            {!cadeau.is_purchased && (
              <button
                onClick={() => onMarkPurchased(cadeau.id)}
                className="w-full bg-christmas-gold hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg transition font-semibold"
              >
                ✅ J'ai acheté ce cadeau
              </button>
            )}

            {/* Bouton Annuler l'achat */}
            {cadeau.is_purchased && isPurchasedByMe && (
              <button
                onClick={() => onUnmarkPurchased(cadeau.id)}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
              >
                ❌ Annuler "acheté"
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CadeauCard;