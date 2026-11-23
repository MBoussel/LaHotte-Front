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
  });
  const [extractingPhoto, setExtractingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');

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
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Pour qui est ce cadeau ?</label>
        <select
          className="input"
          value={formData.beneficiaire_profil_id ?? ''}
          onChange={(e) => setFormData({ ...formData, beneficiaire_profil_id: e.target.value ? Number(e.target.value) : undefined })}
        >
          <option value="">Ma liste personnelle</option>
          {beneficiaires.map((profil) => (
            <option key={profil.id} value={profil.id}>{profil.nom}</option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">Choisis un bénéficiaire si ce cadeau est destiné à un enfant ou à une personne sans compte.</p>
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
        <label className="block text-sm font-medium mb-1">Photo du cadeau (modifiable)</label>
        <input type="url" className="input" value={formData.photo_url}
          onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
          placeholder="Laisse vide pour utiliser la récupération automatique" />
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

      <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
        Ce cadeau sera ajouté uniquement à cette famille.
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          <AppIcon name="members" size={18} /> Bénéficiaires (optionnel)
        </label>
        <p className="text-xs text-gray-600 mb-2">
          Si ce cadeau est pour plusieurs personnes (ex: toi et ton/ta partenaire)
        </p>
        <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
          {mesFamilles
            .filter(fam => formData.famille_ids.includes(fam.id))
            .flatMap(fam => fam.membres || [])
            .filter((membre, index, self) => self.findIndex(m => m.id === membre.id) === index)
            .map(membre => (
              <label key={membre.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input type="checkbox" checked={formData.beneficiaire_ids.includes(membre.id)}
                  onChange={() => {
                    const newIds = formData.beneficiaire_ids.includes(membre.id)
                      ? formData.beneficiaire_ids.filter(id => id !== membre.id)
                      : [...formData.beneficiaire_ids, membre.id];
                    setFormData({ ...formData, beneficiaire_ids: newIds });
                  }} className="rounded" />
                <span className="text-sm">{membre.username}</span>
              </label>
            ))}
        </div>
        {formData.beneficiaire_ids.length > 0 && (
          <p className="text-xs text-green-600 mt-1">
            {formData.beneficiaire_ids.length} bénéficiaire(s) sélectionné(s)
          </p>
        )}
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
