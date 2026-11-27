import { useState, useEffect } from 'react';
import { cadeauxAPI } from '../services/api';
import type { Cadeau } from '../types';

export const useCadeaux = (familleId: number | undefined) => {
  const [cadeaux, setCadeaux] = useState<Cadeau[]>([]);

  const loadCadeaux = async () => {
    if (!familleId) return;
    try {
      const response = await cadeauxAPI.getByFamille(familleId);
      setCadeaux(response.data);
    } catch (error) {
      console.error('Erreur chargement cadeaux:', error);
    }
  };

  useEffect(() => {
    if (familleId) void loadCadeaux();
  }, [familleId]);

  const createCadeau = async (data: Partial<Cadeau>) => {
    await cadeauxAPI.create(data);
    await loadCadeaux();
  };

  return { cadeaux, createCadeau, reload: loadCadeaux };
};
