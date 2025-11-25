import { useState, useEffect } from 'react';
import { famillesAPI } from '../../services/api';
import type { Invitation } from '../../types';

interface InvitationsProps {
  familleId: number;
  isCreator: boolean;
}

const Invitations = ({ familleId, isCreator }: InvitationsProps) => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');

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
      console.error('Erreur:', error);
    }
  };

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await famillesAPI.createInvitation(familleId, email);
      setEmail('');
      setShowModal(false);
      loadInvitations();
      alert('Invitation envoyée !');
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Erreur lors de l\'envoi');
    }
  };

  if (!isCreator) return null;

  return (
    <div className="card mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📨 Invitations</h2>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + Inviter quelqu'un
        </button>
      </div>

      {invitations.length === 0 ? (
        <p className="text-gray-500">Aucune invitation envoyée</p>
      ) : (
        <div className="space-y-2">
          {invitations.map((inv) => (
            <div key={inv.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
              <div>
                <span className="font-semibold">{inv.email}</span>
                <span className="ml-3 text-sm text-gray-500">
                  {inv.accepted ? '✅ Acceptée' : '⏳ En attente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Invitation */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Inviter quelqu'un</h2>
            
            <form onSubmit={handleSendInvitation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  className="input"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  La personne doit avoir un compte pour accepter l'invitation
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                >
                  Annuler
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Envoyer l'invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invitations;