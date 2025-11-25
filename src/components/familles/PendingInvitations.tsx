import { useState, useEffect } from 'react';
import { famillesAPI } from '../../services/api';
import type { Invitation } from '../../types';

const PendingInvitations = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      const response = await famillesAPI.getPendingInvitations();
      setInvitations(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleAccept = async (token: string) => {
    try {
      await famillesAPI.acceptInvitation(token);
      alert('Vous avez rejoint la famille ! 🎉');
      loadInvitations();
      window.location.reload();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Erreur');
    }
  };

  if (invitations.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full lg:w-auto bg-christmas-gold text-gray-900 px-4 py-2 rounded hover:bg-yellow-400 transition font-semibold animate-pulse text-sm"
      >
        🎁 {invitations.length} invitation{invitations.length > 1 ? 's' : ''}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-3 border-b">
              <h2 className="text-xl md:text-2xl font-bold">🎄 Invitations</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              {invitations.map((inv) => (
                <div key={inv.id} className="border-2 border-christmas-green rounded-lg p-3 md:p-4 bg-green-50">
                  <div className="flex items-start gap-2 md:gap-3 mb-3">
                    <div className="text-2xl md:text-3xl">🎁</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-base md:text-lg text-christmas-green mb-1 truncate">
                        {inv.famille_nom || 'Famille'}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600">
                        Vous êtes invité(e) à rejoindre cette famille !
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleAccept(inv.token)}
                    className="w-full btn-primary text-sm md:text-base"
                  >
                    ✅ Accepter
                  </button>
                  
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    {new Date(inv.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 p-2 md:p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">
                💡 En acceptant, vous pourrez voir les cadeaux !
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PendingInvitations;