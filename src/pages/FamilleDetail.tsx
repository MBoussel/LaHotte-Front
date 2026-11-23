import AppIcon from '../components/ui/AppIcon';
import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { useFamille } from '../hooks/useFamille';
import { useCadeaux } from '../hooks/useCadeaux';
import { famillesAPI, beneficiairesAPI } from '../services/api';
import Invitations from '../components/familles/Invitations';
import MembresSection from '../components/familles/MembresSection';
import CadeauCard from '../components/cadeaux/CadeauCard';
import CadeauForm, { type CadeauFormData } from '../components/cadeaux/CadeauForm';
import ContributionModal from '../components/cadeaux/ContributionModal';
import type { BeneficiaireProfil, Cadeau } from '../types';
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
    reload: reloadCadeaux,
  } = useCadeaux(familleId, user?.id, famille?.creator_id, famille?.pere_noel_id);

  // States locaux
  const [showCadeauModal, setShowCadeauModal] = useState(false);
  const [beneficiaires, setBeneficiaires] = useState<BeneficiaireProfil[]>([]);
  const [uploadingBeneficiaireId, setUploadingBeneficiaireId] = useState<number | null>(null);
  const [showBeneficiaireModal, setShowBeneficiaireModal] = useState(false);
  const [beneficiaireNom, setBeneficiaireNom] = useState('');
  const [responsableIds, setResponsableIds] = useState<number[]>(user?.id ? [user.id] : []);
  const [viewMode, setViewMode] = useState<'personne' | 'tous'>('personne');
  const [detailCadeau, setDetailCadeau] = useState<Cadeau | null>(null);
  const [noelType, setNoelType] = useState<"pere_noel" | "mere_noel">("pere_noel");
  const [santaMove, setSantaMove] = useState(0);
  const [biscuitMove, setBiscuitMove] = useState(0);
  const [biscuitClickId, setBiscuitClickId] = useState(0);
  const [biscuitClicks, setBiscuitClicks] = useState(0);
  const [biscuitFlying, setBiscuitFlying] = useState(false);
  const biscuitOffsets = [{x:0,y:0},{x:18,y:-12},{x:-16,y:-18},{x:24,y:16},{x:-22,y:12},{x:8,y:24}];
  const currentBiscuitOffset = biscuitOffsets[biscuitMove % biscuitOffsets.length];
  const clickBiscuit = () => {
    if (biscuitFlying) return;
    setBiscuitClickId(id => id + 1);
    setBiscuitMove(move => move + 1);
    const next = biscuitClicks + 1;
    setBiscuitClicks(next);
    if (next >= 5) {
      setBiscuitFlying(true);
      window.setTimeout(() => { setBiscuitFlying(false); setBiscuitClicks(0); }, 2700);
    }
  };
  const [santaClickId, setSantaClickId] = useState(0);
  const [santaClicks, setSantaClicks] = useState(0);
  const [santaFlying, setSantaFlying] = useState(false);
  const santaOffsets = [{x:0,y:0},{x:20,y:12},{x:-16,y:20},{x:-22,y:-10},{x:12,y:-22},{x:26,y:-6}];
  const currentSantaOffset = santaOffsets[santaMove % santaOffsets.length];
  const clickSanta = () => {
    if (santaFlying) return;
    setSantaClickId(id => id + 1);
    setSantaMove(move => move + 1);
    const next = santaClicks + 1;
    setSantaClicks(next);
    if (next >= 5) {
      setSantaFlying(true);
      window.setTimeout(() => { setSantaFlying(false); setSantaClicks(0); }, 2700);
    }
  };

  useEffect(() => {
    if (famille?.noel_type) setNoelType(famille.noel_type);
  }, [famille?.noel_type]);

  useEffect(() => {
    if (!familleId) return;
    beneficiairesAPI.getByFamille(familleId)
      .then((response) => setBeneficiaires(response.data))
      .catch((error) => console.error('Erreur chargement bénéficiaires:', error));
  }, [familleId]);

  useEffect(() => {
    if (user?.id) {
      setResponsableIds((ids) => ids.includes(user.id) ? ids : [...ids, user.id]);
    }
  }, [user?.id]);
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

  const handleUploadBeneficiaire = async (beneficiaireId: number, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('La photo ne doit pas dépasser 5 Mo.');
      return;
    }
    setUploadingBeneficiaireId(beneficiaireId);
    try {
      const response = await beneficiairesAPI.uploadAvatar(beneficiaireId, file);
      setBeneficiaires((current) => current.map((profil) =>
        profil.id === beneficiaireId ? { ...profil, avatar_url: response.data.avatar_url } : profil
      ));
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Impossible de mettre à jour la photo');
    } finally {
      setUploadingBeneficiaireId(null);
    }
  };

  const handleCreateBeneficiaire = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!familleId || !beneficiaireNom.trim()) return;
    try {
      await beneficiairesAPI.create(familleId, { nom: beneficiaireNom.trim(), responsable_ids: responsableIds });
      const response = await beneficiairesAPI.getByFamille(familleId);
      setBeneficiaires(response.data);
      setBeneficiaireNom('');
      setResponsableIds(user?.id ? [user.id] : []);
      setShowBeneficiaireModal(false);
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Impossible de créer le bénéficiaire');
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
        <div className="text-center inline-flex items-center gap-2"><AppIcon name="tree" size={22} /> Chargement...</div>
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
  const groupesCadeaux = [
    ...(famille.membres || [])
      .map((membre) => ({ id: 'membre-' + membre.id, nom: membre.username, ownerId: membre.id, beneficiaireId: null as number | null, cadeaux: cadeaux.filter((cadeau) => cadeau.owner_id === membre.id && !cadeau.beneficiaire_profil_id) }))
      .filter((groupe) => groupe.cadeaux.length > 0),
    ...beneficiaires.map((profil) => ({ id: 'beneficiaire-' + profil.id, nom: profil.nom, ownerId: null as number | null, beneficiaireId: profil.id, cadeaux: cadeaux.filter((cadeau) => cadeau.beneficiaire_profil_id === profil.id) }))
      .filter((groupe) => groupe.cadeaux.length > 0),
  ];

  const handleSetNoelType = async (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value as "pere_noel" | "mere_noel";
    setNoelType(selectedType);
    if (!famille?.pere_noel_id) return;
    try {
      await famillesAPI.setPereNoel(famille.id, famille.pere_noel_id, selectedType);
      await reloadFamille();
      alert(selectedType === "mere_noel" ? "Mère Noël désignée !" : "Père Noël désigné !");
    } catch (error: any) {
      alert(error.response?.data?.detail || "Impossible de modifier le rôle Noël");
    }
  };

  const handleSetPereNoel = async (event: ChangeEvent<HTMLSelectElement>) => {
    const userId = Number(event.target.value);
    if (!famille || !userId) return;
    try {
      await famillesAPI.setPereNoel(famille.id, userId, noelType);
      await reloadFamille();
      alert(noelType === "mere_noel" ? "Mère Noël désignée !" : "Père Noël désigné !");
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Impossible de désigner le rôle Noël');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="family-floating-decor">
        <div className="family-santa-clicker" style={{ transform: `translate(${currentSantaOffset.x}px, ${currentSantaOffset.y}px)` }}><span key={santaClickId} className="gingerbread-score-pop santa-score-pop" aria-live="polite">{santaClickId > 0 ? '+1' : ''}</span><button type="button" className={`family-floating-santa santa-launcher${santaFlying ? " holiday-character-flying" : ""}`} onClick={clickSanta} aria-label="Cliquer sur le Père Noël pour gagner un point" title="Attrape le Père Noël !"><img src="https://cdn-icons-png.flaticon.com/512/9204/9204869.png" alt="" /></button></div>
        <div className="family-biscuit-clicker" style={{ transform: `translate(${currentBiscuitOffset.x}px, ${currentBiscuitOffset.y}px)` }}><span key={biscuitClickId} className="gingerbread-score-pop" aria-live="polite">{biscuitClickId > 0 ? '+1' : ''}</span><button type="button" className={`family-floating-gingerbread santa-launcher${biscuitFlying ? " holiday-character-flying" : ""}`} onClick={clickBiscuit} aria-label="Cliquer sur le biscuit pour gagner un point" title="Attrape le biscuit !"><img src="https://cdn-icons-png.flaticon.com/512/8732/8732463.png" alt="" /></button></div>
      </div>
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
                  <AppIcon name="members" size={16} /> {(famille.membres?.length || 0) + beneficiaires.length} membres
                </p>
              </>
            )}
          </div>

          {!isEditingFamille && (
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <button onClick={() => setShowCadeauModal(true)} className="btn-primary w-full md:w-auto whitespace-nowrap">
                + Ajouter un cadeau
              </button>
              <button onClick={() => { setBeneficiaireNom(''); setResponsableIds(user?.id ? [user.id] : []); setShowBeneficiaireModal(true); }} className="btn-secondary w-full md:w-auto whitespace-nowrap">
                + Ajouter un bénéficiaire
              </button>
            </div>
          )}
          {canSeeRecap && (
  <button
    onClick={() => navigate(`/familles/${familleId}/contributions-recap`)}
    className="btn-secondary w-full md:w-auto whitespace-nowrap"
  >
    <AppIcon name="chart" size={17} /> Voir les contributions
  </button>
)}
        </div>
      </div>

      {canManagePereNoel && (
        <div className="card mb-6">
          <h2 className="font-bold mb-2">Désigner le Père Noël ou la Mère Noël</h2>
          <p className="text-sm text-gray-600 mb-3">Choisissez l’appellation puis le membre qui l’incarnera. Seul le créateur peut modifier ce choix.</p>
          <select className="input mb-2" value={noelType} onChange={handleSetNoelType}><option value="pere_noel">Père Noël</option><option value="mere_noel">Mère Noël</option></select>
          <select className="input" value={famille.pere_noel_id ?? ''} onChange={handleSetPereNoel}>
            <option value="">Choisir la personne</option>
            {famille.membres?.filter(m => m.id !== famille.creator_id).map(membre => (
              <option key={membre.id} value={membre.id}>{membre.username}</option>
            ))}
          </select>
          {!famille.pere_noel_id && <p className="text-xs text-amber-700 mt-2">Le Père Noël ou la Mère Noël doit être désigné pour activer les récapitulatifs.</p>}
        </div>
      )}

      {/* Invitations (si créateur) */}
      <Invitations familleId={familleId} isCreator={isCreator} />
{/* Demandes d'adhésion (si créateur) */}
<DemandesAdhesion familleId={familleId} isCreator={isCreator} />
      {/* Membres */}
      <MembresSection
        membres={famille.membres}
        beneficiaires={beneficiaires}
        pereNoelId={famille.pere_noel_id}
        noelType={famille.noel_type}
        currentUserId={user?.id}
        onUploadBeneficiaire={handleUploadBeneficiaire}
        uploadingBeneficiaireId={uploadingBeneficiaireId}
      />

{/* Liste des cadeaux */}
<div>
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
    <h2 className="text-xl md:text-2xl font-bold inline-flex items-center gap-2"><AppIcon name="gift" size={24} /> Cadeaux de la famille</h2>
    <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm self-start sm:self-auto" role="group" aria-label="Affichage des cadeaux">
      <button
        type="button"
        onClick={() => { setViewMode('personne'); setDetailCadeau(null); }}
        aria-pressed={viewMode === 'personne'}
        className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${viewMode === 'personne' ? 'bg-christmas-green text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        <AppIcon name="members" size={16} /> Par personne
      </button>
      <button
        type="button"
        onClick={() => { setViewMode('tous'); setDetailCadeau(null); }}
        aria-pressed={viewMode === 'tous'}
        className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${viewMode === 'tous' ? 'bg-christmas-green text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        <AppIcon name="gift" size={16} /> Tous les cadeaux
      </button>
    </div>
  </div>

  {cadeaux.length === 0 ? (
    <div className="card text-center py-12">
      <p className="text-lg md:text-xl text-gray-600 mb-4">
        Aucun cadeau pour l'instant
      </p>
      <button onClick={() => setShowCadeauModal(true)} className="btn-secondary">
        Ajouter le premier cadeau
      </button>
    </div>
  ) : viewMode === 'tous' ? (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {cadeaux.map((cadeau) => (
        <CadeauCard
          key={cadeau.id}
          cadeau={cadeau}
          contributions={contributions[cadeau.id] || []}
          membres={famille.membres}
          currentUserId={user?.id}
          canSeeContributions={(isPereNoel && cadeau.owner_id !== famille.pere_noel_id) || (isCreator && cadeau.owner_id === famille.pere_noel_id)}
          onContribute={setSelectedCadeau}
        />
      ))}
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-4 content-start">
      {groupesCadeaux.map(({ id: groupeId, nom: groupeNom, ownerId, beneficiaireId, cadeaux: cadeauxMembre }) => {
        const isExpanded = (beneficiaireId !== null && detailCadeau?.beneficiaire_profil_id === beneficiaireId) || (beneficiaireId === null && detailCadeau?.owner_id === ownerId && !detailCadeau?.beneficiaire_profil_id);
        const membre = ownerId !== null ? famille.membres?.find((item) => item.id === ownerId) : undefined;
        const avatarUrl = membre?.avatar_url || (beneficiaireId !== null ? beneficiaires.find((profil) => profil.id === beneficiaireId)?.avatar_url : undefined);

        return (
          <div key={groupeId} className={`min-w-0 ${isExpanded ? 'lg:col-span-2' : ''}`}>
            <section className={`card h-full min-w-0 border border-amber-200 bg-amber-50 shadow-sm ${isExpanded ? 'lg:grid lg:grid-cols-2 lg:gap-4' : ''}`}>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-3 px-1 pb-3 mb-3 border-b border-amber-200">
                  <div className="flex items-center gap-3 min-w-0">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={`Photo de profil de ${groupeNom}`}
                        className="w-11 h-11 rounded-full object-cover flex-shrink-0 border-2 border-amber-300"
                        onError={(event) => {
                          event.currentTarget.style.display = 'none';
                          const fallback = event.currentTarget.nextElementSibling as HTMLElement | null;
                          fallback?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center bg-amber-200 text-amber-950 font-bold text-lg border-2 border-amber-300 ${avatarUrl ? 'hidden' : ''}`}>
                      {groupeNom.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 truncate">{groupeNom}</h3>
                  </div>
                  <span className="flex-shrink-0 rounded-full border border-amber-300 bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-950">
                    {cadeauxMembre.length} cadeau{cadeauxMembre.length > 1 ? 'x' : ''}
                  </span>
                </div>
                <div className="rounded-xl border border-amber-200 bg-white p-2">
                  <div className="divide-y divide-gray-200">
                    {cadeauxMembre.map((cadeau) => (
                      <button
                        key={cadeau.id}
                        type="button"
                        onClick={() => setDetailCadeau(cadeau)}
                        aria-pressed={detailCadeau?.id === cadeau.id}
                        className={`w-full flex items-center justify-between gap-3 rounded-lg px-3 py-3 text-left transition ${detailCadeau?.id === cadeau.id ? 'bg-amber-100 ring-1 ring-amber-400' : 'hover:bg-amber-50'}`}
                      >
                        <span className="font-medium text-sm md:text-base min-w-0 truncate text-gray-900">{cadeau.titre}</span>
                        <span className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-sm font-semibold text-red-800">{cadeau.prix} €</span>
                          <span aria-hidden="true" className="text-gray-400 text-lg">›</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {isExpanded && detailCadeau && (
                <div className="min-w-0 lg:border-l lg:border-amber-200 lg:pl-4">
                  <div className="flex justify-end mb-2">
                    <button type="button" onClick={() => setDetailCadeau(null)} className="text-sm text-gray-500 hover:text-gray-800">
                      Fermer <span aria-hidden="true" className="text-base">×</span>
                    </button>
                  </div>
                  <CadeauCard
                    embedded
                    cadeau={detailCadeau}
                    contributions={contributions[detailCadeau.id] || []}
                    membres={famille.membres}
                    currentUserId={user?.id}
                    canSeeContributions={(isPereNoel && detailCadeau.owner_id !== famille.pere_noel_id) || (isCreator && detailCadeau.owner_id === famille.pere_noel_id)}
                    onContribute={setSelectedCadeau}
                  />
                </div>
              )}
            </section>
          </div>
        );
      })}
    </div>
  )}

  {viewMode === 'personne' && detailCadeau && (
    <div className="lg:hidden fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setDetailCadeau(null)}>
      <div className="bg-white w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-4" onClick={(event) => event.stopPropagation()}>
        <div className="flex justify-end mb-3">
          <button type="button" onClick={() => setDetailCadeau(null)} className="text-sm text-gray-600 hover:text-gray-900 px-2 py-1">
            Fermer <span aria-hidden="true" className="text-base">×</span>
          </button>
        </div>
        <CadeauCard
          cadeau={detailCadeau}
          contributions={contributions[detailCadeau.id] || []}
          membres={famille.membres}
          currentUserId={user?.id}
          canSeeContributions={(isPereNoel && detailCadeau.owner_id !== famille.pere_noel_id) || (isCreator && detailCadeau.owner_id === famille.pere_noel_id)}
          onContribute={setSelectedCadeau}
        />
      </div>
    </div>
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
        beneficiaires={beneficiaires.filter((profil) => profil.responsables.some((responsable) => responsable.id === user?.id))}
        onSubmit={handleCreateCadeau}
        onCancel={() => setShowCadeauModal(false)}
      />
    </div>
  </div>
)}

{/* Modal Création Bénéficiaire */}
{showBeneficiaireModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="card max-w-lg w-full">
      <h2 className="text-xl font-bold mb-2">Ajouter un bénéficiaire</h2>
      <p className="text-sm text-gray-600 mb-4">Crée une liste pour une personne qui n'a pas besoin de compte, comme un enfant.</p>
      <form onSubmit={handleCreateBeneficiaire} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Prénom ou nom affiché</label>
          <input className="input" value={beneficiaireNom} onChange={(event) => setBeneficiaireNom(event.target.value)} maxLength={100} required placeholder="Ex. Timothée" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Qui pourra ajouter des cadeaux à cette liste ?</label>
          <p className="text-xs text-gray-500 mb-2">Tu es automatiquement responsable. Tu peux autoriser d'autres membres, comme ton conjoint ou ta conjointe.</p>
          <div className="max-h-44 overflow-y-auto rounded-lg border border-gray-200 p-2 space-y-1">
            {(famille.membres || []).map((membre) => (
              <label key={membre.id} className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={responsableIds.includes(membre.id)}
                  disabled={membre.id === user?.id}
                  onChange={() => setResponsableIds((ids) => ids.includes(membre.id) ? ids.filter((id) => id !== membre.id) : [...ids, membre.id])}
                />
                <span className="text-sm">{membre.username}{membre.id === user?.id ? ' (toi)' : ''}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => setShowBeneficiaireModal(false)} className="flex-1 rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700">Annuler</button>
          <button type="submit" className="btn-primary flex-1">Créer la liste</button>
        </div>
      </form>
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