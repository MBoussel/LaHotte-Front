import { useState, useEffect } from 'react';
import { contributionsAPI, cadeauxAPI } from '../services/api';
import type { Contribution } from '../types';

interface ContributionWithCadeau extends Contribution {
  cadeau?: {
    id: number;
    titre: string;
    prix: number;
  };
}

const MesContributions = () => {
  const [contributions, setContributions] = useState<ContributionWithCadeau[]>([]);
  const [stats, setStats] = useState({ total_contribue: 0, nombre_contributions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [contribRes, statsRes] = await Promise.all([
        contributionsAPI.getMine(),
        contributionsAPI.getStats(),
      ]);

      // Charger les infos des cadeaux
      const contribsWithCadeau = await Promise.all(
        contribRes.data.map(async (contrib) => {
          try {
            const cadeauRes = await cadeauxAPI.getOne(contrib.cadeau_id);
            return {
              ...contrib,
              cadeau: {
                id: cadeauRes.data.id,
                titre: cadeauRes.data.titre,
                prix: cadeauRes.data.prix,
              },
            };
          } catch (error) {
            return { ...contrib, cadeau: undefined };
          }
        })
      );

      setContributions(contribsWithCadeau);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer cette contribution ?')) return;

    try {
      await contributionsAPI.delete(id);
      loadData();
      alert('Contribution supprimée ✅');
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Chargement... 🎄</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-christmas-red mb-2">
          💝 Mes Contributions
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Toutes vos participations aux cadeaux
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card text-center">
          <p className="text-3xl md:text-4xl font-bold text-christmas-green">
            {stats.total_contribue.toFixed(2)} €
          </p>
          <p className="text-sm text-gray-600">Total contribué</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl md:text-4xl font-bold text-christmas-red">
            {stats.nombre_contributions}
          </p>
          <p className="text-sm text-gray-600">Contribution{stats.nombre_contributions > 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Liste des contributions */}
      {contributions.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-lg md:text-xl text-gray-600">
            Vous n'avez pas encore contribué à de cadeaux
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {contributions.map((contrib) => (
            <div key={contrib.id} className="card">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                {/* Infos contribution */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">
                    {contrib.cadeau?.titre || 'Cadeau supprimé'}
                  </h3>
                  <p className="text-2xl font-bold text-christmas-green mb-2">
                    {contrib.montant} €
                  </p>
                  {contrib.cadeau && (
                    <p className="text-sm text-gray-600 mb-2">
                      Prix total du cadeau : {contrib.cadeau.prix} €
                    </p>
                  )}
                  {contrib.message && (
                    <p className="text-sm text-gray-700 italic mb-2">
                      💬 "{contrib.message}"
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {contrib.is_anonymous && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        🎭 Anonyme
                      </span>
                    )}
                    <span className="text-gray-500">
                      {new Date(contrib.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>

                {/* Bouton supprimer */}
                <button
                  onClick={() => handleDelete(contrib.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition whitespace-nowrap"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MesContributions;