import AppIcon from '../components/ui/AppIcon';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { famillesAPI } from '../services/api';

interface Contribution {
  id: number;
  montant: number;
  created_at: string;
  contributeur: string;
}

interface BeneficiaireRecap {
  beneficiaire_id: number;
  type: 'utilisateur' | 'profil';
  nom: string;
  total_contribue: number;
  nb_contributions: number;
  contributions: Contribution[];
}

interface RecapData {
  famille_id: number;
  famille_nom: string;
  stats_globales: {
    total_contribue: number;
    nb_contributions: number;
    nb_beneficiaires: number;
    nb_contributeurs: number;
  };
  contributions_par_beneficiaire: BeneficiaireRecap[];
}

const RecapContributions = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<RecapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const response = await famillesAPI.getContributionsRecap(parseInt(id, 10));
        setData(response.data);
      } catch (error: any) {
        if (error.response?.status === 403) {
          alert("Vous n'avez pas accès à ce récapitulatif");
          navigate(`/familles/${id}`);
        } else {
          alert('Erreur lors du chargement');
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center inline-flex items-center gap-2"><AppIcon name="tree" size={22} /> Chargement...</div>
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
      <div className="mb-6 md:mb-8">
        <button
          onClick={() => navigate(`/familles/${id}`)}
          className="text-christmas-red hover:underline mb-4 text-sm md:text-base"
        >
          ← Retour à la famille
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-christmas-red mb-2">
          <AppIcon name="chart" size={26} /> Récapitulatif des cagnottes
        </h1>
        <p className="text-sm md:text-base text-gray-600">{data.famille_nom}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card text-center">
          <p className="text-2xl md:text-3xl font-bold text-christmas-green">{data.stats_globales.total_contribue.toFixed(2)} €</p>
          <p className="text-xs md:text-sm text-gray-600">Total collecté</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl md:text-3xl font-bold text-christmas-red">{data.stats_globales.nb_contributions}</p>
          <p className="text-xs md:text-sm text-gray-600">Contributions</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl md:text-3xl font-bold text-blue-600">{data.stats_globales.nb_beneficiaires}</p>
          <p className="text-xs md:text-sm text-gray-600">Cagnottes alimentées</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl md:text-3xl font-bold text-purple-600">{data.stats_globales.nb_contributeurs}</p>
          <p className="text-xs md:text-sm text-gray-600">Contributeurs</p>
        </div>
      </div>

      <div className="space-y-4">
        {data.contributions_par_beneficiaire.length === 0 ? (
          <div className="card text-center text-gray-600">
            Aucune contribution enregistrée pour les cagnottes que vous pouvez consulter.
          </div>
        ) : (
          data.contributions_par_beneficiaire.map((beneficiaire) => (
            <section key={`${beneficiaire.type}-${beneficiaire.beneficiaire_id}`} className="card">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
                <div>
                  <h2 className="text-lg md:text-xl font-bold">{beneficiaire.nom}</h2>
                  <p className="text-xs text-gray-500">
                    {beneficiaire.type === 'profil' ? 'Bénéficiaire sans compte' : 'Membre de la famille'}
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="text-2xl font-bold text-christmas-green">{beneficiaire.total_contribue.toFixed(2)} €</p>
                  <p className="text-xs text-gray-600">
                    {beneficiaire.nb_contributions} contribution{beneficiaire.nb_contributions > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {beneficiaire.contributions.map((contribution) => (
                  <div key={contribution.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center gap-3 text-sm">
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{contribution.contributeur}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(contribution.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <p className="font-bold text-christmas-green whitespace-nowrap">{contribution.montant.toFixed(2)} €</p>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
};

export default RecapContributions;
