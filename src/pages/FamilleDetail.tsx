import { useState, type FormEvent, type ChangeEvent } from 'react';
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
  } = useCadeaux(familleId, user?.id, famille?.creator_id, famille?.pere_noel_id);

  // States locaux
  const [showCadeauModal, setShowCadeauModal] = useState(false);
  const [selectedCadeau, setSelectedCadeau] = useState<{
    id: number;
    titre: string;
    prix: number;
    owner_id: number;
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
  const isPereNoel = user?.id === famille.pere_noel_id;
  const canSeeRecap = isPereNoel || (isCreator && famille.pere_noel_id != null);
  const canManagePereNoel = isCreator;

  const handleSetPereNoel = async (event: ChangeEvent<HTMLSelectElement>) => {
    const userId = Number(event.target.value);
    if (!famille || !userId) return;
    try {
      await famillesAPI.setPereNoel(famille.id, userId);
      await reloadFamille();
      alert('Père Noël désigné !');
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Impossible de désigner le Père Noël');
    }
  };

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
          {canSeeRecap && (
  <button
    onClick={() => navigate(`/familles/${familleId}/contributions-recap`)}
    className="btn-secondary w-full md:w-auto whitespace-nowrap"
  >
    📊 Voir les contributions
  </button>
)}
        </div>
      </div>

      {canManagePereNoel && (
        <div className="card mb-6">
          <h2 className="font-bold mb-2">Désigner le Père Noël</h2>
          <p className="text-sm text-gray-600 mb-3">Choisissez un membre différent du créateur. Seul le créateur peut modifier ce choix.</p>
          <select className="input" value={famille.pere_noel_id ?? ''} onChange={handleSetPereNoel}>
            <option value="">Choisir le Père Noël</option>
            {famille.membres?.filter(m => m.id !== famille.creator_id).map(membre => (
              <option key={membre.id} value={membre.id}>{membre.username}</option>
            ))}
          </select>
          {!famille.pere_noel_id && <p className="text-xs text-amber-700 mt-2">Le Père Noël doit être désigné pour activer les récapitulatifs.</p>}
        </div>
      )}

      {/* Invitations (si créateur) */}
      <Invitations familleId={familleId} isCreator={isCreator} />
{/* Demandes d'adhésion (si créateur) */}
<DemandesAdhesion familleId={familleId} isCreator={isCreator} />
      {/* Membres */}
      <MembresSection membres={famille.membres} />

{/* Liste des cadeaux */}
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
      {(() => {
        // Séparer et trier les cadeaux
        const nonAchetes = cadeaux
          .filter(c => !c.is_purchased)
          .sort((a, b) => a.owner_id - b.owner_id); // Grouper par owner_id
        
        const achetes = cadeaux
          .filter(c => c.is_purchased)
          .sort((a, b) => a.owner_id - b.owner_id);

        return (
          <div className="space-y-6">
            {/* Cadeaux non achetés */}
            {nonAchetes.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {nonAchetes.map((cadeau) => (
                  <CadeauCard
                    key={cadeau.id}
                    cadeau={cadeau}
                    contributions={contributions[cadeau.id] || []}
                    membres={famille.membres}
                    currentUserId={user?.id}
                    canSeeContributions={(isPereNoel && cadeau.owner_id !== famille.pere_noel_id) || (isCreator && cadeau.owner_id === famille.pere_noel_id)}
                    onContribute={setSelectedCadeau}
                    onMarkPurchased={handleMarkPurchased}
                    onUnmarkPurchased={handleUnmarkPurchased}
                  />
                ))}
              </div>
            )}

            {/* Séparateur */}
            {achetes.length > 0 && (
              <div className="py-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 border-t-2 border-gray-300"></div>
                  <h3 className="text-lg font-bold text-gray-600">
                    ✅ Cadeaux achetés ({achetes.length})
                  </h3>
                  <div className="flex-1 border-t-2 border-gray-300"></div>
                </div>
              </div>
            )}

            {/* Cadeaux achetés (en bas, légèrement grisés) */}
            {achetes.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 opacity-60">
                {achetes.map((cadeau) => (
                  <CadeauCard
                    key={cadeau.id}
                    cadeau={cadeau}
                    contributions={contributions[cadeau.id] || []}
                    membres={famille.membres}
                    currentUserId={user?.id}
                    canSeeContributions={(isPereNoel && cadeau.owner_id !== famille.pere_noel_id) || (isCreator && cadeau.owner_id === famille.pere_noel_id)}
                    onContribute={setSelectedCadeau}
                    onMarkPurchased={handleMarkPurchased}
                    onUnmarkPurchased={handleUnmarkPurchased}
                  />
                ))}
              </div>
            )}
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
          showDetails={(isPereNoel && selectedCadeau.owner_id !== famille.pere_noel_id) || (isCreator && selectedCadeau.owner_id === famille.pere_noel_id)}
        />
      )}
    </div>
  );
};

export default FamilleDetail;