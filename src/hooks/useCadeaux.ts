import { useState, useEffect } from 'react';
import { cadeauxAPI, contributionsAPI } from '../services/api';
import type { Cadeau, ContributionWithUser } from '../types';

export const useCadeaux = (familleId: number | undefined, userId: number | undefined) => {
  const [cadeaux, setCadeaux] = useState<Cadeau[]>([]);
  const [contributions, setContributions] = useState<Record<number, ContributionWithUser[]>>({});

  useEffect(() => {
    if (familleId) {
      loadCadeaux();
    }
  }, [familleId]);

  const loadCadeaux = async () => {
    if (!familleId) return;

    try {
      const response = await cadeauxAPI.getAll();
      const filteredCadeaux = response.data.filter(c => c.famille_ids?.includes(familleId));
      setCadeaux(filteredCadeaux);

      // Charger les contributions (sauf si propriétaire)
      const contribsData: Record<number, ContributionWithUser[]> = {};
      await Promise.all(
        filteredCadeaux.map(async (cadeau) => {
          if (cadeau.owner_id !== userId) {
            try {
              const contribRes = await contributionsAPI.getForCadeau(cadeau.id);
              contribsData[cadeau.id] = contribRes.data;
            } catch (error) {
              contribsData[cadeau.id] = [];
            }
          } else {
            contribsData[cadeau.id] = [];
          }
        })
      );
      setContributions(contribsData);
    } catch (error) {
      console.error('Erreur chargement cadeaux:', error);
    }
  };

  const createCadeau = async (data: Partial<Cadeau>) => {
    await cadeauxAPI.create(data);
    await loadCadeaux();
  };

  const markPurchased = async (cadeauId: number) => {
    await cadeauxAPI.markPurchased(cadeauId);
    await loadCadeaux();
  };

  const unmarkPurchased = async (cadeauId: number) => {
    await cadeauxAPI.unmarkPurchased(cadeauId);
    await loadCadeaux();
  };

  return {
    cadeaux,
    contributions,
    createCadeau,
    markPurchased,
    unmarkPurchased,
    reload: loadCadeaux,
  };
};