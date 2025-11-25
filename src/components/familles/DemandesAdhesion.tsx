import { useState, useEffect } from 'react';
import { famillesAPI } from '../../services/api';

interface DemandeAdhesion {
  id: number;
  famille_id: number;
  user_id: number;
  message: string;
  created_at: string;
  user_username: string | null;
  user_email: string | null;
}

interface DemandesAdhesionProps {
  familleId: number;
  isCreator: boolean;
}

const DemandesAdhesion = ({ familleId, isCreator }: DemandesAdhesionProps) => {
  const [demandes, setDemandes] = useState<DemandeAdhesion[]>([]);

  useEffect(() => {
    if (isCreator) {
      loadDemandes();
    }
  }, [familleId, isCreator]);

  const loadDemandes = async () => {
    try {
      const response = await famillesAPI.getDemandes(familleId);
      setDemandes(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleAccept = async (demandeId: number) => {
    try {
      await famillesAPI.acceptDemande(demandeId);
      alert('Demande acceptée ! ✅');
      loadDemandes();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Erreur');
    }
  };

  const handleReject = async (demandeId: number) => {
    if (!confirm('Refuser cette demande ?')) return;
    try {
      await famillesAPI.rejectDemande(demandeId);
      loadDemandes();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Erreur');
    }
  };

  if (!isCreator || demandes.length === 0) return null;

  return (
    <div className="card mb-6 md:mb-8 border-2 border-christmas-gold">
      <h2 className="text-lg md:text-xl font-bold mb-4">
        📬 Demandes d'adhésion ({demandes.length})
      </h2>

      <div className="space-y-3">
        {demandes.map((demande) => (
          <div key={demande.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 md:p-4">
            <div className="flex flex-col md:flex-row justify-between items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm md:text-base">
                  {demande.user_username}
                </p>
                <p className="text-xs md:text-sm text-gray-600 break-all">
                  {demande.user_email}
                </p>
                {demande.message && (
                  <p className="text-xs md:text-sm text-gray-700 mt-2 italic">
                    "{demande.message}"
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(demande.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={() => handleAccept(demande.id)}
                  className="flex-1 md:flex-initial bg-christmas-green hover:bg-green-800 text-white px-3 py-2 rounded-lg transition text-sm whitespace-nowrap"
                >
                  ✅ Accepter
                </button>
                <button
                  onClick={() => handleReject(demande.id)}
                  className="flex-1 md:flex-initial bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition text-sm whitespace-nowrap"
                >
                  ❌ Refuser
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemandesAdhesion;