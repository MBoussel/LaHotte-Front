import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { famillesAPI } from '../services/api';
import type { Famille } from '../types';

const Familles = () => {
  const [familles, setFamilles] = useState<Famille[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
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
      setFormData({ nom: '', description: '' });
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-christmas-red">
          👨‍👩‍👧‍👦 Mes Familles
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          + Créer une famille
        </button>
      </div>

      {/* Liste des familles */}
      {familles.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-xl text-gray-600 mb-4">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {familles.map((famille) => (
            <Link
              key={famille.id}
              to={`/familles/${famille.id}`}
              className="card hover:shadow-xl transition cursor-pointer"
            >
              <h3 className="text-xl font-bold mb-2">{famille.nom}</h3>
              <p className="text-gray-600 mb-4">{famille.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>👥 {famille.membres?.length || 0} membres</span>
                <span className="text-christmas-gold">Voir →</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Modal Création */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Créer une famille</h2>
            
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