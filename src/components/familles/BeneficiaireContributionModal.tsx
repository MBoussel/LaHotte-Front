import { useEffect, useState, type FormEvent } from 'react';
import { contributionsAPI } from '../../services/api';
import type { ContributionWithUser } from '../../types';

interface Props {
  type: 'utilisateur' | 'profil';
  beneficiaireId: number;
  beneficiaireNom: string;
  familleId: number;
  showDetails: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BeneficiaireContributionModal = ({
  type, beneficiaireId, beneficiaireNom, familleId, showDetails, onClose, onSuccess,
}: Props) => {
  const [contributions, setContributions] = useState<ContributionWithUser[]>([]);
  const [montant, setMontant] = useState('');
  const [loading, setLoading] = useState(false);

  const loadDetails = async () => {
    try {
      const response = type === 'profil'
        ? await contributionsAPI.getForProfile(beneficiaireId)
        : await contributionsAPI.getForUser(beneficiaireId, familleId);
      setContributions(response.data);
    } catch (error) {
      console.error('Erreur de chargement de la cagnotte:', error);
      setContributions([]);
    }
  };

  useEffect(() => {
    if (showDetails) void loadDetails();
  }, [type, beneficiaireId, familleId, showDetails]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = { montant: Number(montant) };
      if (type === 'profil') {
        await contributionsAPI.contributeToProfile(beneficiaireId, payload);
      } else {
        await contributionsAPI.contributeToUser(beneficiaireId, familleId, payload);
      }
      setMontant('');
      if (showDetails) await loadDetails();
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Erreur lors de la contribution');
    } finally {
      setLoading(false);
    }
  };

  const total = contributions.reduce((sum, contribution) => sum + contribution.montant, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60] overflow-y-auto" onClick={onClose}>
      <div className="card max-w-xl w-full my-8" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <p className="text-sm text-gray-500">Cagnotte de</p>
            <h2 className="text-2xl font-bold">{beneficiaireNom}</h2>
          </div>
          <button type="button" onClick={onClose} className="text-gray-500 text-2xl" aria-label="Fermer">×</button>
        </div>

        {showDetails && (
          <div className="rounded-xl bg-green-50 border border-green-100 p-4 mb-5">
            <p className="text-2xl font-bold text-green-800">{total.toFixed(2)} €</p>
            <p className="text-sm text-green-800">{contributions.length} contribution(s)</p>
            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
              {contributions.map((contribution) => (
                <div key={contribution.id} className="flex justify-between gap-3 text-sm border-t border-green-100 pt-2">
                  <div>
                    <p className="font-semibold">{contribution.contributeur}</p>
                    <p className="text-xs text-gray-500">{new Date(contribution.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <span className="font-bold whitespace-nowrap">{contribution.montant.toFixed(2)} €</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Montant (€) *</label>
            <input name="montant" type="number" step="0.01" min="0.01" className="input" value={montant} onChange={(event) => setMontant(event.target.value)} required placeholder="Montant souhaité" />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Contribution...' : 'Participer à la cagnotte'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BeneficiaireContributionModal;
