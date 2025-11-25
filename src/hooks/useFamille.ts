import { useState, useEffect } from 'react';
import { famillesAPI } from '../services/api';
import type { Famille } from '../types';

export const useFamille = (familleId: number | undefined) => {
  const [famille, setFamille] = useState<Famille | null>(null);
  const [mesFamilles, setMesFamilles] = useState<Famille[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (familleId) {
      loadFamille();
      loadMesFamilles();
    }
  }, [familleId]);

  const loadFamille = async () => {
    if (!familleId) return;
    
    try {
      const response = await famillesAPI.getOne(familleId);
      setFamille(response.data);
    } catch (error) {
      console.error('Erreur chargement famille:', error);
      throw error;
    }
  };

  const loadMesFamilles = async () => {
    try {
      const response = await famillesAPI.getAll();
      setMesFamilles(response.data);
    } catch (error) {
      console.error('Erreur chargement mes familles:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    famille,
    mesFamilles,
    loading,
    reload: loadFamille,
  };
};