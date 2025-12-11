import { useState,  type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { useFamille } from '../hooks/useFamille';
import { useCadeaux } from '../hooks/useCadeaux';
import { famillesAPI } from '../services/api';
import Invitations from '../components/familles/Invitations';
import MembresSection from '../components/familles/MembresSection';
import CadeauCard from '../components/cadeaux/CadeauCard';
import CadeauForm, { type CadeauFormData } from '../components/cadeaux/CadeauForm';
import ContributionModal from '../components/cadeaux/ContributionModal';
import DemandesAdhesion from '../components/familles/DemandesAdhesion';

const FamilleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const familleId = id ? parseInt(id, 10) : undefined;

  // Hooks personnalisés
  const { famille, mesFamilles, loading: familleLoading, reload: reloadFamille } = useFamille(familleId);
  const {
    cadeaux,
    contributions,
    createCadeau,
    markPurchased,
    unmarkPurchased,
    reload: reloadCadeaux,
  } = useCadeaux(familleId, user?.id);

  // States locaux
  const [showCadeauModal, setShowCadeauModal] = useState(false);
  const [selectedCadeau, setSelectedCadeau] = useState<{
    id: number;
    titre: string;
    prix: number;
  } | null>(null);
  const [isEditingFamille, setIsEditingFamille] = useState(false);
  const [familleName, setFamilleName] = useState('');
  const [familleDescription, setFamilleDescription] = useState('');

  // Handlers
  const handleCreateCadeau = async (data: CadeauFormData) => {
    await createCadeau(data);
    setShowCadeauModal(false);
  };

  const handleMarkPurchased = async (cadeauId: number) => {
    if (!confirm('Confirmez-vous avoir acheté ce cadeau ?')) return;
    try {
      await markPurchased(cadeauId);
      alert('Cadeau marqué comme acheté ! 🎁');
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Erreur');
    }
  };

  const handleUnmarkPurchased = async (cadeauId: number) => {
    try {
      await unmarkPurchased(cadeauId);
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Erreur');
    }
  };

  const handleEditFamille = () => {
    if (famille) {
      setFamilleName(famille.nom);
      setFamilleDescription(famille.description);
      setIsEditingFamille(true);
    }
  };

  const handleUpdateFamille = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!famille) return;

    try {
      await famillesAPI.update(famille.id, {
        nom: familleName,
        description: familleDescription,
      });
      setIsEditingFamille(false);
      reloadFamille();
      alert('Famille mise à jour ! ✅');
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Erreur');
    }
  };

  // Loading
  if (familleLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Chargement... 🎄</div>
      </div>
    );
  }

  // Famille introuvable
  if (!famille || !familleId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Famille introuvable</div>
      </div>
    );
  }

  const isCreator = user?.id === famille.creator_id;

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <button
          onClick={() => navigate('/familles')}
          className="text-christmas-red hover:underline mb-4 text-sm md:text-base"
        >
          ← Retour aux familles
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex-1 w-full">
            {isEditingFamille ? (
              <form onSubmit={handleUpdateFamille} className="space-y-3">
                <input
                  type="text"
                  value={familleName}
                  onChange={(e) => setFamilleName(e.target.value)}
                  className="input text-xl md:text-3xl font-bold"
                  placeholder="Nom de la famille"
                  required
                />
                <textarea
                  value={familleDescription}
                  onChange={(e) => setFamilleDescription(e.target.value)}
                  className="input text-sm md:text-base"
                  rows={2}
                  placeholder="Description..."
                />
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary text-sm md:text-base">
                    ✅ Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingFamille(false)}
                    className="bg-gray-300 hover:bg-gray-400 px-3 md:px-4 py-2 rounded-lg text-sm md:text-base transition"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <h1 className="text-xl md:text-3xl font-bold break-words">{famille.nom}</h1>
                  {isCreator && (
                    <button
                      onClick={handleEditFamille}
                      className="text-blue-500 hover:text-blue-700 text-lg md:text-xl flex-shrink-0"
                      title="Modifier"
                    >
                      ✏️
                    </button>
                  )}
                </div>
                <p className="text-sm md:text-base text-gray-600 break-words mb-2">
                  {famille.description}
                </p>
                <p className="text-xs md:text-sm text-gray-500">
                  👥 {famille.membres?.length || 0} membres
                </p>
              </>
            )}
          </div>

          {!isEditingFamille && (
            <button
              onClick={() => setShowCadeauModal(true)}
              className="btn-primary w-full md:w-auto whitespace-nowrap"
            >
              + Ajouter un cadeau
            </button>
          )}
          {(isCreator || user?.is_admin) && (
  <button
    onClick={() => navigate(`/familles/${familleId}/contributions-recap`)}
    className="btn-secondary w-full md:w-auto whitespace-nowrap"
  >
    📊 Voir les contributions
  </button>
)}
        </div>
      </div>

      {/* Invitations (si créateur) */}
      <Invitations familleId={familleId} isCreator={isCreator} />
{/* Demandes d'adhésion (si créateur) */}
<DemandesAdhesion familleId={familleId} isCreator={isCreator} />
      {/* Membres */}
      <MembresSection membres={famille.membres} />

    // Dans la partie où tu affiches les cadeaux, remplace par :

