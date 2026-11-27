import AppIcon from '../ui/AppIcon';
import { useState, type FormEvent } from 'react';
import type { Famille, BeneficiaireProfil } from '../../types';
import { cadeauxAPI } from '../../services/api';

export interface CadeauFormData {
  titre: string;
  prix: number;
  description: string;
  photo_url: string;
  lien_achat: string;
  famille_ids: number[];
  beneficiaire_ids: number[];
  beneficiaire_profil_id?: number;
  is_favorite: boolean;
}

interface CadeauFormProps {
  currentFamilleId: number;
  mesFamilles: Famille[];
  beneficiaires: BeneficiaireProfil[];
  onSubmit: (data: CadeauFormData) => void;
  onCancel: () => void;
}

const CadeauForm = ({ currentFamilleId, mesFamilles, beneficiaires, onSubmit, onCancel }: CadeauFormProps) => {
  const [formData, setFormData] = useState<CadeauFormData>({
    titre: '',
    prix: 0,
    description: '',
    photo_url: '',
    lien_achat: '',
    famille_ids: [currentFamilleId],
    beneficiaire_ids: [],
    beneficiaire_profil_id: undefined,
    is_favorite: false,
  });
  const [extractingPhoto, setExtractingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleExtractPhoto = async () => {
    if (!formData.lien_achat.trim()) return;
    setExtractingPhoto(true);
    setPhotoError('');
    try {
      const response = await cadeauxAPI.extractProductImage(formData.lien_achat.trim());
      setFormData((current) => ({ ...current, photo_url: response.data.photo_url }));
    } catch (error: any) {
      setPhotoError(error.response?.data?.detail || "Je n'ai pas réussi à trouver une photo sur cette page. Tu peux toujours ajouter son URL manuellement.");
    } finally {
      setExtractingPhoto(false);
    }
  };

  const handleUploadPhoto = async (file?: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("La photo ne doit pas dépasser 5 Mo.");
      return;
    }
    setUploadingPhoto(true);
    setPhotoError('');
    try {
      const response = await cadeauxAPI.uploadPhoto(file);
      setFormData((current) => ({ ...current, photo_url: response.data.photo_url }));
    } catch (error: any) {
      setPhotoError(error.response?.data?.detail || "Impossible d'importer cette photo. Réessaie avec une image JPG, PNG ou WebP.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.famille_ids.length === 0) {
      alert('Une famille doit être sélectionnée');
      return;
    }
    onSubmit({
      titre: formData.titre,
      prix: formData.prix,
      description: formData.description,
      photo_url: formData.photo_url,
      lien_achat: formData.lien_achat,
      famille_ids: formData.famille_ids,
      beneficiaire_ids: formData.beneficiaire_ids,
      beneficiaire_profil_id: formData.beneficiaire_profil_id,
      is_favorite: formData.is_favorite,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Pour qui est ce cadeau ?</label>
        <select
          className="input"
          value={formData.beneficiaire_profil_id ? `profil:${formData.beneficiaire_profil_id}` : formData.beneficiaire_ids[0] ? `user:${formData.beneficiaire_ids[0]}` : 'owner'}
          onChange={(event) => {
            const value = event.target.value;
            if (value.startsWith('profil:')) {
              setFormData({ ...formData, beneficiaire_profil_id: Number(value.slice(7)), beneficiaire_ids: [] });
            } else if (value.startsWith('user:')) {
              setFormData({ ...formData, beneficiaire_profil_id: undefined, beneficiaire_ids: [Number(value.slice(5))] });
            } else {
              setFormData({ ...formData, beneficiaire_profil_id: undefined, beneficiaire_ids: [] });
            }
          }}
        >
          <option value="owner">Ma liste personnelle</option>
          {mesFamilles.find((famille) => famille.id === currentFamilleId)?.membres?.map((membre) => (
            <option key={`user:${membre.id}`} value={`user:${membre.id}`}>{membre.username}</option>
          ))}
          {beneficiaires.map((profil) => (
            <option key={`profil:${profil.id}`} value={`profil:${profil.id}`}>{profil.nom}</option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">Un cadeau est associé à une seule personne. Les contributions alimentent sa cagnotte globale.</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Titre du cadeau *</label>
        <input type="text" className="input" value={formData.titre}
          onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
          required placeholder="Ex: PlayStation 5" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Prix (€) *</label>
        <input type="number" step="0.01" min="0" className="input"
          value={formData.prix || ''}
          onChange={(e) => setFormData({ ...formData, prix: parseFloat(e.target.value) })}
          required placeholder="Ex: 499.99" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea className="input" rows={3} value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description optionnelle du cadeau..." />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Lien d'achat</label>
        <input type="url" className="input" value={formData.lien_achat}
          onChange={(e) => {
            setFormData({ ...formData, lien_achat: e.target.value });
            setPhotoError('');
          }}
          placeholder="https://..." />
        <button type="button" onClick={handleExtractPhoto}
          disabled={!formData.lien_achat.trim() || extractingPhoto}
          className="mt-2 text-sm font-medium text-blue-700 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed">
          {extractingPhoto ? 'Recherche de la photo...' : 'Récupérer automatiquement la photo'}
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Photo du cadeau</label>
        <label className="inline-flex items-center gap-2 mt-1 mb-3 cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50">
          <AppIcon name="gift" size={17} />
          {uploadingPhoto ? "Import de la photo..." : "Importer une photo depuis mon appareil"}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={uploadingPhoto} onChange={(event) => { handleUploadPhoto(event.target.files?.[0]); event.currentTarget.value = ''; }} />
        </label>
        <p className="mb-2 text-xs text-gray-500">JPG, PNG ou WebP · 5 Mo maximum</p>
        <input type="url" className="input" value={formData.photo_url}
          onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
          placeholder="Ou colle l'adresse d'une image" />
        {photoError && <p role="alert" className="mt-2 text-xs text-amber-700">{photoError}</p>}
        {formData.photo_url && (
          <div className="mt-3">
            <p className="mb-2 text-xs text-gray-500">Aperçu de la photo</p>
            <img src={formData.photo_url} alt="Aperçu du cadeau"
              className="max-h-44 max-w-full rounded-lg border object-contain"
              onError={() => setPhotoError("L'aperçu de cette photo ne peut pas être affiché. Vérifie son adresse.")} />
          </div>
        )}
      </div>

      <label className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all duration-300 ease-out ${formData.is_favorite ? "border-amber-400 bg-amber-50 shadow-[0_0_14px_rgba(245,158,11,0.28)] ring-1 ring-amber-200" : "border-gray-200 bg-white hover:border-amber-200"}`}>
        <input type="checkbox" checked={formData.is_favorite} onChange={(event) => setFormData({ ...formData, is_favorite: event.target.checked })} className="mt-1 rounded" />
        <span><span className="block text-sm font-semibold text-amber-900">★ C'est mon cadeau favori</span><span className="block text-xs text-amber-800 mt-1">Indique aux autres que c'est le cadeau que tu souhaites le plus.</span></span>
      </label>

      <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
        Ce cadeau sera ajouté uniquement à cette famille.
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition">
          Annuler
        </button>
        <button type="submit" className="flex-1 btn-primary">Créer le cadeau</button>
      </div>
    </form>
  );
};

export default CadeauForm;
