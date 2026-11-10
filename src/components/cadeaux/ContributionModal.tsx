import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { contributionsAPI } from '../../services/api';
import type { ContributionWithUser } from '../../types';

interface ContributionModalProps {
  cadeauId: number;
  cadeauTitre: string;
  prixTotal: number;
  onClose: () => void;
  onSuccess: () => void;
  showDetails?: boolean;
}

const ContributionModal = ({ cadeauId, cadeauTitre, prixTotal, onClose, onSuccess, showDetails = false }: ContributionModalProps) => {
  const [contributions, setContributions] = useState<ContributionWithUser[]>([]);
  const [formData, setFormData] = useState({ montant: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showDetails) loadContributions();
  }, [cadeauId, showDetails]);

  const loadContributions = async () => {
    try {
      const response = await contributionsAPI.getForCadeau(cadeauId);
      setContributions(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const totalContribue = contributions.reduce((sum, c) => sum + c.montant, 0);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contributionsAPI.contribute(cadeauId, {
        montant: parseFloat(formData.montant),
        message: formData.message,
      });
      setFormData({ montant: '', message: '' });
      if (showDetails) loadContributions();
      onSuccess();
      alert('Merci pour votre contribution ! 🎁');
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Erreur lors de la contribution');
    }
    setLoading(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="card max-w-2xl w-full my-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Contribuer à : {cadeauTitre}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        {showDetails && (
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold">{totalContribue.toFixed(2)} € collectés</span>
              <span className="text-gray-600">{prixTotal.toFixed(2)} € total</span>
            </div>
            <p className="text-sm text-gray-600">{contributions.length} contribution(s) enregistrée(s)</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Montant (€) *</label>
            <input
              type="number" name="montant" step="0.01" min="0.01"
              className="input" placeholder="Montant souhaité"
              value={formData.montant} onChange={handleChange} required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message (optionnel)</label>
            <textarea
              name="message" className="input" placeholder="Un petit message..." rows={3}
              value={formData.message} onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Contribution...' : 'Contribuer'}
          </button>
        </form>

        {showDetails && contributions.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-3">Contributions ({contributions.length})</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {contributions.map((contrib) => (
                <div key={contrib.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold">👤 {contrib.contributeur}</span>
                    <span className="text-christmas-green font-bold">{contrib.montant.toFixed(2)} €</span>
                  </div>
                  {contrib.message && <p className="text-sm text-gray-600 italic">"{contrib.message}"</p>}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(contrib.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributionModal;
