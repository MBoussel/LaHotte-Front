import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { famillesAPI } from '../services/api';

interface Contribution {
  id: number;
  montant: number;
  message: string;
  created_at: string;
  cadeau_titre: string;
  cadeau_owner: number | null;
}

interface ContributionParMembre {
  user_id: number | null;
  username: string;
  total_contribue: number;
  nb_contributions: number;
  contributions: Contribution[];
}

interface ContributionParCadeau {
  cadeau_id: number;
  cadeau_titre: string;
  cadeau_prix: number;
  owner: string;
  total_contribue: number;
  reste: number;
  pourcentage: number;
  nb_contributions: number;
}

interface RecapData {
  famille_id: number;
  famille_nom: string;
  stats_globales: {
    total_contribue: number;
    nb_contributions: number;
    nb_cadeaux: number;
    nb_contributeurs: number;
  };
  contributions_par_membre: ContributionParMembre[];
  contributions_par_cadeau: ContributionParCadeau[];
}

const RecapContributions = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<RecapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'membres' | 'cadeaux'>('membres');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      const response = await famillesAPI.getContributionsRecap(parseInt(id));
      setData(response.data);
    } catch (error: any) {
      if (error.response?.status === 403) {
        alert("Vous n'avez pas accès à ce récapitulatif");
        navigate(`/familles/${id}`);
      } else {
        alert('Erreur lors du chargement');
      }
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Chargement... 🎄</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Données introuvables</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <button
          onClick={() => navigate(`/familles/${id}`)}
          className="text-christmas-red hover:underline mb-4 text-sm md:text-base"
        >
          ← Retour à la famille
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-christmas-red mb-2">
          📊 Récapitulatif des Contributions
        </h1>
        <p className="text-sm md:text-base text-gray-600">{data.famille_nom}</p>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card text-center">
          <p className="text-2xl md:text-3xl font-bold text-christmas-green">
            {data.stats_globales.total_contribue.toFixed(2)} €
          </p>
          <p className="text-xs md:text-sm text-gray-600">Total contribué</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl md:text-3xl font-bold text-christmas-red">
            {data.stats_globales.nb_contributions}
          </p>
          <p className="text-xs md:text-sm text-gray-600">Contributions</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl md:text-3xl font-bold text-blue-600">
            {data.stats_globales.nb_cadeaux}
          </p>
          <p className="text-xs md:text-sm text-gray-600">Cadeaux</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl md:text-3xl font-bold text-purple-600">
            {data.stats_globales.nb_contributeurs}
          </p>
          <p className="text-xs md:text-sm text-gray-600">Contributeurs</p>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('membres')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'membres'
              ? 'text-christmas-red border-b-2 border-christmas-red'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          👥 Par Membre ({data.contributions_par_membre.length})
        </button>
        <button
          onClick={() => setActiveTab('cadeaux')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'cadeaux'
              ? 'text-christmas-red border-b-2 border-christmas-red'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🎁 Par Cadeau ({data.contributions_par_cadeau.length})
        </button>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'membres' ? (
        <div className="space-y-4">
          {data.contributions_par_membre
            .sort((a, b) => b.total_contribue - a.total_contribue)
            .map((membre) => (
              <div key={membre.contributions[0]?.id ?? membre.username} className="card">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold">{membre.username}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-christmas-green">
                      {membre.total_contribue.toFixed(2)} €
                    </p>
                    <p className="text-xs text-gray-600">
                      {membre.nb_contributions} contribution{membre.nb_contributions > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Détail des contributions */}
                <div className="space-y-2">
                  {membre.contributions.map((contrib) => (
                    <div
                      key={contrib.id}
                      className="bg-gray-50 p-3 rounded-lg flex justify-between items-start text-sm"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{contrib.cadeau_titre}</p>
                        {contrib.message && (
                          <p className="text-gray-600 text-xs italic">💬 {contrib.message}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(contrib.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <p className="font-bold text-christmas-green ml-4">{contrib.montant} €</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="space-y-4">
          {data.contributions_par_cadeau
            .sort((a, b) => b.pourcentage - a.pourcentage)
            .map((cadeau) => (
              <div key={cadeau.cadeau_id} className="card">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold">{cadeau.cadeau_titre}</h3>
                    <p className="text-sm text-gray-600">Liste de : {cadeau.owner}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Prix : {cadeau.cadeau_prix} €</p>
                    <p className="text-2xl font-bold text-christmas-green">
                      {cadeau.total_contribue.toFixed(2)} €
                    </p>
                    <p className="text-xs text-gray-600">
                      {cadeau.nb_contributions} contribution{cadeau.nb_contributions > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Barre de progression */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold">
                      {cadeau.pourcentage.toFixed(0)}% collecté
                    </span>
                    {cadeau.reste > 0 ? (
                      <span className="text-gray-600">Reste : {cadeau.reste.toFixed(2)} €</span>
                    ) : (
                      <span className="text-christmas-green font-bold">✅ Objectif atteint</span>
                    )}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        cadeau.pourcentage >= 100 ? 'bg-christmas-green' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(cadeau.pourcentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default RecapContributions;