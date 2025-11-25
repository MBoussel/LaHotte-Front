import { useState, type FormEvent, type ChangeEvent } from 'react';
import { famillesAPI } from '../services/api';
import type { Famille } from '../types';

const RechercherFamilles = () => {
  const [query, setQuery] = useState('');
  const [familles, setFamilles] = useState<Famille[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedFamille, setSelectedFamille] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const response = await famillesAPI.searchPublic(query);
      setFamilles(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
    setLoading(false);
  };

  const handleDemande = async (familleId: number) => {
    try {
      await famillesAPI.requestToJoin(familleId, message);
      alert('Demande envoyée au créateur ! 🎉');
      setSelectedFamille(null);
      setMessage('');
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Erreur');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-christmas-red mb-2">
            🔍 Rechercher une famille
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Trouvez et rejoignez des familles publiques
          </p>
        </div>

        {/* Formulaire de recherche */}
        <form onSubmit={handleSearch} className="mb-6 md:mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              className="input flex-1"
              placeholder="Nom de la famille..."
            />
            <button type="submit" className="btn-primary whitespace-nowrap" disabled={loading}>
              {loading ? 'Recherche...' : 'Rechercher'}
            </button>
          </div>
        </form>

        {/* Résultats */}
        {searched && (
          <>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Recherche en cours... 🔍</p>
              </div>
            ) : familles.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-lg md:text-xl text-gray-600 mb-2">
                  Aucune famille trouvée
                </p>
                <p className="text-sm md:text-base text-gray-500">
                  Essayez un autre terme de recherche
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  {familles.length} famille{familles.length > 1 ? 's' : ''} trouvée{familles.length > 1 ? 's' : ''}
                </p>

                {familles.map((famille) => (
                  <div key={famille.id} className="card hover:shadow-lg transition">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-bold mb-2">{famille.nom}</h3>
                        <p className="text-sm md:text-base text-gray-600 mb-2">
                          {famille.description}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500">
                          👥 {famille.membres?.length || 0} membres
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedFamille(famille.id)}
                        className="btn-primary w-full md:w-auto whitespace-nowrap"
                      >
                        Demander à rejoindre
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Modal Demande */}
        {selectedFamille && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="card max-w-md w-full">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                Demander à rejoindre
              </h2>
              <p className="text-sm md:text-base text-gray-600 mb-4">
                Envoyez un message au créateur pour rejoindre cette famille
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleDemande(selectedFamille);
                }}
              >
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input mb-4"
                  rows={4}
                  placeholder="Message optionnel pour le créateur..."
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFamille(null);
                      setMessage('');
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Annuler
                  </button>
                  <button type="submit" className="flex-1 btn-primary">
                    Envoyer la demande
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RechercherFamilles;