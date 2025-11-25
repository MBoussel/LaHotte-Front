import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from "react-router-dom";
import { famillesAPI } from '../services/api';
import type { Famille } from '../types';

const Familles = () => {
  const navigate = useNavigate();  // ✅ Hook appelé DANS le composant
  const [familles, setFamilles] = useState<Famille[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    is_public: false,
  });

  useEffect(() => {
    loadFamilles();
  }, []);

  const loadFamilles = async (): Promise<void> => {
    try {
      const response = await famillesAPI.getAll();
      setFamilles(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await famillesAPI.create(formData);
      setFormData({ nom: '', description: '', is_public: false });
      setShowModal(false);
      loadFamilles();
    } catch (error) {
      alert('Erreur lors de la création');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-christmas-red mb-2">
            👨‍👩‍👧‍👦 Mes Familles
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Gérez vos groupes familiaux
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary w-full md:w-auto"
        >
          + Créer une famille
        </button>
      </div>

      {/* Liste des familles */}
      {familles.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-lg md:text-xl text-gray-600 mb-4">
            Vous n'avez pas encore de famille
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-secondary"
          >
            Créer ma première famille
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {familles.map((famille) => (
            <div
              key={famille.id}
              className="card hover:shadow-xl transition cursor-pointer"
              onClick={() => navigate(`/familles/${famille.id}`)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg md:text-xl font-bold break-words flex-1">
                  {famille.nom}
                </h3>
                {famille.is_public && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2 whitespace-nowrap">
                    🌍 Publique
                  </span>
                )}
              </div>
              <p className="text-sm md:text-base text-gray-600 mb-4 break-words">
                {famille.description}
              </p>
              <p className="text-xs md:text-sm text-gray-500">
                👥 {famille.membres?.length || 0} membres
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal Création */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Créer une famille</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nom de la famille *
                </label>
                <input
                  type="text"
                  name="nom"
                  className="input"
                  placeholder="Famille Dupont Noël 2024"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  className="input"
                  placeholder="Notre liste de cadeaux pour Noël..."
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_public}
                    onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">
                    Rendre cette famille publique (visible dans la recherche)
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-6">
                  Les autres utilisateurs pourront demander à rejoindre cette famille
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
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Familles;