import { useState, type FormEvent } from 'react';
import type { Famille } from '../../types';

export interface CadeauFormData {
  titre: string;
  prix: number;
  description: string;
  photo_url: string;
  lien_achat: string;
  famille_ids: number[];
  beneficiaire_ids: number[];  
}

interface CadeauFormProps {
  currentFamilleId: number;
  mesFamilles: Famille[];
  onSubmit: (data: CadeauFormData) => void;
  onCancel: () => void;
}

const CadeauForm = ({ currentFamilleId, mesFamilles, onSubmit, onCancel }: CadeauFormProps) => {
    console.log('mesFamilles:', mesFamilles);
  console.log('mesFamilles[0]?.membres:', mesFamilles[0]?.membres);
  const [formData, setFormData] = useState<CadeauFormData>({
    titre: '',
    prix: 0,
    description: '',
    photo_url: '',
    lien_achat: '',
    famille_ids: [currentFamilleId],
    beneficiaire_ids: [],  
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.famille_ids.length === 0) {
      alert('Veuillez sélectionner au moins une famille');
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
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      {/* Sélection des familles */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Ajouter ce cadeau dans ces familles * (au moins 1)
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
          {mesFamilles.map((fam) => (
            <label
              key={fam.id}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="checkbox"
                checked={formData.famille_ids.includes(fam.id)}
                onChange={() => {
                  const newIds = formData.famille_ids.includes(fam.id)
                    ? formData.famille_ids.filter((id) => id !== fam.id)
                    : [...formData.famille_ids, fam.id];
                  setFormData({ ...formData, famille_ids: newIds });
                }}
                className="rounded"
              />
              <span className="text-sm font-medium">{fam.nom}</span>
            </label>
          ))}
        </div>
        {formData.famille_ids.length === 0 && (
          <p className="text-xs text-red-600 mt-1">
            ⚠️ Sélectionnez au moins une famille
          </p>
        )}
      </div>

      {/* Sélection des bénéficiaires */}
      <div>
        <label className="block text-sm font-medium mb-2">
          👥 Bénéficiaires (optionnel)
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