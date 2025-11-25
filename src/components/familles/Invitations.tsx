import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { famillesAPI } from '../../services/api';
import type { Invitation } from '../../types';

interface InvitationsProps {
  familleId: number;
  isCreator: boolean;
}

const Invitations = ({ familleId, isCreator }: InvitationsProps) => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  useEffect(() => {
    if (isCreator) {
      loadInvitations();
    }
  }, [familleId, isCreator]);

  const loadInvitations = async () => {
    try {
      const response = await famillesAPI.getInvitations(familleId);
      setInvitations(response.data);
    } catch (error) {
      console.error('Erreur chargement invitations:', error);
    }
  };

  const handleInvite = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await famillesAPI.invite(familleId, email);
      alert(`✅ Invitation envoyée à ${email} !`);
      setEmail('');
      setShowModal(false);
      loadInvitations(); // Recharger la liste
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Erreur lors de l\'envoi';
      alert(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isCreator) return null;

  return (
    <>
      <div className="card mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold">📧 Invitations</h2>
            {invitations.length > 0 && (
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                {invitations.length} invitation{invitations.length > 1 ? 's' : ''} en attente
              </p>
            )}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary w-full sm:w-auto text-sm md:text-base"
          >
            + Inviter quelqu'un
          </button>
        </div>

        {invitations.length > 0 && (
          <div className="space-y-2">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 bg-gray-50 rounded border border-gray-200"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base font-medium truncate">{inv.email}</p>
                  <p className="text-xs md:text-sm">
                    {inv.accepted ? (
                      <span className="text-green-600">✅ Acceptée</span>
                    ) : (
                      <span className="text-orange-600">⏳ En attente</span>
                    )}
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(inv.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Invitation */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Inviter quelqu'un</h2>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Adresse email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="input"
                  placeholder="exemple@email.com"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Un email d'invitation sera envoyé à cette adresse
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEmail('');
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Invitations;