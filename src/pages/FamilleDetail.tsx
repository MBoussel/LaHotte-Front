import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { useFamille } from '../hooks/useFamille';
import { useCadeaux } from '../hooks/useCadeaux';
import Invitations from '../components/familles/Invitations';
import MembresSection from '../components/familles/MembresSection';
import CadeauCard from '../components/cadeaux/CadeauCard';
import CadeauForm, { type CadeauFormData } from '../components/cadeaux/CadeauForm';
import ContributionModal from '../components/cadeaux/ContributionModal';

const FamilleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const familleId = id ? parseInt(id, 10) : undefined;

  // Hooks personnalisés
  const { famille, mesFamilles, loading: familleLoading } = useFamille(familleId);
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/familles')}
          className="text-christmas-red hover:underline mb-4"
        >
          ← Retour aux familles
        </button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{famille.nom}</h1>
            <p className="text-gray-600">{famille.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              👥 {famille.membres?.length || 0} membres
            </p>
          </div>
          <button onClick={() => setShowCadeauModal(true)} className="btn-primary">
            + Ajouter un cadeau
          </button>
        </div>
      </div>

      {/* Invitations (si créateur) */}
      <Invitations familleId={familleId} isCreator={isCreator} />

      {/* Membres */}
      <MembresSection membres={famille.membres} />

      {/* Liste des cadeaux */}
      <div>
        <h2 className="text-2xl font-bold mb-4">🎁 Cadeaux de la famille</h2>

        {cadeaux.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-xl text-gray-600 mb-4">Aucun cadeau pour l'instant</p>
            <button onClick={() => setShowCadeauModal(true)} className="btn-secondary">
              Ajouter le premier cadeau
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cadeaux.map((cadeau) => (
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
        )}
      </div>

      {/* Modal Création Cadeau */}
      {showCadeauModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="card max-w-md w-full my-8">
            <h2 className="text-2xl font-bold mb-4">Ajouter un cadeau</h2>
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