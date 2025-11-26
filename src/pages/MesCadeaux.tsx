import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { cadeauxAPI } from '../services/api';
import type { Cadeau } from '../types';

const MesCadeaux = () => {
  const [cadeaux, setCadeaux] = useState<Cadeau[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    titre: '',
    prix: '',
    description: '',
    photo_url: '',
    lien_achat: '',
  });

  useEffect(() => {
    loadCadeaux();
  }, []);

  const loadCadeaux = async (): Promise<void> => {
    try {
      const response = await cadeauxAPI.getMine();
      setCadeaux(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
    setLoading(false);
  };

  const handleEdit = (cadeau: Cadeau): void => {
    setEditingId(cadeau.id);
    setEditFormData({
      titre: cadeau.titre,
      prix: cadeau.prix.toString(),
      description: cadeau.description || '',
      photo_url: cadeau.photo_url || '',
      lien_achat: cadeau.lien_achat || '',
    });
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>, id: number): Promise<void> => {
    e.preventDefault();
    try {
      await cadeauxAPI.update(id, {
        titre: editFormData.titre,
        prix: parseFloat(editFormData.prix),
        description: editFormData.description,
        photo_url: editFormData.photo_url,
        lien_achat: editFormData.lien_achat,
      });
      setEditingId(null);
      loadCadeaux();
    } catch (error) {
      alert('Erreur lors de la modification');
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce cadeau ?')) return;
    
    try {
      await cadeauxAPI.delete(id);
      loadCadeaux();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
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
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-christmas-red mb-2">
          🎁 Mes Cadeaux
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Gérez tous vos cadeaux
        </p>
      </div>

      {cadeaux.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-lg md:text-xl text-gray-600 mb-4">
            Vous n'avez pas encore ajouté de cadeaux
          </p>
          <p className="text-sm md:text-base text-gray-500">
            Allez dans une famille pour ajouter des cadeaux !
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {cadeaux.map((cadeau) => (
            <div
              key={cadeau.id}
              className={`card ${cadeau.is_purchased ? 'border-4 border-christmas-green' : ''}`}
            >
              {editingId === cadeau.id ? (
                // Mode édition
                <form onSubmit={(e) => handleUpdate(e, cadeau.id)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Titre</label>
                      <input
                        type="text"
                        name="titre"
                        className="input"
                        value={editFormData.titre}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Prix (€)</label>
                      <input
                        type="number"
                        name="prix"
                        step="0.01"
                        min="0"
                        className="input"
                        value={editFormData.prix}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">URL Photo</label>
                    <input
                      type="url"
                      name="photo_url"
                      className="input"
                      value={editFormData.photo_url}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Lien d'achat</label>
                    <input
                      type="url"
                      name="lien_achat"
                      className="input"
                      value={editFormData.lien_achat}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      name="description"
                      className="input"
                      rows={3}
                      value={editFormData.description}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Annuler
                    </button>
                    <button type="submit" className="flex-1 btn-primary">
                      Enregistrer
                    </button>
                  </div>
                </form>
              ) : (
                // Mode affichage
                <div>
                  {/* Badge Acheté */}
                  {cadeau.is_purchased && (
                    <div className="bg-christmas-green text-white px-4 py-2 rounded-lg mb-3 font-bold text-center text-sm md:text-base">
                      ✅ Cadeau acheté !
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Image */}
                    {cadeau.photo_url && (
                      <img
                        src={cadeau.photo_url}
                        alt={cadeau.titre}
                        className="w-full md:w-32 h-48 md:h-32 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    
                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold mb-2 break-words">
                        {cadeau.titre}
                      </h3>
                      <p className="text-xl md:text-2xl font-bold text-christmas-red mb-2">
                        {cadeau.prix} €
                      </p>
                      {cadeau.description && (
                        <p className="text-sm md:text-base text-gray-600 mb-2 break-words">
                          {cadeau.description}
                        </p>
                      )}
                      {cadeau.lien_achat && (
                       <a 
                          href={cadeau.lien_achat}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline text-sm break-all"
                        >
                          🛒 Voir le produit →
                        </a>
                      )}
                      <div className="text-xs md:text-sm text-gray-500 mt-2">
                       {/* Nombre de familles non disponible */}
                      </div>

                      {/* Info : Contributions cachées */}
                      <div className="mt-3 p-2 md:p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs md:text-sm text-blue-800">
                          🎁 <strong>Les contributions sont cachées</strong> pour que ce soit une
                          surprise ! Les membres de votre famille peuvent contribuer sans que vous le
                          sachiez.
                        </p>
                      </div>
                    </div>
                    
                    {/* Boutons d'action */}
                    <div className="flex md:flex-col gap-2 md:gap-2">
                      <button
                        onClick={() => handleEdit(cadeau)}
                        className="flex-1 md:flex-initial bg-blue-500 hover:bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg transition text-sm md:text-base whitespace-nowrap"
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(cadeau.id)}
                        className="flex-1 md:flex-initial bg-red-500 hover:bg-red-600 text-white px-3 md:px-4 py-2 rounded-lg transition text-sm md:text-base whitespace-nowrap"
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MesCadeaux;