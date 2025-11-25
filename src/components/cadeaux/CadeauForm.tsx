import { useState, type FormEvent, type ChangeEvent } from 'react';
import type { Famille } from '../../types';

interface CadeauFormProps {
  currentFamilleId: number;
  mesFamilles: Famille[];
  onSubmit: (data: CadeauFormData) => Promise<void>;
  onCancel: () => void;
}

export interface CadeauFormData {
  titre: string;
  prix: number;
  description: string;
  photo_url: string;
  lien_achat: string;
  famille_ids: number[];
}

const CadeauForm = ({ currentFamilleId, mesFamilles, onSubmit, onCancel }: CadeauFormProps) => {
  const [formData, setFormData] = useState({
    titre: '',
    prix: '',
    description: '',
    photo_url: '',
    lien_achat: '',
    famille_ids: [currentFamilleId],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFamilleToggle = (familleId: number) => {
    setFormData((prev) => {
      const newIds = prev.famille_ids.includes(familleId)
        ? prev.famille_ids.filter((id) => id !== familleId)
        : [...prev.famille_ids, familleId];
      return { ...prev, famille_ids: newIds };
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.famille_ids.length === 0) {
      alert('Veuillez sélectionner au moins une famille');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        titre: formData.titre,
        prix: parseFloat(formData.prix),
        description: formData.description,
        photo_url: formData.photo_url,
        lien_achat: formData.lien_achat,
        famille_ids: formData.famille_ids,
      });
    } catch (error) {
      alert('Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Titre *</label>
        <input
          type="text"
          name="titre"
          className="input"
          placeholder="iPhone 15"
          value={formData.titre}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Prix (€) *</label>
        <input
          type="number"
          name="prix"
          step="0.01"
          min="0"
          className="input"
          placeholder="999.99"
          value={formData.prix}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">URL de la photo</label>
        <input
          type="url"
          name="photo_url"
          className="input"
          placeholder="https://example.com/image.jpg"
          value={formData.photo_url}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Lien d'achat</label>
        <input
          type="url"
          name="lien_achat"
          className="input"
          placeholder="https://amazon.fr/produit"
          value={formData.lien_achat}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          className="input"
          placeholder="Détails..."
          rows={3}
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      {/* Sélection des familles */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Ajouter ce cadeau dans ces familles * (au moins 1)
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
          {mesFamilles.map((fam) => (
            <label
              key={fam.id}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="checkbox"
                checked={formData.famille_ids.includes(fam.id)}
                onChange={() => handleFamilleToggle(fam.id)}
                className="w-4 h-4"
              />
              <span className="text-sm">{fam.nom}</span>
              {fam.id === currentFamilleId && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  Famille actuelle
                </span>
              )}
            </label>
          ))}
        </div>
        {formData.famille_ids.length === 0 && (
          <p className="text-xs text-red-600 mt-1">Sélectionnez au moins une famille</p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
          disabled={loading}
        >
          Annuler
        </button>
        <button type="submit" className="flex-1 btn-primary" disabled={loading}>
          {loading ? 'Création...' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

export default CadeauForm;