{/* Liste des cadeaux groupés par utilisateur */}
<div>
  <h2 className="text-xl md:text-2xl font-bold mb-4">🎁 Cadeaux de la famille</h2>

  {cadeaux.length === 0 ? (
    <div className="card text-center py-12">
      <p className="text-lg md:text-xl text-gray-600 mb-4">
        Aucun cadeau pour l'instant
      </p>
      <button onClick={() => setShowCadeauModal(true)} className="btn-secondary">
        Ajouter le premier cadeau
      </button>
    </div>
  ) : (
    <>
      {/* Grouper les cadeaux par propriétaire et séparer achetés/non achetés */}
      {(() => {
        // Séparer cadeaux achetés et non achetés
        const nonAchetes = cadeaux.filter(c => !c.is_purchased);
        const achetes = cadeaux.filter(c => c.is_purchased);

        // Grouper par owner_id
        const groupByOwner = (cadeauxList: typeof cadeaux) => {
          const grouped: Record<number, typeof cadeaux> = {};
          cadeauxList.forEach(cadeau => {
            if (!grouped[cadeau.owner_id]) {
              grouped[cadeau.owner_id] = [];
            }
            grouped[cadeau.owner_id].push(cadeau);
          });
          return grouped;
        };

        const nonAchetesGroupes = groupByOwner(nonAchetes);
        const achetesGroupes = groupByOwner(achetes);

        return (
          <div className="space-y-8">
            {/* Cadeaux non achetés (par utilisateur) */}
            {Object.entries(nonAchetesGroupes).map(([ownerId, cadeauxUser]) => {
              const owner = famille.membres?.find(m => m.id === parseInt(ownerId));
              
              return (
                <div key={ownerId} className="space-y-4">
                  {/* En-tête utilisateur */}
                  <div className="flex items-center gap-3 pb-2 border-b-2 border-christmas-red">
                    {owner?.avatar_url ? (
                      <img
                        src={owner.avatar_url}
                        alt={owner.username}
                        className="w-12 h-12 rounded-full object-cover border-2 border-christmas-red"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-christmas-red text-white rounded-full flex items-center justify-center text-xl font-bold">
                        {owner?.username.charAt(0).toUpperCase() || '?'}
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold">
                        Liste de {owner?.username || `User #${ownerId}`}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {cadeauxUser.length} cadeau{cadeauxUser.length > 1 ? 'x' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Cadeaux de cet utilisateur */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {cadeauxUser.map((cadeau) => (
                      <CadeauCard
                        key={cadeau.id}
                        cadeau={cadeau}
                        contributions={contributions[cadeau.id] || []}
                        membres={famille.membres}
                        currentUserId={user?.id}
                        onContribute={setSelectedCadeau}
                        onMarkPurchased={handleMarkPurchased}
                        onUnmarkPurchased={handleUnmarkPurchased}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Séparateur si il y a des cadeaux achetés */}
            {achetes.length > 0 && (
              <div className="py-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1 border-t-2 border-gray-300"></div>
                  <h3 className="text-lg font-bold text-gray-600">
                    ✅ Cadeaux achetés ({achetes.length})
                  </h3>
                  <div className="flex-1 border-t-2 border-gray-300"></div>
                </div>
              </div>
            )}

            {/* Cadeaux achetés (par utilisateur) */}
            {Object.entries(achetesGroupes).map(([ownerId, cadeauxUser]) => {
              const owner = famille.membres?.find(m => m.id === parseInt(ownerId));
              
              return (
                <div key={`achetes-${ownerId}`} className="space-y-4 opacity-60">
                  {/* En-tête utilisateur */}
                  <div className="flex items-center gap-3 pb-2 border-b-2 border-gray-300">
                    {owner?.avatar_url ? (
                      <img
                        src={owner.avatar_url}
                        alt={owner.username}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 grayscale"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-400 text-white rounded-full flex items-center justify-center text-lg font-bold">
                        {owner?.username.charAt(0).toUpperCase() || '?'}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-gray-600">
                        Liste de {owner?.username || `User #${ownerId}`}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {cadeauxUser.length} cadeau{cadeauxUser.length > 1 ? 'x' : ''} acheté{cadeauxUser.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Cadeaux achetés de cet utilisateur */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {cadeauxUser.map((cadeau) => (
                      <CadeauCard
                        key={cadeau.id}
                        cadeau={cadeau}
                        contributions={contributions[cadeau.id] || []}
                        membres={famille.membres}
                        currentUserId={user?.id}
                        onContribute={setSelectedCadeau}
                        onMarkPurchased={handleMarkPurchased}
                        onUnmarkPurchased={handleUnmarkPurchased}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}
    </>
  )}
</div>

      {/* Modal Création Cadeau */}
{showCadeauModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white pb-4 border-b mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Ajouter un cadeau</h2>
      </div>
      <CadeauForm
        currentFamilleId={familleId}
        mesFamilles={mesFamilles}
        onSubmit={handleCreateCadeau}
        onCancel={() => setShowCadeauModal(false)}
      />
    </div>
  </div>
)}

      {/* Modal Contribution */}
      {selectedCadeau && (
        <ContributionModal
          cadeauId={selectedCadeau.id}
          cadeauTitre={selectedCadeau.titre}
          prixTotal={selectedCadeau.prix}
          onClose={() => setSelectedCadeau(null)}
          onSuccess={reloadCadeaux}
        />
      )}
    </div>
  );
};

export default FamilleDetail;