import AppIcon from '../components/ui/AppIcon';
import { useState, useEffect } from 'react';
import { contributionsAPI, cadeauxAPI } from '../services/api';
import type { Contribution } from '../types';

interface ContributionWithCadeau extends Contribution {
  cadeau?: { id: number; titre: string; prix: number };
}

interface ContributionGroup {
  key: string;
  beneficiaireNom: string;
  contributions: ContributionWithCadeau[];
  total: number;
}

const MesContributions = () => {
  const [contributions, setContributions] = useState<ContributionWithCadeau[]>([]);
  const [stats, setStats] = useState({ total_contribue: 0, nombre_contributions: 0 });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({ montant: 0, message: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [contribRes, statsRes] = await Promise.all([contributionsAPI.getMine(), contributionsAPI.getStats()]);
      const contribsWithCadeau = await Promise.all(contribRes.data.map(async (contrib) => {
        // Une contribution à une cagnotte globale n'est plus liée à un cadeau.
        if (contrib.cadeau_id === null) {
          return { ...contrib, cadeau: undefined };
        }
        try {
          const cadeauRes = await cadeauxAPI.getOne(contrib.cadeau_id);
          return { ...contrib, cadeau: { id: cadeauRes.data.id, titre: cadeauRes.data.titre, prix: cadeauRes.data.prix } };
        } catch {
          return { ...contrib, cadeau: undefined };
        }
      }));
      setContributions(contribsWithCadeau);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
    setLoading(false);
  };

  // Regrouper par identifiant de bénéficiaire (et non par cadeau).
  // Le nom n'est utilisé qu'en dernier recours pour les anciennes données sans identifiant.
  const groupedContributions = Object.values(contributions.reduce<Record<string, ContributionGroup>>((groups, contrib) => {
    const key = contrib.beneficiaire_user_id != null
      ? `user:${contrib.beneficiaire_user_id}`
      : contrib.beneficiaire_profil_id != null
        ? `profil:${contrib.beneficiaire_profil_id}`
        : contrib.beneficiaire_nom
          ? `nom:${contrib.beneficiaire_nom.trim().toLocaleLowerCase('fr-FR')}`
          : `contribution:${contrib.id}`;
    const beneficiaireNom = contrib.beneficiaire_nom || contrib.cadeau?.titre || 'Bénéficiaire indisponible';

    if (!groups[key]) {
      groups[key] = { key, beneficiaireNom, contributions: [], total: 0 };
    }
    groups[key].contributions.push(contrib);
    groups[key].total += Number(contrib.montant) || 0;
    return groups;
  }, {}));

  const handleEdit = (contrib: ContributionWithCadeau) => {
    setEditingId(contrib.id);
    setEditFormData({ montant: contrib.montant, message: contrib.message || '' });
  };

  const handleUpdate = async (id: number) => {
    try {
      await contributionsAPI.update(id, editFormData);
      setEditingId(null);
      await loadData();
      alert('Contribution modifiée');
    } catch {
      alert('Erreur lors de la modification');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer cette contribution ?')) return;
    try {
      await contributionsAPI.delete(id);
      await loadData();
      alert('Contribution supprimée');
    } catch {
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8"><div className="text-center">Chargement...</div></div>;

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-christmas-red mb-2">Mes Contributions</h1>
        <p className="text-sm md:text-base text-gray-600">Toutes vos participations aux cadeaux</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card text-center">
          <p className="text-3xl md:text-4xl font-bold text-christmas-green">{stats.total_contribue.toFixed(2)} €</p>
          <p className="text-sm text-gray-600">Total contribué</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl md:text-4xl font-bold text-christmas-red">{stats.nombre_contributions}</p>
          <p className="text-sm text-gray-600">Versements</p>
        </div>
      </div>

      {groupedContributions.length === 0 ? (
        <div className="card text-center py-12"><p className="text-lg md:text-xl text-gray-600">Vous n'avez pas encore contribué à de cadeaux</p></div>
      ) : (
        <div className="space-y-4">
          {groupedContributions.map((group) => (
            <div key={group.key} className="card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold">Cagnotte de {group.beneficiaireNom}</h3>
                  <p className="text-sm text-gray-500">{group.contributions.length} versement{group.contributions.length > 1 ? 's' : ''}</p>
                </div>
                <p className="text-2xl font-bold text-christmas-green">{group.total.toFixed(2)} €</p>
              </div>

              <details className="mt-4 border-t pt-3">
                <summary className="cursor-pointer text-sm font-medium text-blue-700 hover:text-blue-800">
                  Voir le détail des versements
                </summary>
                <div className="mt-3 space-y-3">
                  {group.contributions.map((contrib) => (
                    <div key={contrib.id} className="rounded-lg bg-gray-50 p-3">
                      {editingId === contrib.id ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Montant (€)</label>
                            <input type="number" step="0.01" min="0" className="input" value={editFormData.montant}
                              onChange={(e) => setEditFormData({ ...editFormData, montant: parseFloat(e.target.value) })} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Message</label>
                            <textarea className="input" rows={2} value={editFormData.message}
                              onChange={(e) => setEditFormData({ ...editFormData, message: e.target.value })} placeholder="Message optionnel..." />
                          </div>
                          <div className="flex gap-2 pt-2">
                            <button onClick={() => setEditingId(null)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition">Annuler</button>
                            <button onClick={() => handleUpdate(contrib.id)} className="flex-1 btn-primary">Enregistrer</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                          <div className="flex-1">
                            <p className="text-lg font-bold text-christmas-green">{Number(contrib.montant).toFixed(2)} €</p>
                            {contrib.cadeau && <p className="text-sm text-gray-600">Versé depuis le cadeau : {contrib.cadeau.titre}</p>}
                            {contrib.message && <p className="text-sm text-gray-700 italic mt-1"><AppIcon name="message" size={16} /> "{contrib.message}"</p>}
                            <span className="text-xs text-gray-500">{new Date(contrib.created_at).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(contrib)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition whitespace-nowrap">Modifier</button>
                            <button onClick={() => handleDelete(contrib.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition whitespace-nowrap">Supprimer</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MesContributions;
