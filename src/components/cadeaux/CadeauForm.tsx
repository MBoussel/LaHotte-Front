import AppIcon from '../ui/AppIcon';
import { useState, type FormEvent } from 'react';
import type { Famille, BeneficiaireProfil } from '../../types';

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

      {/* Titre */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Titre du cadeau *
        </label>
        <input
          type="text"
          className="input"
          value={formData.titre}
          onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
          required
          placeholder="Ex: PlayStation 5"
        />
      </div>

      {/* Prix */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Prix (€) *
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          className="input"
          value={formData.prix || ''}
          onChange={(e) => setFormData({ ...formData, prix: parseFloat(e.target.value) })}
          required
          placeholder="Ex: 499.99"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          className="input"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description optionnelle du cadeau..."
        />
      </div>

      {/* URL Photo */}
      <div>
        <label className="block text-sm font-medium mb-1">
          URL de la photo
        </label>
        <input
          type="url"
          className="input"
          value={formData.photo_url}
          onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
          placeholder="https://..."
        />
      </div>

      {/* Lien d'achat */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Lien d'achat
        </label>
        <input
          type="url"
          className="input"
          value={formData.lien_achat}
          onChange={(e) => setFormData({ ...formData, lien_achat: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
        Ce cadeau sera ajouté uniquement à cette famille.
      </div>

      {/* Sélection des bénéficiaires */}
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
            .filter((membre, index, self) => 
              self.findIndex(m => m.id === membre.id) === index // Déduplique
            )
            .map(membre => (
              <label key={membre.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={formData.beneficiaire_ids.includes(membre.id)}
                  onChange={() => {
                    const newIds = formData.beneficiaire_ids.includes(membre.id)
                      ? formData.beneficiaire_ids.filter(id => id !== membre.id)
                      : [...formData.beneficiaire_ids, membre.id];
                    setFormData({ ...formData, beneficiaire_ids: newIds });
                  }}
                  className="rounded"
                />
                <span className="text-sm">{membre.username}</span>
              </label>
            ))}
        </div>
        {formData.beneficiaire_ids.length > 0 && (
          <p className="text-xs text-green-600 mt-1">
            ✅ {formData.beneficiaire_ids.length} bénéficiaire(s) sélectionné(s)
          </p>
        )}
      </div>

      {/* Boutons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="flex-1 btn-primary"
        >
          Créer le cadeau
        </button>
      </div>
    </form>
  );
};

export default CadeauForm;