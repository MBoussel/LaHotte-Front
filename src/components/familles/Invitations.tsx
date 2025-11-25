import { useState, type FormEvent, type ChangeEvent } from 'react';
import { famillesAPI } from '../../services/api';

interface InvitationsProps {
  familleId: number;
  isCreator: boolean;
}

const Invitations = ({ familleId, isCreator }: InvitationsProps) => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInvite = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await famillesAPI.invite(familleId, email);
      alert(`Invitation envoyée à ${email} ! 📧`);
      setEmail('');
      setShowModal(false);
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  if (!isCreator) return null;

  return (
    <>
      <div className="card mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-lg md:text-xl font-bold">📧 Inviter des membres</h2>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              Invitez vos proches à rejoindre cette famille
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary w-full sm:w-auto text-sm md:text-base"
          >
            + Inviter quelqu'un
          </button>
        </div>
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